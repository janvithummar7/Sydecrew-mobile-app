import { AppState } from 'react-native';
import { Directory, File, Paths, UploadType } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as Crypto from 'expo-crypto';
import { ApiError } from '../api';
import { companionApi } from '../companion/api';
import type { Companion } from '../companion/types';
import { afterFailure, due, parseQueue, remove, replaceSide, restartFromUrl, upsert, type PendingUpload, type Side, type UploadKind } from './queue';

/**
 * Resumable uploads of profile photos and ID images (brief §6.3, decision 9).
 *
 * 1. prepare(): the picked / captured image is re-encoded on the device as
 *    JPEG (HEIC and anything else become JPEG; the API accepts JPEG, PNG and
 *    WebP only), copied into the app's document directory and hashed (SHA-256).
 * 2. The pending upload is written to uploads/queue.json, so it survives the
 *    app being backgrounded, killed or offline.
 * 3. The API is asked for an upload URL. On a retry the SAME asset_id is sent,
 *    and the API re-issues a URL for that upload. Bytes go straight to storage
 *    (PUT for the dev provider, multipart POST with the signed fields for S3);
 *    iOS keeps background transfers going while the app is suspended.
 * 4. confirm (idempotent) makes the API verify size, hash and type.
 * Failures that may pass (offline, timeouts, 429, 5xx) back off and retry;
 * the rest (wrong type, too small ...) are reported and dropped.
 */
type Listener = (s: UploaderState) => void;
export type UploaderState = { items: PendingUpload[]; failures: { id: string; kind: UploadKind; side?: Side; message: string }[]; companion: Companion | null };

let state: UploaderState = { items: [], failures: [], companion: null };
let loaded = false;
let running: Promise<void> | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<Listener>();
const waiters = new Map<string, { resolve: (c: Companion) => void; reject: (e: Error) => void }>();

const uploadsDir = () => {
  const d = new Directory(Paths.document, 'uploads');
  if (!d.exists) d.create({ intermediates: true, idempotent: true });
  return d;
};
const queueFile = () => new File(uploadsDir(), 'queue.json');

function emit(patch: Partial<UploaderState>) {
  state = { ...state, ...patch };
  for (const l of listeners) l(state);
}

function persist() {
  try {
    queueFile().write(JSON.stringify(state.items));
  } catch (err) {
    console.warn('upload queue not saved', err);
  }
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const f = queueFile();
    const items = parseQueue(f.exists ? f.textSync() : null).filter((i) => new File(i.localUri).exists);
    emit({ items });
  } catch {
    emit({ items: [] });
  }
}

const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');

/** JPEG copy in the document directory, with its size and SHA-256. */
async function prepare(uri: string, { maxSide = 2400, width, height }: { maxSide?: number; width?: number; height?: number }) {
  const ctx = ImageManipulator.manipulate(uri);
  if (width && height && Math.max(width, height) > maxSide) {
    if (width >= height) ctx.resize({ width: maxSide, height: null });
    else ctx.resize({ width: null, height: maxSide });
  }
  const rendered = await ctx.renderAsync();
  const out = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: 0.88 });
  const id = Crypto.randomUUID();
  const dest = new File(uploadsDir(), `${id}.jpg`);
  new File(out.uri).copy(dest);
  const bytes = await dest.bytes();
  const sha256 = hex(await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, bytes));
  return { id, localUri: dest.uri, bytes: bytes.length, sha256 };
}

/**
 * Adds an image to the queue and starts uploading. The returned promise
 * resolves with the updated companion view once the API confirmed the file,
 * or rejects with the reason it was refused. Even if the screen goes away
 * (or the app is closed), the queue keeps going on the next run.
 */
export async function enqueue(input: { kind: UploadKind; side?: Side; uri: string; width?: number; height?: number }): Promise<Companion> {
  load();
  const p = await prepare(input.uri, { width: input.width, height: input.height });
  const item: PendingUpload = {
    id: p.id,
    kind: input.kind,
    side: input.side,
    localUri: p.localUri,
    mime: 'image/jpeg',
    bytes: p.bytes,
    sha256: p.sha256,
    assetId: null,
    stage: 'PREPARED',
    attempts: 0,
    nextAttemptAt: 0,
    createdAt: Date.now(),
  };
  let items = state.items;
  if (input.kind === 'DOCUMENT' && input.side) {
    for (const old of items.filter((x) => x.kind === 'DOCUMENT' && x.side === input.side)) dropFile(old);
    items = replaceSide(items, input.side);
  }
  emit({ items: upsert(items, item), failures: state.failures.filter((f) => !(f.kind === input.kind && f.side === input.side)) });
  persist();
  const done = new Promise<Companion>((resolve, reject) => waiters.set(item.id, { resolve, reject }));
  void process();
  return done;
}

function dropFile(item: PendingUpload) {
  try {
    const f = new File(item.localUri);
    if (f.exists) f.delete();
  } catch {
    // already gone
  }
}

async function uploadTo(item: PendingUpload): Promise<PendingUpload> {
  const decl = { mime: item.mime, bytes: item.bytes, sha256: item.sha256, ...(item.assetId ? { asset_id: item.assetId } : {}) };
  let target;
  try {
    const res = item.kind === 'PHOTO' ? await companionApi.photoUploadUrl(decl) : await companionApi.documentUploadUrl({ ...decl, side: item.side! });
    target = res.upload;
    item = { ...item, assetId: res.asset_id };
    emit({ items: upsert(state.items, item) });
    persist();
  } catch (err) {
    // A retry after the bytes already arrived: go straight to confirm.
    if (err instanceof ApiError && err.code === 'UPLOAD_ALREADY_RECEIVED') return { ...item, stage: 'UPLOADED' };
    throw err;
  }
  const result = await new File(item.localUri).upload(target.url, {
    httpMethod: target.method,
    uploadType: target.method === 'POST' ? UploadType.MULTIPART : UploadType.BINARY_CONTENT,
    headers: target.headers,
    parameters: target.fields,
    fieldName: 'file',
    mimeType: item.mime,
  });
  if (result.status === 403) throw new ApiError(403, { code: 'UPLOAD_URL_EXPIRED', message: 'The upload link expired.' });
  if (result.status < 200 || result.status >= 300) {
    throw new ApiError(result.status, { code: `UPLOAD_HTTP_${result.status}`, message: 'The upload did not go through.' });
  }
  return { ...item, stage: 'UPLOADED' };
}

async function runOne(item: PendingUpload) {
  try {
    let current = item;
    if (current.stage !== 'UPLOADED') current = await uploadTo(current);
    emit({ items: upsert(state.items, current) });
    persist();
    const view = current.kind === 'PHOTO' ? await companionApi.confirmPhoto(current.assetId!) : await companionApi.confirmDocument(current.assetId!);
    dropFile(current);
    emit({ items: remove(state.items, current.id), companion: view.companion });
    persist();
    waiters.get(current.id)?.resolve(view.companion);
    waiters.delete(current.id);
  } catch (err) {
    const e = err instanceof ApiError ? err : new ApiError(0, { code: 'NETWORK_ERROR', message: 'The upload did not go through.' });
    // An expired link is not a failure of the file: ask for a new link for the same upload.
    const retried = e.code === 'UPLOAD_URL_EXPIRED' ? { ...restartFromUrl(item), nextAttemptAt: Date.now() } : afterFailure(item, Date.now(), e.status, e.code, e.message);
    if (retried) {
      emit({ items: upsert(state.items, retried) });
    } else {
      dropFile(item);
      emit({ items: remove(state.items, item.id), failures: [...state.failures, { id: item.id, kind: item.kind, side: item.side, message: e.message }] });
      waiters.get(item.id)?.reject(e);
      waiters.delete(item.id);
    }
    persist();
  }
}

/** Works through every due item, one at a time; schedules the next retry. */
export function process(): Promise<void> {
  load();
  if (running) return running;
  running = (async () => {
    for (;;) {
      const next = due(state.items, Date.now())[0];
      if (!next) break;
      await runOne(next);
    }
  })().finally(() => {
    running = null;
    if (timer) clearTimeout(timer);
    const soonest = Math.min(...state.items.map((i) => i.nextAttemptAt));
    if (Number.isFinite(soonest)) timer = setTimeout(() => void process(), Math.max(1000, soonest - Date.now()));
  });
  return running;
}

/** Retry everything now (e.g. the user tapped "Try again", or the app came back online). */
export function retryAll() {
  emit({ items: state.items.map((i) => ({ ...i, nextAttemptAt: 0 })) });
  persist();
  return process();
}

export function subscribe(listener: Listener) {
  load();
  listeners.add(listener);
  listener(state);
  return () => {
    listeners.delete(listener);
  };
}

export const dismissFailure = (id: string) => emit({ failures: state.failures.filter((f) => f.id !== id) });

/** Resume the queue whenever the app comes back to the foreground. */
let watching = false;
export function startUploader() {
  load();
  if (!watching) {
    watching = true;
    AppState.addEventListener('change', (s) => {
      if (s === 'active') void retryAll();
    });
  }
  void process();
}

import { File, Paths, UploadType } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as Crypto from 'expo-crypto';
import { ApiError } from '../api';
import { commsApi } from './api';

const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');

/**
 * A chat photo (Feature 5): re-encoded on the device as JPEG (at most 1600 px,
 * which also drops EXIF location), hashed, uploaded straight to storage, and
 * returned as an asset id to send. The API holds every chat image for review
 * before the other person sees it.
 */
export function uploadChatImage(conversationId: string, picked: Picked): Promise<string> {
  return uploadImage(picked, (body) => commsApi.imageUploadUrl(conversationId, body), 'chat');
}

type Picked = { uri: string; width?: number; height?: number };
type UrlBody = { mime: 'image/jpeg'; bytes: number; sha256: string };
type UrlRes = { asset_id: string; upload: { url: string; method: string; [k: string]: unknown } };

/**
 * The shared photo pipeline (chat images; dispute evidence in Feature 6):
 * re-encode, hash, ask the API for an upload URL, upload, return the asset id.
 */
export async function uploadImage(picked: Picked, getUrl: (body: UrlBody) => Promise<UrlRes>, prefix: string): Promise<string> {
  const ctx = ImageManipulator.manipulate(picked.uri);
  const maxSide = 1600;
  if (picked.width && picked.height && Math.max(picked.width, picked.height) > maxSide) {
    if (picked.width >= picked.height) ctx.resize({ width: maxSide, height: null });
    else ctx.resize({ width: null, height: maxSide });
  }
  const rendered = await ctx.renderAsync();
  const out = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: 0.85 });
  const file = new File(Paths.cache, `${prefix}-${Crypto.randomUUID()}.jpg`);
  new File(out.uri).copy(file);
  try {
    const bytes = await file.bytes();
    const sha256 = hex(await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, bytes));
    const { asset_id: assetId, upload } = await getUrl({ mime: 'image/jpeg', bytes: bytes.length, sha256 });
    const res = await file.upload(upload.url, {
      httpMethod: upload.method as 'PUT' | 'POST' | 'PATCH',
      uploadType: upload.method === 'POST' ? UploadType.MULTIPART : UploadType.BINARY_CONTENT,
      headers: upload.headers as Record<string, string> | undefined,
      parameters: upload.fields as Record<string, string> | undefined,
      fieldName: 'file',
      mimeType: 'image/jpeg',
    });
    if (res.status < 200 || res.status >= 300) throw new ApiError(res.status, { code: `UPLOAD_HTTP_${res.status}`, message: 'The photo did not upload. Please try again.' });
    return assetId;
  } finally {
    try {
      if (file.exists) file.delete();
    } catch {
      // cache is cleared by the system anyway
    }
  }
}

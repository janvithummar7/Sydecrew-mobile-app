/**
 * The quote being reviewed (booking details -> review and pay). In memory
 * only: a quote is valid for 10 minutes, so after an app restart the customer
 * simply gets a new one. The attempt keeps one Idempotency-Key per quote.
 */
import { createAttempt } from './helpers';
import type { Quote } from './types';

type Draft = { quote: Quote; notes: string; companionId: string };
let current: Draft | null = null;

export const attempt = createAttempt();
export const setDraft = (d: Draft) => {
  current = d;
};
export const getDraft = () => current;
export const clearDraft = () => {
  current = null;
  attempt.reset();
};

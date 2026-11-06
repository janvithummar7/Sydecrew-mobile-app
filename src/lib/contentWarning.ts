/**
 * Live warning while a companion types their intro or a boundary. It mirrors
 * the API's filter (Sydecrew-be/src/lib/contentFilter.js) closely enough to
 * warn early; the API still makes the final decision.
 */
export type ContentProblem = 'PHONE' | 'EMAIL' | 'URL' | 'SOCIAL';

const DIGIT_WORDS = ['zero', 'oh', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const PATTERNS: Record<ContentProblem, RegExp[]> = {
  PHONE: [/(?:\+?\d[\s().-]*){8,}/, new RegExp(`\\b(?:(?:${DIGIT_WORDS.join('|')})[\\s,.-]*){7,}`, 'i')],
  EMAIL: [/[a-z0-9._%+-]+\s*(?:@|\(at\)|\[at\]|\s+at\s+)\s*[a-z0-9-]+\s*(?:\.|\(dot\)|\[dot\]|\s+dot\s+)\s*[a-z]{2,}/i],
  URL: [/\b(?:https?:\/\/|www\.)\S+/i, /\b[a-z0-9-]+\.(?:com|in|net|org|io|co|me|app|link|ly)\b/i],
  SOCIAL: [/(?:^|[\s(])@[a-z0-9_.]{3,}/i, /\b(?:insta(?:gram)?|snap(?:chat)?|telegram|whats\s?app|wa\.me|facebook|twitter|tiktok)\b/i],
};

const MESSAGES: Record<ContentProblem, string> = {
  PHONE: 'Remove phone numbers. Customers contact you only through Sydecrew.',
  EMAIL: 'Remove email addresses. Customers contact you only through Sydecrew.',
  URL: 'Remove links and website addresses.',
  SOCIAL: 'Remove social media handles and requests to contact you elsewhere.',
};

export function contactProblems(text: string): ContentProblem[] {
  return (Object.keys(PATTERNS) as ContentProblem[]).filter((k) => PATTERNS[k].some((re) => re.test(text)));
}

/** The message to show under the field, or null when the text looks fine. */
export function contactWarning(text: string): string | null {
  const p = contactProblems(text);
  return p.length ? MESSAGES[p[0]!] : null;
}

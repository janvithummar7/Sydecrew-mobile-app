/**
 * API shapes, taken from the generated contract (src/lib/contract/schema.ts,
 * from contracts/openapi.json). Never hand-write a request or response type:
 * change the backend schema, export the contract, run `npm run contract:gen`.
 */
import type { components } from './contract/schema';

type S = components['schemas'];

export type Me = S['User'];
export type Challenge = S['OtpChallenge'];
export type LoginResponse = S['LoginResponse'];
export type SessionResponse = S['SessionResponse'];
export type OnboardingOptions = S['OnboardingOptions'];
export type OnboardingInput = S['postOnboardingCompleteBody'];
export type ApiErrorBody = S['ErrorResponse']['error'];
export type Schemas = S;

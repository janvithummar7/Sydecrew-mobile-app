/** Earnings, payouts and payout account (Feature 6), from the generated contract. */
import type { components } from '../contract/schema';

type S = components['schemas'];
export type EarningsSummary = S['EarningsSummaryResponse'];
export type Earnings = S['EarningsResponse'];
export type Earning = Earnings['earnings'][number];
export type Payouts = S['PayoutsResponse'];
export type PayoutItem = Payouts['payouts'][number];
export type Payout = S['PayoutResponse']['payout'];
export type PayoutAccountState = S['PayoutAccountResponse'];
export type PayoutAccount = NonNullable<PayoutAccountState['current']>;
export type PayoutAccountInput = S['postCompanionPayoutAccountBody'];
export type EarningStatus = S['EarningStatus'];
export type PayoutStatus = S['PayoutStatus'];
export type PayoutAccountStatus = S['PayoutAccountStatus'];

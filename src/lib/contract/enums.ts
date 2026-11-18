/* GENERATED from contracts/*.json by scripts/contract.mjs. Do not edit; run `npm run contract:gen`. */

export const AppealStatusValues = ["SUBMITTED","IN_REVIEW","UPHELD","OVERTURNED"] as const;
export type AppealStatus = (typeof AppealStatusValues)[number];

export const ApprovalStatusValues = ["PENDING","APPROVED","REJECTED","EXPIRED","EXECUTED"] as const;
export type ApprovalStatus = (typeof ApprovalStatusValues)[number];

export const AutoReasonValues = ["DOCUMENT_NOT_AUTHENTIC","DOCUMENT_UNREADABLE","LIVENESS_FAILED","PHOTO_FACE_MISMATCH","PRIMARY_PHOTO_FACE","UNDERAGE","UNDER_CATEGORY_MIN"] as const;
export type AutoReason = (typeof AutoReasonValues)[number];

export const BookingCancelReasonValues = ["CHANGE_OF_PLANS","EMERGENCY","FEEL_UNSAFE","SCHEDULE_CONFLICT","VENUE_ISSUE","OTHER"] as const;
export type BookingCancelReason = (typeof BookingCancelReasonValues)[number];

export const BookingIssueValues = ["NO_SHOW","LATE_ARRIVAL","ENDED_EARLY","BOUNDARY_CROSSED","SAFETY_CONCERN","OTHER"] as const;
export type BookingIssue = (typeof BookingIssueValues)[number];

export const BookingModeValues = ["INSTANT","REQUEST"] as const;
export type BookingMode = (typeof BookingModeValues)[number];

export const BookingPartyValues = ["CUSTOMER","COMPANION"] as const;
export type BookingParty = (typeof BookingPartyValues)[number];

export const BookingRejectReasonValues = ["NOT_AVAILABLE","VENUE_NOT_SUITABLE","ACTIVITY_NOT_SUITABLE","TOO_SHORT_NOTICE","OTHER"] as const;
export type BookingRejectReason = (typeof BookingRejectReasonValues)[number];

export const BookingStatusValues = ["DRAFT","REQUESTED","AWAITING_COMPANION","ACCEPTED","REJECTED","PAYMENT_PENDING","CONFIRMED","IN_PROGRESS","COMPLETED","CANCELLED","EXPIRED","DISPUTED","REFUNDED","PARTIALLY_REFUNDED"] as const;
export type BookingStatus = (typeof BookingStatusValues)[number];

export const CategoryCodeValues = ["FRIEND","PLUS_ONE","COMPANION","CREW_CARE","CREW_EVENTS"] as const;
export type CategoryCode = (typeof CategoryCodeValues)[number];

export const CategoryStatusValues = ["PENDING","APPROVED","INELIGIBLE","REMOVED"] as const;
export type CategoryStatus = (typeof CategoryStatusValues)[number];

export const ChatClosedReasonValues = ["BLOCKED","CLOSED","NOT_OPEN"] as const;
export type ChatClosedReason = (typeof ChatClosedReasonValues)[number];

export const CompanionNextStepValues = ["PROFILE","PHOTOS","CATEGORIES","DOCUMENTS","SUBMIT","WAITING","FIX_REQUIRED","COOLDOWN","SETUP","GO_LIVE","LIVE","PAUSED","REJECTED","SUSPENDED"] as const;
export type CompanionNextStep = (typeof CompanionNextStepValues)[number];

export const CompanionStatusValues = ["DRAFT","SUBMITTED","IN_REVIEW","NEEDS_CHANGES","APPROVED","SETUP","LIVE","PAUSED","REVERIFICATION_REQUIRED","SUSPENDED","REJECTED"] as const;
export type CompanionStatus = (typeof CompanionStatusValues)[number];

export const ComplaintTypeValues = ["NO_SHOW","LATE","SERVICE_QUALITY","BOUNDARY_VIOLATION","BILLING","PAYMENT_FAILED","SAFETY","HARASSMENT","THREAT","ASSAULT","UNSAFE_SITUATION","OTHER"] as const;
export type ComplaintType = (typeof ComplaintTypeValues)[number];

export const DiscoverySortValues = ["relevance","price_asc","price_desc","soonest"] as const;
export type DiscoverySort = (typeof DiscoverySortValues)[number];

export const DisputeResolutionValues = ["RELEASE_TO_COMPANION","FULL_REFUND","PARTIAL_REFUND"] as const;
export type DisputeResolution = (typeof DisputeResolutionValues)[number];

export const DisputeStatusValues = ["OPEN","AWAITING_RESPONSE","UNDER_REVIEW","RESOLVED","APPEALED","CLOSED"] as const;
export type DisputeStatus = (typeof DisputeStatusValues)[number];

export const DocumentSideValues = ["FRONT","BACK","SELFIE"] as const;
export type DocumentSide = (typeof DocumentSideValues)[number];

export const EarningStatusValues = ["PENDING","ON_HOLD","AVAILABLE","IN_BATCH","PAID","FAILED","REVERSED","CLAWBACK"] as const;
export type EarningStatus = (typeof EarningStatusValues)[number];

export const EnforcementActionValues = ["WARNING","TEMP_SUSPENSION","PERMANENT_BAN","REINSTATEMENT"] as const;
export type EnforcementAction = (typeof EnforcementActionValues)[number];

export const EnforcementReasonValues = ["HARASSMENT","ABUSE","SOLICITATION","CONTACT_DETAILS","OFF_PLATFORM_PAYMENT","BOUNDARY_VIOLATION","NO_SHOWS","FAKE_PROFILE","FRAUD","SAFETY","OTHER"] as const;
export type EnforcementReason = (typeof EnforcementReasonValues)[number];

export const EnforcementStatusValues = ["PENDING_APPROVAL","ACTIVE","EXPIRED","OVERTURNED","REJECTED"] as const;
export type EnforcementStatus = (typeof EnforcementStatusValues)[number];

export const ErrorCodeValues = ["VALIDATION_FAILED","BAD_JSON","INVALID_INPUT","INVALID_REFERENCE","CONFLICT","NOT_FOUND","INTERNAL_ERROR","RATE_LIMITED","INVALID_STATUS_TRANSITION","CONTRACT_MISMATCH","AUTH_REQUIRED","TOKEN_EXPIRED","TOKEN_INVALID","SESSION_ENDED","INVALID_CREDENTIALS","ACCOUNT_LOCKED","ACCOUNT_DISABLED","ACCOUNT_SUSPENDED","ACCOUNT_EXISTS","ACCOUNT_NOT_FOUND","PHONE_NOT_VERIFIED","EMAIL_NOT_VERIFIED","INELIGIBLE_AGE","LINK_INVALID","OTP_INVALID","OTP_EXPIRED","OTP_USED","OTP_LOCKED","OTP_COOLDOWN","OTP_NOT_FOUND","OTP_RESEND_LIMIT","OTP_RESEND_TOO_SOON","OTP_SEND_LIMIT","OTP_SEND_FAILED","STAFF_ONLY","IP_NOT_ALLOWED","PERMISSION_DENIED","ROLE_REQUIRED","MFA_ENROLLMENT_REQUIRED","MFA_REQUIRED","MFA_STEP_UP_REQUIRED","MFA_CODE_INVALID","MFA_TOKEN_INVALID","MFA_ALREADY_ENABLED","MFA_NOT_STARTED","MFA_NOT_ENABLED","MFA_RESET_SELF","SECOND_APPROVER_REQUIRED","COMPANION_NOT_FOUND","PROFILE_UNAVAILABLE","APPLICATION_LOCKED","APPLICATION_INCOMPLETE","PROFILE_LOCKED","REAPPLY_BLOCKED","REAPPLY_COOLDOWN","CONTENT_NOT_ALLOWED","BELOW_CATEGORY_MIN_AGE","ACTIVITY_CATEGORY_MISMATCH","PHOTO_LIMIT","PHOTO_MINIMUM","PHOTO_NOT_FOUND","UPLOAD_NOT_FOUND","UPLOAD_ALREADY_RECEIVED","UPLOAD_MISMATCH","UPLOAD_NOT_PENDING","UPLOAD_MISSING","UPLOAD_CORRUPTED","UPLOAD_URL_EXPIRED","UPLOAD_TYPE_MISMATCH","UPLOAD_TOO_LARGE","UPLOAD_EMPTY","FILE_TOO_LARGE","IMAGE_UNREADABLE","UNSUPPORTED_IMAGE_TYPE","IMAGE_TOO_SMALL","VIEW_URL_EXPIRED","DOCUMENT_TYPE_REQUIRED","DOCUMENT_TYPE_UNAVAILABLE","AADHAAR_IMAGE_NOT_ALLOWED","VERIFICATION_NOT_OPEN","AUTO_CHECK_COOLDOWN","MANUAL_REVIEW_REQUIRED","LIVENESS_BY_UPLOAD","LIVENESS_SESSION_MISMATCH","DIGILOCKER_UNAVAILABLE","DIGILOCKER_NOT_STARTED","DIGILOCKER_FAILED","KYC_PROVIDER_NOT_CONFIGURED","INVALID_SIGNATURE","VERIFICATION_NOT_FOUND","NOT_IN_REVIEW","CLAIMED_BY_OTHER","CLAIM_REQUIRED","NOT_CLAIMED_BY_YOU","BLOCKED_BY_FLAG","FACE_MATCH_REQUIRED","APPROVAL_ALREADY_PENDING","APPROVAL_NOT_FOUND","APPROVAL_NOT_PENDING","APPROVAL_EXPIRED","NOT_AUTO_REJECTED","NEWER_ATTEMPT_EXISTS","DOCUMENT_NOT_FOUND","DOCUMENT_UNAVAILABLE","FLAG_NOT_FOUND","FLAG_NOT_OPEN","NOT_SUSPENDED","NOT_PENDING","CATEGORY_NOT_FOUND","NOT_APPROVED","NOT_READY","SETUP_INCOMPLETE","REVERIFICATION_DUE","NOT_LIVE","NOT_PAUSED","RATE_OUT_OF_BAND","AVAILABILITY_OVERLAP","EXCEPTION_NOT_FOUND","ONBOARDING_REQUIRED","VENUE_NOT_FOUND","REPORT_NOT_FOUND","REPORT_CLOSED","REVIEW_NOT_AVAILABLE","REVIEW_WINDOW_CLOSED","REVIEW_EXISTS","REVIEW_NOT_FOUND","PLAN_NOT_FOUND","SUBSCRIPTION_EXISTS","SUBSCRIPTION_NOT_FOUND","SUBSCRIPTION_PAST_DUE","SUBSCRIPTION_CANCELLING","SUBSCRIPTION_NOT_CANCELLING","SUBSCRIPTION_CHANGED","UPGRADE_PAYMENT_FAILED","PAYMENT_PROVIDER_UNAVAILABLE","MANDATE_NOT_FOUND","MANDATE_ALREADY_ATTEMPTED","ACCOUNT_ON_HOLD","SIGNUP_NOT_AVAILABLE","ALREADY_RESTRICTED","ACCOUNT_CLOSED","ENFORCEMENT_NOT_FOUND","ENFORCEMENT_NOT_ACTIVE","APPEAL_EXISTS","APPEAL_DECIDED","INDEPENDENT_REVIEWER_REQUIRED","NOT_BANNED","BOOKING_NOT_FOUND","OFFERING_UNAVAILABLE","PLUS_ONE_NOT_OPEN","VENUE_NOT_ALLOWED","VENUE_UNAVAILABLE","INSTANT_NOT_AVAILABLE","DURATION_OUT_OF_RANGE","TOO_SOON","TOO_FAR_AHEAD","DATE_BLOCKED","OUTSIDE_AVAILABILITY","DAILY_LIMIT_REACHED","SLOT_UNAVAILABLE","CUSTOMER_TIME_CONFLICT","QUOTE_NOT_FOUND","QUOTE_EXPIRED","QUOTE_ALREADY_USED","IDEMPOTENCY_KEY_REQUIRED","IDEMPOTENCY_KEY_REUSED","IDEMPOTENCY_MISMATCH","ACCOUNT_RESTRICTED","CUSTOMER_ONLY","COMPANION_ONLY","COMPANION_NOT_LIVE","REQUEST_EXPIRED","REQUEST_WITHDRAWN","NOT_PAYABLE","PAYMENT_WINDOW_CLOSED","PAYMENT_IN_PROGRESS","PAYMENT_ALREADY_ATTEMPTED","PAYMENT_NOT_FOUND","PAYMENT_PROVIDER_NOT_CONFIGURED","NOT_CANCELLABLE","USE_REJECT","MEETING_STARTED","NOTHING_TO_REFUND","REFUND_TOO_LARGE","REFUND_NOT_PENDING","CHECK_IN_NOT_AVAILABLE","CHECK_IN_NOT_OPEN","CHECK_IN_CLOSED","CHECK_OUT_NOT_AVAILABLE","ISSUE_WINDOW_CLOSED","NOT_DISPUTED","DISPUTE_ALREADY_RESOLVED","WEBHOOK_SIGNATURE_INVALID","WEBHOOK_INVALID","WEBHOOK_PROCESSING_FAILED","CONVERSATION_NOT_FOUND","CONVERSATION_BLOCKED","CHAT_CLOSED","MESSAGE_RATE_LIMITED","MESSAGE_NOT_FOUND","CANNOT_REPORT_OWN","MESSAGE_NOT_HELD","DEVICE_ID_REQUIRED","CALL_NOT_AVAILABLE","CALL_WINDOW_CLOSED","CALL_BLOCKED","CALL_LIMIT_REACHED","CALL_PROVIDER_NOT_CONFIGURED","CALL_SESSION_NOT_FOUND","DESK_PHONE_NOT_SET","NO_PHONE","TRUSTED_CONTACT_LIMIT","TRUSTED_CONTACT_EXISTS","TRUSTED_CONTACT_NOT_FOUND","INVITE_NOT_FOUND","LOCATION_WINDOW_CLOSED","LOCATION_SHARING_OFF","LOCATION_TOO_FREQUENT","SHARE_NOT_FOUND","SHARE_ENDED","INCIDENT_NOT_FOUND","INCIDENT_ALREADY_ACKNOWLEDGED","INCIDENT_NOT_ACKNOWLEDGED","INCIDENT_CLOSED","NO_OTHER_PARTY","ALREADY_FROZEN","USER_NOT_FOUND","ACCOUNT_DELETION_BLOCKED","STAFF_ACCOUNT","ACCOUNT_DELETION_NOT_PENDING","ACCOUNT_DELETION_PENDING","APPEAL_NO_MONEY_CHANGE","CONSENT_NOT_GIVEN","CONSENT_NOT_WITHDRAWABLE","DATA_EXPORT_LINK_INVALID","DATA_EXPORT_NOT_FOUND","DATA_EXPORT_NOT_READY","DATA_EXPORT_TOO_SOON","LAST_SUPER_ADMIN","OTP_NOT_YOURS","PASSWORD_INCORRECT","STAFF_EMAIL_IN_USE","STAFF_ENROLMENT_REQUIRED","STAFF_INVITE_INVALID","STAFF_INVITE_NOT_OPEN","STAFF_INVITE_PENDING","STAFF_NOT_ACTIVE","STAFF_NOT_FOUND","STAFF_SELF_ACTION","STATEMENT_LINK_INVALID","APPEAL_ALREADY_DECIDED","APPEAL_ALREADY_SUBMITTED","APPEAL_NOT_FOUND","APPEAL_OUTCOME_NOT_SUPPORTED","APPEAL_REVIEWER_CONFLICT","APPEAL_WINDOW_CLOSED","COMPANION_PROFILE_NOT_FOUND","COMPANION_STILL_SUSPENDED","DISPUTE_AWAITING_RESPONSE","DISPUTE_CLAIMED_BY_OTHER","DISPUTE_CLOSED_FOR_STATEMENTS","DISPUTE_NOT_APPEALABLE","DISPUTE_NOT_CLAIMED","DISPUTE_NOT_DECIDABLE","DISPUTE_NOT_FOUND","DISPUTE_RESPONSE_CLOSED","EARNING_TRANSITION_INVALID","NO_RECEIPT_YET","PAYOUT_ACCOUNT_CHANGE_IN_PROGRESS","PAYOUT_ACCOUNT_MISSING","PAYOUT_ACCOUNT_NOT_FOUND","PAYOUT_ACCOUNT_NOT_IN_REVIEW","PAYOUT_ACCOUNT_UNCHANGED","PAYOUT_BATCH_NOT_AWAITING_APPROVAL","PAYOUT_BATCH_NOT_FOUND","PAYOUT_HOLD_NOT_ACTIVE","PAYOUT_HOLD_NOT_FOUND","PAYOUT_NOT_FOUND","PAYOUT_NOT_RETRYABLE","PAYOUT_PROVIDER_NOT_CONFIGURED","REFUND_ALREADY_RE_RAISED","REFUND_DISPUTE_DECIDE_AGAIN","REFUND_NOT_FOUND","REFUND_NOT_REJECTED","STAFF_CANNOT_CHANGE_PAYOUT_ACCOUNT","STATEMENT_ALREADY_SUBMITTED","TICKET_ASSIGNED_TO_OTHER","TICKET_CLOSED","TICKET_NOT_FOUND","NOTIFICATION_NOT_FOUND","NOTIFICATION_NOT_RETRYABLE","SMS_PROVIDER_NOT_CONFIGURED","EMAIL_PROVIDER_NOT_CONFIGURED","WHATSAPP_PROVIDER_NOT_CONFIGURED"] as const;
export type ErrorCode = (typeof ErrorCodeValues)[number];

export const FixItemValues = ["DISPLAY_NAME","INTRO","PHOTOS_REPLACE","PRIMARY_PHOTO_FACE","PHOTO_FACE_MISMATCH","CATEGORIES","BOUNDARIES","ID_DOCUMENT_RETAKE","ID_DOCUMENT_OTHER_TYPE","ID_BACK_MISSING","SELFIE_RETAKE","NAME_MATCH"] as const;
export type FixItem = (typeof FixItemValues)[number];

export const FixStepValues = ["PROFILE","PHOTOS","CATEGORIES","DOCUMENTS"] as const;
export type FixStep = (typeof FixStepValues)[number];

export const FlagStatusValues = ["OPEN","CLEARED","CONFIRMED"] as const;
export type FlagStatus = (typeof FlagStatusValues)[number];

export const FlagTypeValues = ["DUPLICATE_FACE","DUPLICATE_ID","DUPLICATE_DEVICE","NAME_MISMATCH","AGE_BORDERLINE","MANUAL"] as const;
export type FlagType = (typeof FlagTypeValues)[number];

export const IdDocumentTypeValues = ["PAN","PASSPORT","DRIVING_LICENSE","VOTER_ID","AADHAAR"] as const;
export type IdDocumentType = (typeof IdDocumentTypeValues)[number];

export const IncidentOutcomeValues = ["SAFE_NO_ACTION","RESOLVED_BY_DESK","EMERGENCY_SERVICES","FALSE_ALARM","OTHER"] as const;
export type IncidentOutcome = (typeof IncidentOutcomeValues)[number];

export const IncidentStatusValues = ["OPEN","ACKNOWLEDGED","ESCALATED","IN_PROGRESS","RESOLVED","CLOSED"] as const;
export type IncidentStatus = (typeof IncidentStatusValues)[number];

export const MessageModerationValues = ["DELIVERED","MASKED","HELD","REJECTED"] as const;
export type MessageModeration = (typeof MessageModerationValues)[number];

export const MockMandateScenarioValues = ["AUTHORIZED","DECLINED","RENEWAL_FAILS_ONCE","CHARGES_FAIL"] as const;
export type MockMandateScenario = (typeof MockMandateScenarioValues)[number];

export const MockPaymentScenarioValues = ["SUCCESS","FAILED","PENDING_THEN_SUCCESS","DUPLICATE_WEBHOOK","LATE_SUCCESS","REFUND_FAIL_ONCE"] as const;
export type MockPaymentScenario = (typeof MockPaymentScenarioValues)[number];

export const ModerationStatusValues = ["PENDING","APPROVED","REJECTED"] as const;
export type ModerationStatus = (typeof ModerationStatusValues)[number];

export const OnboardingNextStepValues = ["VERIFY_PHONE","PROFILE"] as const;
export type OnboardingNextStep = (typeof OnboardingNextStepValues)[number];

export const PaymentStatusValues = ["CREATED","AUTHORIZED","CAPTURED","FAILED","REFUNDED","PARTIALLY_REFUNDED"] as const;
export type PaymentStatus = (typeof PaymentStatusValues)[number];

export const PayoutAccountStatusValues = ["PENDING_VERIFICATION","VERIFIED","NEEDS_REVIEW","REJECTED","COOLING","SUPERSEDED"] as const;
export type PayoutAccountStatus = (typeof PayoutAccountStatusValues)[number];

export const PayoutBatchStatusValues = ["DRAFT","AWAITING_APPROVAL","APPROVED","PROCESSING","COMPLETED","PARTIALLY_FAILED","CANCELLED"] as const;
export type PayoutBatchStatus = (typeof PayoutBatchStatusValues)[number];

export const PayoutHoldSourceValues = ["FINANCE","TRUST_SAFETY","SYSTEM"] as const;
export type PayoutHoldSource = (typeof PayoutHoldSourceValues)[number];

export const PayoutStatusValues = ["PENDING","AWAITING_APPROVAL","PROCESSING","PAID","FAILED","ON_HOLD","CANCELLED","REVERSED"] as const;
export type PayoutStatus = (typeof PayoutStatusValues)[number];

export const PlatformCancelReasonValues = ["SAFETY","VENUE_UNAVAILABLE","COMPANION_UNAVAILABLE","POLICY_VIOLATION","OTHER"] as const;
export type PlatformCancelReason = (typeof PlatformCancelReasonValues)[number];

export const ProfileReportReasonValues = ["FAKE_PROFILE","INAPPROPRIATE_CONTENT","OFF_PLATFORM_CONTACT","NOT_PLATONIC","SAFETY_CONCERN","OTHER"] as const;
export type ProfileReportReason = (typeof ProfileReportReasonValues)[number];

export const RefundStatusValues = ["PENDING_APPROVAL","APPROVED","PROCESSING","SUCCEEDED","FAILED","REJECTED"] as const;
export type RefundStatus = (typeof RefundStatusValues)[number];

export const RejectReasonValues = ["UNDERAGE","UNDER_CATEGORY_MIN","FAKE_DOCUMENT","IMPERSONATION","BANNED_MATCH","SAFETY","DUPLICATE_ACCOUNT","POLICY_VIOLATION","OTHER"] as const;
export type RejectReason = (typeof RejectReasonValues)[number];

export const ReviewReportReasonValues = ["FAKE_OR_MISLEADING","OFFENSIVE","CONTACT_DETAILS","NOT_ABOUT_THE_MEETING","PRIVATE_INFORMATION","OTHER"] as const;
export type ReviewReportReason = (typeof ReviewReportReasonValues)[number];

export const ReviewStatusValues = ["PUBLISHED","HIDDEN","FLAGGED"] as const;
export type ReviewStatus = (typeof ReviewStatusValues)[number];

export const ReviewTagValues = ["PUNCTUAL","GREAT_CONVERSATION","RESPECTFUL","KNOWLEDGEABLE","WARM_AND_FRIENDLY","GOOD_LISTENER","WELL_PLANNED","CLEAR_PLANS","FRIENDLY","GOOD_VENUE_CHOICE","KEPT_TO_BOUNDARIES"] as const;
export type ReviewTag = (typeof ReviewTagValues)[number];

export const RoleCodeValues = ["CUSTOMER","COMPANION","SUPER_ADMIN","OPS_MANAGER","SENIOR_OPS","VERIFICATION_EXECUTIVE","FINANCE_EXECUTIVE","TS_AGENT","TS_MANAGER","SUPPORT_EXECUTIVE","SAFETY_DESK"] as const;
export type RoleCode = (typeof RoleCodeValues)[number];

export const SubscriptionStatusValues = ["INCOMPLETE","TRIALING","ACTIVE","PAST_DUE","CANCELLED","EXPIRED","SUSPENDED"] as const;
export type SubscriptionStatus = (typeof SubscriptionStatusValues)[number];

export const TicketStatusValues = ["OPEN","IN_PROGRESS","PENDING_USER","RESOLVED","CLOSED"] as const;
export type TicketStatus = (typeof TicketStatusValues)[number];

export const TimeWindowValues = ["morning","afternoon","evening"] as const;
export type TimeWindow = (typeof TimeWindowValues)[number];

export const UserStatusValues = ["PENDING","ACTIVE","SUSPENDED","BANNED","DEACTIVATED","DELETED"] as const;
export type UserStatus = (typeof UserStatusValues)[number];

export const VenueStatusValues = ["PROPOSED","APPROVED","SUSPENDED","REJECTED","ARCHIVED"] as const;
export type VenueStatus = (typeof VenueStatusValues)[number];

export const VenueTypeValues = ["CAFE","RESTAURANT","MALL","CINEMA","EVENT_VENUE","BANQUET_HALL","PARK","TEMPLE","MUSEUM","PUBLIC_ROUTE","OTHER","CORPORATE_VENUE","CULTURAL_VENUE","PUBLIC_SPACE"] as const;
export type VenueType = (typeof VenueTypeValues)[number];

export const VerificationStatusValues = ["PENDING_UPLOAD","SUBMITTED","AUTO_CHECKING","AUTO_REJECTED","IN_REVIEW","NEEDS_CHANGES","APPROVED","REJECTED","EXPIRED"] as const;
export type VerificationStatus = (typeof VerificationStatusValues)[number];

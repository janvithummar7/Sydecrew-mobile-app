/* GENERATED from contracts/*.json by scripts/contract.mjs. Do not edit; run `npm run contract:gen`. */
export interface paths {
    "/api/v1/admin/appeals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Dispute appeals */
        get: operations["getAdminAppeals"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/appeals/{id}/decide": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Decide an appeal (never the original decider). OVERTURN changes the money through the ledger. */
        post: operations["postAdminAppealsByIdDecide"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/approvals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Second-approver requests */
        get: operations["getAdminApprovals"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/approvals/{id}/decision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve or reject a second-approver request */
        post: operations["postAdminApprovalsByIdDecision"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/bookings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Bookings (staff) */
        get: operations["getAdminBookings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/bookings/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** One booking with its timeline, money breakdown, ledger, payment events and refunds (staff) */
        get: operations["getAdminBookingsById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/bookings/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Platform cancellation (safety, venue, policy): always a full refund; audit-logged */
        post: operations["postAdminBookingsByIdCancel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/bookings/{id}/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resolve a reported issue (refunds above the threshold need a Finance second approver) */
        post: operations["postAdminBookingsByIdResolve"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/categories/{id}/price-band": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Change a category price band (pauses rates outside it) */
        patch: operations["patchAdminCategoriesByIdPriceBand"];
        trace?: never;
    };
    "/api/v1/admin/companions/{id}/lift-suspension": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Propose lifting a suspension (second approver) */
        post: operations["postAdminCompanionsByIdLiftSuspension"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/companions/{id}/require-reverification": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Send a companion to re-verification (risk) */
        post: operations["postAdminCompanionsByIdRequireReverification"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/companions/{id}/suspend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Suspend a companion */
        post: operations["postAdminCompanionsByIdSuspend"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/disputes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Dispute queue: oldest first, with deadlines and claims */
        get: operations["getAdminDisputes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/disputes/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** One dispute with statements and system evidence (every read is access-logged) */
        get: operations["getAdminDisputesById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/disputes/{id}/claim": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Claim a dispute (a lease; only the holder can decide) */
        post: operations["postAdminDisputesByIdClaim"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/disputes/{id}/decide": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Decide a dispute: release, full refund or partial refund (largest remainder); optional strike */
        post: operations["postAdminDisputesByIdDecide"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/disputes/{id}/release": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Give a claimed dispute back to the queue */
        post: operations["postAdminDisputesByIdRelease"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/disputes/{id}/transcript": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** The booking chat transcript (access-logged) */
        get: operations["getAdminDisputesByIdTranscript"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/incidents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Safety desk queue (live; ack countdown) */
        get: operations["getAdminIncidents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/incidents/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Incident: booking, parties, location, timeline, transcript, call metadata */
        get: operations["getAdminIncidentsById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/incidents/{id}/ack": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Acknowledge (one agent wins) */
        post: operations["postAdminIncidentsByIdAck"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/incidents/{id}/call-contact": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Masked call to the reporter's trusted contact */
        post: operations["postAdminIncidentsByIdCallContact"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/incidents/{id}/call-user": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Masked call between the desk and the reporter (or the other party) */
        post: operations["postAdminIncidentsByIdCallUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/incidents/{id}/close": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Close with an outcome (a follow-up is scheduled 24 h later) */
        post: operations["postAdminIncidentsByIdClose"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/incidents/{id}/follow-up": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Record the follow-up as done */
        post: operations["postAdminIncidentsByIdFollowUp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/incidents/{id}/freeze": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Freeze the other party now (suspend, cancel pending bookings with full refunds); reviewed by a T&S manager afterwards */
        post: operations["postAdminIncidentsByIdFreeze"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/incidents/{id}/mark-safe": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark the reporter safe */
        post: operations["postAdminIncidentsByIdMarkSafe"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/messages/{id}/decision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Release or reject a held message */
        post: operations["postAdminMessagesByIdDecision"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/messages/held": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Chat messages held for review */
        get: operations["getAdminMessagesHeld"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/moderation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Pending edits to approved profiles */
        get: operations["getAdminModeration"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/moderation/{kind}/{id}/decision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve or reject a pending edit */
        post: operations["postAdminModerationByKindByIdDecision"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/notifications/{id}/retry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Queue a failed or dead notification again (attempts reset) */
        post: operations["postAdminNotificationsByIdRetry"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/notifications/failures": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Notifications that failed or went DEAD after every retry (recipient masked, no message text) */
        get: operations["getAdminNotificationsFailures"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/payout-accounts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Payout accounts by status (no numbers; last 4 digits) */
        get: operations["getAdminPayoutAccounts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/payout-accounts/{id}/decide": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Decide an account that needs review. Approval keeps the cooling hold; staff can never enter or change an account. */
        post: operations["postAdminPayoutAccountsByIdDecide"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/payout-holds": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Payout holds */
        get: operations["getAdminPayoutHolds"];
        put?: never;
        /** Hold a companion's payouts (unsent payouts are pulled at once) */
        post: operations["postAdminPayoutHolds"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/payout-holds/{id}/release": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Release a hold (a Trust & Safety hold needs a second approver) */
        post: operations["postAdminPayoutHoldsByIdRelease"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/payouts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Payouts (Finance) */
        get: operations["getAdminPayouts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/payouts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** One payout with its lines (Finance) */
        get: operations["getAdminPayoutsById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/payouts/{id}/retry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Send a payout that is waiting for a retry now */
        post: operations["postAdminPayoutsByIdRetry"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/payouts/batches": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Payout batches (Finance) */
        get: operations["getAdminPayoutsBatches"];
        put?: never;
        /** Build the payout batch for a date now (idempotent per date). Above the threshold it waits for a second approver. */
        post: operations["postAdminPayoutsBatches"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/payouts/batches/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** One payout batch with its payouts (Finance) */
        get: operations["getAdminPayoutsBatchesById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/payouts/batches/{id}/request-approval": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Ask for the second approval of a batch the weekly job built (maker-checker) */
        post: operations["postAdminPayoutsBatchesByIdRequestApproval"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/payouts/reconcile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Run payout reconciliation and the money invariants now */
        post: operations["postAdminPayoutsReconcile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/refunds": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Refunds (Finance), with re-raise links */
        get: operations["getAdminRefunds"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/refunds/{id}/re-raise": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Raise a rejected refund again (once; the approval rule applies again) */
        post: operations["postAdminRefundsByIdReRaise"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Reports queue (profile reports) */
        get: operations["getAdminReports"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/reports/{id}/decision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Dismiss, warn, or escalate (re-verification / suspension) a profile report */
        post: operations["postAdminReportsByIdDecision"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/settings/pricing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Pricing, tax and cancellation settings (placeholders) */
        get: operations["getAdminSettingsPricing"];
        put?: never;
        /** Propose a settings change (a second approver with settings.pricing.edit applies it) */
        post: operations["postAdminSettingsPricing"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/staff": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Staff accounts and open invites */
        get: operations["getAdminStaff"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/staff/{id}/deactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Offboard: deactivate, sign out everywhere, release claims, leave the on-call list */
        post: operations["postAdminStaffByIdDeactivate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/staff/{id}/mfa-reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Ask to reset a staff member's authenticator (a second super admin approves) */
        post: operations["postAdminStaffByIdMfaReset"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/staff/invites": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Invite a staff member (single-use link, 48 h; password and authenticator in one flow) */
        post: operations["postAdminStaffInvites"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/staff/invites/{id}/revoke": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Revoke an open invite */
        post: operations["postAdminStaffInvitesByIdRevoke"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/support/tickets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Support queue by first-response SLA */
        get: operations["getAdminSupportTickets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/support/tickets/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** One ticket with internal notes */
        get: operations["getAdminSupportTicketsById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/support/tickets/{id}/claim": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Assign a ticket to me */
        post: operations["postAdminSupportTicketsByIdClaim"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/support/tickets/{id}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reply to the user (or add an internal note); contact details are masked */
        post: operations["postAdminSupportTicketsByIdMessages"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/support/tickets/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Set a ticket status */
        post: operations["postAdminSupportTicketsByIdStatus"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/venue-proposals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Venues proposed by customers and companions */
        get: operations["getAdminVenueProposals"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/venue-proposals/{id}/decision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve or reject a proposed venue */
        post: operations["postAdminVenueProposalsByIdDecision"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/venues": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** All venues (staff view incl. address) */
        get: operations["getAdminVenues"];
        put?: never;
        /** Add a venue (starts PROPOSED) */
        post: operations["postAdminVenues"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/venues/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Venue detail (staff) */
        get: operations["getAdminVenuesById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Edit a venue */
        patch: operations["patchAdminVenuesById"];
        trace?: never;
    };
    "/api/v1/admin/venues/{id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve a venue */
        post: operations["postAdminVenuesByIdApprove"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/venues/{id}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reject a venue */
        post: operations["postAdminVenuesByIdReject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/venues/{id}/suspend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Suspend a venue */
        post: operations["postAdminVenuesByIdSuspend"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/verification-flags/{id}/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Clear or confirm a flag (clearing a banned match needs a second approver) */
        post: operations["postAdminVerificationFlagsByIdResolve"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/verifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Verification queue (flagged first, then oldest) */
        get: operations["getAdminVerifications"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/verifications/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Application detail: checks, OCR diff, flags, photos, history, permissions */
        get: operations["getAdminVerificationsById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/verifications/{id}/claim": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Claim an application (30-min lease, exclusive) */
        post: operations["postAdminVerificationsByIdClaim"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/verifications/{id}/decision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve / needs changes / reject (202 when a second approver is needed) */
        post: operations["postAdminVerificationsByIdDecision"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/verifications/{id}/documents/{assetId}/view-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Signed document URL (<= 60 s, logged; TOTP within 15 min) */
        get: operations["getAdminVerificationsByIdDocumentsByAssetIdViewUrl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/verifications/{id}/flags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add a manual flag */
        post: operations["postAdminVerificationsByIdFlags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/verifications/{id}/release": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Release your claim */
        post: operations["postAdminVerificationsByIdRelease"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/verifications/{id}/reopen": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Propose reopening an auto-rejected attempt (second approver) */
        post: operations["postAdminVerificationsByIdReopen"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/email/resend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Send the email verification link again */
        post: operations["postAuthEmailResend"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/email/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Verify an email link token */
        post: operations["postAuthEmailVerify"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Log in step 1: password; then an OTP challenge, or a TOTP step for enrolled staff */
        post: operations["postAuthLogin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** End the session */
        post: operations["postAuthLogout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** The signed-in user, onboarding / companion next step, staff MFA state */
        get: operations["getAuthMe"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/mfa/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Staff login step 2: TOTP or recovery code */
        post: operations["postAuthMfaLogin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/mfa/recovery-codes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Replace the recovery codes (needs a TOTP check within 15 min) */
        post: operations["postAuthMfaRecoveryCodes"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/mfa/totp/activate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Confirm the first TOTP code; returns 10 recovery codes once */
        post: operations["postAuthMfaTotpActivate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/mfa/totp/enroll": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start TOTP enrolment (staff) */
        post: operations["postAuthMfaTotpEnroll"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/mfa/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Step-up: a fresh TOTP check on this session */
        post: operations["postAuthMfaVerify"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/otp/resend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resend the newest one-time code */
        post: operations["postAuthOtpResend"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/otp/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Verify a one-time code and start a session */
        post: operations["postAuthOtpVerify"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/password/forgot": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Email a password reset link (same answer whether or not the email exists) */
        post: operations["postAuthPasswordForgot"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/password/reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Set a new password with a reset token; unlocks and signs out everywhere */
        post: operations["postAuthPasswordReset"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Rotate the refresh token (cookie on web, body on mobile) */
        post: operations["postAuthRefresh"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sign up: name, email, Indian mobile, password; texts a code */
        post: operations["postAuthRegister"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** The customer's bookings */
        get: operations["getBookings"];
        put?: never;
        /** Book from a quote. Idempotent: the same Idempotency-Key returns the same booking */
        post: operations["postBookings"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** One booking, as its customer or companion sees it */
        get: operations["getBookingsById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/{id}/call": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Masked call: the virtual number to dial (only inside the call window) */
        post: operations["postBookingsByIdCall"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cancel (customer or companion); refunds follow the policy shown at booking */
        post: operations["postBookingsByIdCancel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/{id}/cancellation-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** What cancelling now would refund, and the rule applied */
        get: operations["getBookingsByIdCancellationPreview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/{id}/check-in": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Check in (a tap, no location). Both checked in: in progress */
        post: operations["postBookingsByIdCheckIn"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/{id}/check-out": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Check out. Both checked out: completed */
        post: operations["postBookingsByIdCheckOut"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/{id}/location": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** A location point while sharing (at most one every 30 s) */
        post: operations["postBookingsByIdLocation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/{id}/location-sharing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Is my location shared for this booking? */
        get: operations["getBookingsByIdLocationSharing"];
        put?: never;
        /** Turn location sharing with my trusted contacts on or off (booking window only) */
        post: operations["postBookingsByIdLocationSharing"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/{id}/pay": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start (or resume) payment: a gateway order for this attempt */
        post: operations["postBookingsByIdPay"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/{id}/receipt": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Payment receipt for a booking (labelled "Receipt", not a tax invoice); ?format=html for a printable page */
        get: operations["getBookingsByIdReceipt"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/{id}/report-issue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Report an issue or a no-show: the companion earnings are held for review */
        post: operations["postBookingsByIdReportIssue"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/{id}/safety-ping": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** A safety ping waiting for my answer, if any */
        get: operations["getBookingsByIdSafetyPing"];
        put?: never;
        /** Answer a safety ping: OK, or not OK (raises an SOS) */
        post: operations["postBookingsByIdSafetyPing"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/{id}/sos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** SOS for this booking (the app always shows Call 112 first) */
        post: operations["postBookingsByIdSos"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/form": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** What can be booked with a companion: offerings, venues, rules, cancellation policy */
        get: operations["getBookingsForm"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/quote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Price quote: immutable, signed, valid for 10 minutes; every amount in paise */
        post: operations["postBookingsQuote"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/bookings/slots": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Start times a companion can be booked on a date (IST) */
        get: operations["getBookingsSlots"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/calls/mock/simulate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** TEST ONLY: simulate a finished masked call on my booking (mock provider) */
        post: operations["postCallsMockSimulate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/activities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Choose activities (must belong to chosen categories) */
        put: operations["putCompanionActivities"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/apply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Become a companion: consents, DOB / zone if missing; creates a DRAFT profile (idempotent) */
        post: operations["postCompanionApply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/availability": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Weekly slots, exceptions and booking settings (IST) */
        get: operations["getCompanionAvailability"];
        /** Replace weekly slots (no overlaps) and booking settings */
        put: operations["putCompanionAvailability"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/availability/exceptions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Block a date or add an extra slot */
        post: operations["postCompanionAvailabilityExceptions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/availability/exceptions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Remove an exception */
        delete: operations["deleteCompanionAvailabilityExceptionsById"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/bookings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** The companion's requests, upcoming and past bookings */
        get: operations["getCompanionBookings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/bookings/{id}/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Accept a request: the customer then has the payment window to pay */
        post: operations["postCompanionBookingsByIdAccept"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/bookings/{id}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Decline a request */
        post: operations["postCompanionBookingsByIdReject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/boundaries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Catalog boundaries plus up to 3 moderated custom ones */
        put: operations["putCompanionBoundaries"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Choose categories */
        put: operations["putCompanionCategories"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/earnings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Earnings, newest first (booking, status, when it becomes available or was paid) */
        get: operations["getCompanionEarnings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/earnings/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Earnings balances, the next payout date and the payout account (last 4 digits) */
        get: operations["getCompanionEarningsSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/go-live": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Go live once setup is complete (idempotent) */
        post: operations["postCompanionGoLive"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** The companion profile, checklist, verification attempt and next step */
        get: operations["getCompanionMe"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/options": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Categories (price bands, activities), boundaries, languages, pilot zones, document types, limits */
        get: operations["getCompanionOptions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/pause": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Pause a live profile */
        post: operations["postCompanionPause"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/payout-account": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** The payout account (last 4 digits only) and any change in progress */
        get: operations["getCompanionPayoutAccount"];
        put?: never;
        /** Add or change the payout account: penny-drop, name match with the verified name, then a cooling hold. You are told on every channel. */
        post: operations["postCompanionPayoutAccount"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/payouts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Payouts, newest first */
        get: operations["getCompanionPayouts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/payouts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** One payout with the bookings it paid */
        get: operations["getCompanionPayoutsById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/payouts/{id}/statement": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Payout statement as HTML (printable) or CSV; never the full account number */
        get: operations["getCompanionPayoutsByIdStatement"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/payouts/{id}/statement-link": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** A 5-minute link to a payout statement (HTML or CSV) for the share sheet */
        post: operations["postCompanionPayoutsByIdStatementLink"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/payouts/statement": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** A payout statement from a short-lived signed link (no session; logged) */
        get: operations["getCompanionPayoutsStatement"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/photos/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete a photo */
        delete: operations["deleteCompanionPhotosById"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/photos/{id}/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Confirm an uploaded photo (checked, EXIF stripped, resized) */
        post: operations["postCompanionPhotosByIdConfirm"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/photos/order": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Reorder photos; the first is the main photo */
        put: operations["putCompanionPhotosOrder"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/photos/upload-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start or resume a photo upload (URL bound to type and size) */
        post: operations["postCompanionPhotosUploadUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Same as GET /companion/me */
        get: operations["getCompanionProfile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Display name, intro, languages, zone, radius (approved fields go to moderation when live) */
        patch: operations["patchCompanionProfile"];
        trace?: never;
    };
    "/api/v1/companion/public-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** How customers will see you (works in any status; includes content awaiting approval) */
        get: operations["getCompanionPublicPreview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/rates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Rates per offering with the allowed price band */
        get: operations["getCompanionRates"];
        /** Set hourly rates (paise); 422 RATE_OUT_OF_BAND gives the allowed range */
        put: operations["putCompanionRates"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/resume": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resume a paused profile */
        post: operations["postCompanionResume"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/submit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Submit the application for checks and review (idempotent) */
        post: operations["postCompanionSubmit"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/verification": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start or update the identity attempt (document type) */
        post: operations["postCompanionVerification"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/verification/digilocker/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Finish DigiLocker (mock code MOCK_OK in development) */
        post: operations["postCompanionVerificationDigilockerComplete"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/verification/digilocker/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start Aadhaar via DigiLocker */
        post: operations["postCompanionVerificationDigilockerStart"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/verification/documents/{id}/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Confirm an uploaded ID image or selfie */
        post: operations["postCompanionVerificationDocumentsByIdConfirm"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/verification/documents/upload-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start or resume an ID / selfie upload */
        post: operations["postCompanionVerificationDocumentsUploadUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/verification/liveness/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Report a finished provider SDK liveness session */
        post: operations["postCompanionVerificationLivenessComplete"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/companion/verification/liveness/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Liveness session: UPLOAD (selfie upload) or SDK (provider SDK token) */
        post: operations["postCompanionVerificationLivenessSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/complaints": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Make a complaint. Safety types reach the safety desk; booking-linked ones hold the payment while it is decided. */
        post: operations["postComplaints"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/conversations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** My booking conversations */
        get: operations["getConversations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/conversations/{id}/block": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Block the other person everywhere (as in discovery) and close this chat */
        post: operations["postConversationsByIdBlock"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/conversations/{id}/images/upload-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Upload a photo for the chat (held until a moderator approves it) */
        post: operations["postConversationsByIdImagesUploadUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/conversations/{id}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Messages in a conversation (newest page first; pass before= for older) */
        get: operations["getConversationsByIdMessages"];
        put?: never;
        /** Send a message (Idempotency-Key = the client message id). Contact details are masked; solicitation is held */
        post: operations["postConversationsByIdMessages"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/conversations/{id}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark the conversation read */
        post: operations["postConversationsByIdRead"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/devices/push-token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Register this device for push notifications (Expo token) */
        post: operations["postDevicesPushToken"];
        /** Stop push notifications to this device (logout) */
        delete: operations["deleteDevicesPushToken"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/discovery/companions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search LIVE companions (cursor pages; waitlist outside pilot zones) */
        get: operations["getDiscoveryCompanions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/discovery/companions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Public profile of a LIVE companion (404 when hidden or blocked) */
        get: operations["getDiscoveryCompanionsById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/discovery/companions/{id}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Report a profile to Trust & Safety */
        post: operations["postDiscoveryCompanionsByIdReport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/discovery/companions/{id}/save": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Save a companion */
        post: operations["postDiscoveryCompanionsByIdSave"];
        /** Remove a saved companion */
        delete: operations["deleteDiscoveryCompanionsByIdSave"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/discovery/options": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Filters available in the customer's city */
        get: operations["getDiscoveryOptions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/discovery/recent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Recently viewed companions (last 50; LIVE and visible only) */
        get: operations["getDiscoveryRecent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/discovery/saved": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Saved companions (LIVE and visible only) */
        get: operations["getDiscoverySaved"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/discovery/waitlist": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Join the waitlist for a city (and optionally an area / category) */
        post: operations["postDiscoveryWaitlist"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/disputes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** My disputes */
        get: operations["getDisputes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/disputes/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** One dispute (statements of the other side are shown once it is decided) */
        get: operations["getDisputesById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/disputes/{id}/appeal": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Appeal the decision (once, within the appeal window); a different senior reviewer decides */
        post: operations["postDisputesByIdAppeal"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/disputes/{id}/evidence-upload-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Upload URL for one evidence photo (re-encoded, EXIF removed) */
        post: operations["postDisputesByIdEvidenceUploadUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/disputes/{id}/statements": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add your statement (once; text plus up to 5 photos) before the deadline */
        post: operations["postDisputesByIdStatements"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/legal/grievance-officer": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** The grievance officer (DPDP Act 2023 / IT Rules) */
        get: operations["getLegalGrievanceOfficer"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/consents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Your consents and which ones you can withdraw */
        get: operations["getMeConsents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/consents/{type}/withdraw": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Withdraw a consent (marketing, location sharing, face checks for re-verification) */
        post: operations["postMeConsentsByTypeWithdraw"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/data-export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Your latest data export and when you can ask again */
        get: operations["getMeDataExport"];
        put?: never;
        /** Ask for a copy of your data (once a week); you are told when it is ready */
        post: operations["postMeDataExport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/data-export/{id}/link": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** A short-lived download link for a ready export (every download is logged) */
        post: operations["postMeDataExportByIdLink"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/data-export/download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Download an export with the short-lived link token (no session needed; logged) */
        get: operations["getMeDataExportDownload"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/delete-account": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Deletion status and anything that has to finish first */
        get: operations["getMeDeleteAccount"];
        put?: never;
        /** Delete my account, step 2: the code. Deleted after the cooling period unless you cancel */
        post: operations["postMeDeleteAccount"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/delete-account/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cancel a scheduled deletion */
        post: operations["postMeDeleteAccountCancel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/delete-account/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Delete my account, step 1: your password; a one-time code is sent */
        post: operations["postMeDeleteAccountStart"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/messages/{id}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Report a message to Trust & Safety */
        post: operations["postMessagesByIdReport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/onboarding/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Complete customer onboarding (18+, city, interests, consents) */
        post: operations["postOnboardingComplete"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/onboarding/options": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Cities, zones, interests and legal versions for customer onboarding */
        get: operations["getOnboardingOptions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/openapi.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** This OpenAPI document (not served in production) */
        get: operations["getOpenapiJson"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/payments/mock/orders/{orderId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** TEST PAYMENT (no real money): the order on the mock gateway */
        get: operations["getPaymentsMockOrdersByOrderId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/payments/mock/orders/{orderId}/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** TEST PAYMENT (no real money): finish the mock checkout with a scenario */
        post: operations["postPaymentsMockOrdersByOrderIdComplete"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/payments/mock/orders/{orderId}/flush": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** TEST PAYMENT (no real money): deliver webhooks the mock gateway held back (LATE_SUCCESS) */
        post: operations["postPaymentsMockOrdersByOrderIdFlush"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/safety/invites/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** A safety-contact invitation (public) */
        get: operations["getSafetyInvitesByToken"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/safety/invites/{token}/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Accept to be a safety contact (public) */
        post: operations["postSafetyInvitesByTokenAccept"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/safety/share/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** A trusted contact's view of a shared meeting (public, approximate location only) */
        get: operations["getSafetyShareByToken"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/safety/sos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** SOS from anywhere in the app (linked to a booking around now, if any) */
        post: operations["postSafetySos"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/safety/sos/{id}/safe": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** I'm safe (the desk still checks in) */
        post: operations["postSafetySosByIdSafe"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/safety/sos/current": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** My open SOS, if any */
        get: operations["getSafetySosCurrent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/safety/trusted-contacts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** My safety contacts (masked numbers) */
        get: operations["getSafetyTrustedContacts"];
        put?: never;
        /** Add a safety contact (they accept by SMS before receiving anything) */
        post: operations["postSafetyTrustedContacts"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/safety/trusted-contacts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Remove a safety contact */
        delete: operations["deleteSafetyTrustedContactsById"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/safety/trusted-contacts/{id}/resend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Send the consent SMS again */
        post: operations["postSafetyTrustedContactsByIdResend"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/staff-invites/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** An invite: email, role, purpose, expiry */
        get: operations["getStaffInvitesByToken"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/staff-invites/{token}/activate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Enter a code from the authenticator app: two-step sign-in is on; recovery codes are shown once */
        post: operations["postStaffInvitesByTokenActivate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/staff-invites/{token}/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Set your password (new staff) or confirm it (MFA reset); returns the authenticator secret */
        post: operations["postStaffInvitesByTokenStart"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/storage/local/upload/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Development storage: upload bytes to a signed URL */
        put: operations["putStorageLocalUploadByToken"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/storage/local/view/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Development storage: view a signed object (no-store) */
        get: operations["getStorageLocalViewByToken"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/support/tickets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** My support tickets */
        get: operations["getSupportTickets"];
        put?: never;
        /** Open a support ticket (contact details are masked) */
        post: operations["postSupportTickets"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/support/tickets/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** One ticket and its replies */
        get: operations["getSupportTicketsById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/support/tickets/{id}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reply on a ticket */
        post: operations["postSupportTicketsByIdMessages"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/venues": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Approved public venues (label, type and area only; no address or coordinates) */
        get: operations["getVenues"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/venues/proposals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Propose a public venue for staff approval */
        post: operations["postVenuesProposals"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/webhooks/calls/{provider}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Call-masking provider webhook (HMAC; metadata only; idempotent per event id) */
        post: operations["postWebhooksCallsByProvider"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/webhooks/kyc/{provider}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** KYC provider webhook (HMAC-signed, idempotent per event id) */
        post: operations["postWebhooksKycByProvider"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/webhooks/payments/{provider}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Payment gateway webhook (HMAC over the raw body; idempotent per event id) */
        post: operations["postWebhooksPaymentsByProvider"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/webhooks/payouts/{provider}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Payout provider webhook (HMAC over the raw body; idempotent per event id) */
        post: operations["postWebhooksPayoutsByProvider"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @enum {string} */
        CompanionStatus: "DRAFT" | "SUBMITTED" | "IN_REVIEW" | "NEEDS_CHANGES" | "APPROVED" | "SETUP" | "LIVE" | "PAUSED" | "REVERIFICATION_REQUIRED" | "SUSPENDED" | "REJECTED";
        /** @enum {string} */
        VerificationStatus: "PENDING_UPLOAD" | "SUBMITTED" | "AUTO_CHECKING" | "AUTO_REJECTED" | "IN_REVIEW" | "NEEDS_CHANGES" | "APPROVED" | "REJECTED" | "EXPIRED";
        /** @enum {string} */
        CompanionNextStep: "PROFILE" | "PHOTOS" | "CATEGORIES" | "DOCUMENTS" | "SUBMIT" | "WAITING" | "FIX_REQUIRED" | "COOLDOWN" | "SETUP" | "GO_LIVE" | "LIVE" | "PAUSED" | "REJECTED" | "SUSPENDED";
        /** @enum {string} */
        OnboardingNextStep: "VERIFY_PHONE" | "PROFILE";
        /** @enum {string} */
        IdDocumentType: "PAN" | "PASSPORT" | "DRIVING_LICENSE" | "VOTER_ID" | "AADHAAR";
        /** @enum {string} */
        DocumentSide: "FRONT" | "BACK" | "SELFIE";
        /** @enum {string} */
        FixItem: "DISPLAY_NAME" | "INTRO" | "PHOTOS_REPLACE" | "PRIMARY_PHOTO_FACE" | "PHOTO_FACE_MISMATCH" | "CATEGORIES" | "BOUNDARIES" | "ID_DOCUMENT_RETAKE" | "ID_DOCUMENT_OTHER_TYPE" | "ID_BACK_MISSING" | "SELFIE_RETAKE" | "NAME_MATCH";
        /** @enum {string} */
        FixStep: "PROFILE" | "PHOTOS" | "CATEGORIES" | "DOCUMENTS";
        /** @enum {string} */
        RejectReason: "UNDERAGE" | "UNDER_CATEGORY_MIN" | "FAKE_DOCUMENT" | "IMPERSONATION" | "BANNED_MATCH" | "SAFETY" | "DUPLICATE_ACCOUNT" | "POLICY_VIOLATION" | "OTHER";
        /** @enum {string} */
        AutoReason: "DOCUMENT_NOT_AUTHENTIC" | "DOCUMENT_UNREADABLE" | "LIVENESS_FAILED" | "PHOTO_FACE_MISMATCH" | "PRIMARY_PHOTO_FACE" | "UNDERAGE" | "UNDER_CATEGORY_MIN";
        /** @enum {string} */
        CategoryCode: "FRIEND" | "PLUS_ONE" | "COMPANION" | "CREW_CARE" | "CREW_EVENTS";
        /** @enum {string} */
        CategoryStatus: "PENDING" | "APPROVED" | "INELIGIBLE" | "REMOVED";
        /** @enum {string} */
        ModerationStatus: "PENDING" | "APPROVED" | "REJECTED";
        /** @enum {string} */
        FlagType: "DUPLICATE_FACE" | "DUPLICATE_ID" | "DUPLICATE_DEVICE" | "NAME_MISMATCH" | "AGE_BORDERLINE" | "MANUAL";
        /** @enum {string} */
        FlagStatus: "OPEN" | "CLEARED" | "CONFIRMED";
        /** @enum {string} */
        ApprovalStatus: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED" | "EXECUTED";
        /** @enum {string} */
        RoleCode: "CUSTOMER" | "COMPANION" | "SUPER_ADMIN" | "OPS_MANAGER" | "SENIOR_OPS" | "VERIFICATION_EXECUTIVE" | "FINANCE_EXECUTIVE" | "TS_AGENT" | "TS_MANAGER" | "SUPPORT_EXECUTIVE" | "SAFETY_DESK";
        /** @enum {string} */
        UserStatus: "PENDING" | "ACTIVE" | "SUSPENDED" | "BANNED" | "DEACTIVATED" | "DELETED";
        /** @enum {string} */
        ErrorCode: "VALIDATION_FAILED" | "BAD_JSON" | "INVALID_INPUT" | "INVALID_REFERENCE" | "CONFLICT" | "NOT_FOUND" | "INTERNAL_ERROR" | "RATE_LIMITED" | "INVALID_STATUS_TRANSITION" | "CONTRACT_MISMATCH" | "AUTH_REQUIRED" | "TOKEN_EXPIRED" | "TOKEN_INVALID" | "SESSION_ENDED" | "INVALID_CREDENTIALS" | "ACCOUNT_LOCKED" | "ACCOUNT_DISABLED" | "ACCOUNT_SUSPENDED" | "ACCOUNT_EXISTS" | "ACCOUNT_NOT_FOUND" | "PHONE_NOT_VERIFIED" | "EMAIL_NOT_VERIFIED" | "INELIGIBLE_AGE" | "LINK_INVALID" | "OTP_INVALID" | "OTP_EXPIRED" | "OTP_USED" | "OTP_LOCKED" | "OTP_COOLDOWN" | "OTP_NOT_FOUND" | "OTP_RESEND_LIMIT" | "OTP_RESEND_TOO_SOON" | "OTP_SEND_LIMIT" | "OTP_SEND_FAILED" | "STAFF_ONLY" | "IP_NOT_ALLOWED" | "PERMISSION_DENIED" | "ROLE_REQUIRED" | "MFA_ENROLLMENT_REQUIRED" | "MFA_REQUIRED" | "MFA_STEP_UP_REQUIRED" | "MFA_CODE_INVALID" | "MFA_TOKEN_INVALID" | "MFA_ALREADY_ENABLED" | "MFA_NOT_STARTED" | "SECOND_APPROVER_REQUIRED" | "COMPANION_NOT_FOUND" | "PROFILE_UNAVAILABLE" | "APPLICATION_LOCKED" | "APPLICATION_INCOMPLETE" | "PROFILE_LOCKED" | "REAPPLY_BLOCKED" | "REAPPLY_COOLDOWN" | "CONTENT_NOT_ALLOWED" | "BELOW_CATEGORY_MIN_AGE" | "ACTIVITY_CATEGORY_MISMATCH" | "PHOTO_LIMIT" | "PHOTO_MINIMUM" | "PHOTO_NOT_FOUND" | "UPLOAD_NOT_FOUND" | "UPLOAD_ALREADY_RECEIVED" | "UPLOAD_MISMATCH" | "UPLOAD_NOT_PENDING" | "UPLOAD_MISSING" | "UPLOAD_CORRUPTED" | "UPLOAD_URL_EXPIRED" | "UPLOAD_TYPE_MISMATCH" | "UPLOAD_TOO_LARGE" | "UPLOAD_EMPTY" | "FILE_TOO_LARGE" | "IMAGE_UNREADABLE" | "UNSUPPORTED_IMAGE_TYPE" | "IMAGE_TOO_SMALL" | "VIEW_URL_EXPIRED" | "DOCUMENT_TYPE_REQUIRED" | "DOCUMENT_TYPE_UNAVAILABLE" | "AADHAAR_IMAGE_NOT_ALLOWED" | "VERIFICATION_NOT_OPEN" | "AUTO_CHECK_COOLDOWN" | "MANUAL_REVIEW_REQUIRED" | "LIVENESS_BY_UPLOAD" | "LIVENESS_SESSION_MISMATCH" | "DIGILOCKER_UNAVAILABLE" | "DIGILOCKER_NOT_STARTED" | "DIGILOCKER_FAILED" | "KYC_PROVIDER_NOT_CONFIGURED" | "INVALID_SIGNATURE" | "VERIFICATION_NOT_FOUND" | "NOT_IN_REVIEW" | "CLAIMED_BY_OTHER" | "CLAIM_REQUIRED" | "NOT_CLAIMED_BY_YOU" | "BLOCKED_BY_FLAG" | "FACE_MATCH_REQUIRED" | "APPROVAL_ALREADY_PENDING" | "APPROVAL_NOT_FOUND" | "APPROVAL_NOT_PENDING" | "APPROVAL_EXPIRED" | "NOT_AUTO_REJECTED" | "NEWER_ATTEMPT_EXISTS" | "DOCUMENT_NOT_FOUND" | "DOCUMENT_UNAVAILABLE" | "FLAG_NOT_FOUND" | "FLAG_NOT_OPEN" | "NOT_SUSPENDED" | "NOT_PENDING" | "CATEGORY_NOT_FOUND" | "NOT_APPROVED" | "NOT_READY" | "SETUP_INCOMPLETE" | "REVERIFICATION_DUE" | "NOT_LIVE" | "NOT_PAUSED" | "RATE_OUT_OF_BAND" | "AVAILABILITY_OVERLAP" | "EXCEPTION_NOT_FOUND" | "ONBOARDING_REQUIRED" | "VENUE_NOT_FOUND" | "REPORT_NOT_FOUND" | "REPORT_CLOSED" | "BOOKING_NOT_FOUND" | "OFFERING_UNAVAILABLE" | "PLUS_ONE_NOT_OPEN" | "VENUE_NOT_ALLOWED" | "VENUE_UNAVAILABLE" | "INSTANT_NOT_AVAILABLE" | "DURATION_OUT_OF_RANGE" | "TOO_SOON" | "TOO_FAR_AHEAD" | "DATE_BLOCKED" | "OUTSIDE_AVAILABILITY" | "DAILY_LIMIT_REACHED" | "SLOT_UNAVAILABLE" | "CUSTOMER_TIME_CONFLICT" | "QUOTE_NOT_FOUND" | "QUOTE_EXPIRED" | "QUOTE_ALREADY_USED" | "IDEMPOTENCY_KEY_REQUIRED" | "IDEMPOTENCY_KEY_REUSED" | "IDEMPOTENCY_MISMATCH" | "ACCOUNT_RESTRICTED" | "CUSTOMER_ONLY" | "COMPANION_ONLY" | "COMPANION_NOT_LIVE" | "REQUEST_EXPIRED" | "REQUEST_WITHDRAWN" | "NOT_PAYABLE" | "PAYMENT_WINDOW_CLOSED" | "PAYMENT_IN_PROGRESS" | "PAYMENT_ALREADY_ATTEMPTED" | "PAYMENT_NOT_FOUND" | "PAYMENT_PROVIDER_NOT_CONFIGURED" | "NOT_CANCELLABLE" | "USE_REJECT" | "MEETING_STARTED" | "NOTHING_TO_REFUND" | "REFUND_TOO_LARGE" | "REFUND_NOT_PENDING" | "CHECK_IN_NOT_AVAILABLE" | "CHECK_IN_NOT_OPEN" | "CHECK_IN_CLOSED" | "CHECK_OUT_NOT_AVAILABLE" | "ISSUE_WINDOW_CLOSED" | "NOT_DISPUTED" | "DISPUTE_ALREADY_RESOLVED" | "WEBHOOK_SIGNATURE_INVALID" | "WEBHOOK_INVALID" | "WEBHOOK_PROCESSING_FAILED" | "CONVERSATION_NOT_FOUND" | "CONVERSATION_BLOCKED" | "CHAT_CLOSED" | "MESSAGE_RATE_LIMITED" | "MESSAGE_NOT_FOUND" | "CANNOT_REPORT_OWN" | "MESSAGE_NOT_HELD" | "DEVICE_ID_REQUIRED" | "CALL_NOT_AVAILABLE" | "CALL_WINDOW_CLOSED" | "CALL_BLOCKED" | "CALL_LIMIT_REACHED" | "CALL_PROVIDER_NOT_CONFIGURED" | "CALL_SESSION_NOT_FOUND" | "DESK_PHONE_NOT_SET" | "NO_PHONE" | "TRUSTED_CONTACT_LIMIT" | "TRUSTED_CONTACT_EXISTS" | "TRUSTED_CONTACT_NOT_FOUND" | "INVITE_NOT_FOUND" | "LOCATION_WINDOW_CLOSED" | "LOCATION_SHARING_OFF" | "LOCATION_TOO_FREQUENT" | "SHARE_NOT_FOUND" | "SHARE_ENDED" | "INCIDENT_NOT_FOUND" | "INCIDENT_ALREADY_ACKNOWLEDGED" | "INCIDENT_NOT_ACKNOWLEDGED" | "INCIDENT_CLOSED" | "NO_OTHER_PARTY" | "ALREADY_FROZEN" | "USER_NOT_FOUND" | "ACCOUNT_DELETION_BLOCKED" | "ACCOUNT_DELETION_NOT_PENDING" | "ACCOUNT_DELETION_PENDING" | "APPEAL_NO_MONEY_CHANGE" | "CONSENT_NOT_GIVEN" | "CONSENT_NOT_WITHDRAWABLE" | "DATA_EXPORT_LINK_INVALID" | "DATA_EXPORT_NOT_FOUND" | "DATA_EXPORT_NOT_READY" | "DATA_EXPORT_TOO_SOON" | "LAST_SUPER_ADMIN" | "OTP_NOT_YOURS" | "PASSWORD_INCORRECT" | "STAFF_EMAIL_IN_USE" | "STAFF_ENROLMENT_REQUIRED" | "STAFF_INVITE_INVALID" | "STAFF_INVITE_NOT_OPEN" | "STAFF_INVITE_PENDING" | "STAFF_NOT_ACTIVE" | "STAFF_NOT_FOUND" | "STAFF_SELF_ACTION" | "STATEMENT_LINK_INVALID" | "APPEAL_ALREADY_DECIDED" | "APPEAL_ALREADY_SUBMITTED" | "APPEAL_NOT_FOUND" | "APPEAL_OUTCOME_NOT_SUPPORTED" | "APPEAL_REVIEWER_CONFLICT" | "APPEAL_WINDOW_CLOSED" | "COMPANION_PROFILE_NOT_FOUND" | "COMPANION_STILL_SUSPENDED" | "DISPUTE_AWAITING_RESPONSE" | "DISPUTE_CLAIMED_BY_OTHER" | "DISPUTE_CLOSED_FOR_STATEMENTS" | "DISPUTE_NOT_APPEALABLE" | "DISPUTE_NOT_CLAIMED" | "DISPUTE_NOT_DECIDABLE" | "DISPUTE_NOT_FOUND" | "DISPUTE_RESPONSE_CLOSED" | "EARNING_TRANSITION_INVALID" | "NO_RECEIPT_YET" | "PAYOUT_ACCOUNT_CHANGE_IN_PROGRESS" | "PAYOUT_ACCOUNT_MISSING" | "PAYOUT_ACCOUNT_NOT_FOUND" | "PAYOUT_ACCOUNT_NOT_IN_REVIEW" | "PAYOUT_ACCOUNT_UNCHANGED" | "PAYOUT_BATCH_NOT_AWAITING_APPROVAL" | "PAYOUT_BATCH_NOT_FOUND" | "PAYOUT_HOLD_NOT_ACTIVE" | "PAYOUT_HOLD_NOT_FOUND" | "PAYOUT_NOT_FOUND" | "PAYOUT_NOT_RETRYABLE" | "PAYOUT_PROVIDER_NOT_CONFIGURED" | "REFUND_ALREADY_RE_RAISED" | "REFUND_DISPUTE_DECIDE_AGAIN" | "REFUND_NOT_FOUND" | "REFUND_NOT_REJECTED" | "STAFF_CANNOT_CHANGE_PAYOUT_ACCOUNT" | "STATEMENT_ALREADY_SUBMITTED" | "TICKET_ASSIGNED_TO_OTHER" | "TICKET_CLOSED" | "TICKET_NOT_FOUND" | "NOTIFICATION_NOT_FOUND" | "NOTIFICATION_NOT_RETRYABLE" | "SMS_PROVIDER_NOT_CONFIGURED" | "EMAIL_PROVIDER_NOT_CONFIGURED" | "WHATSAPP_PROVIDER_NOT_CONFIGURED";
        ErrorResponse: {
            error: {
                /** @description Stable machine code; see ErrorCode and contracts/errors.json */
                code: string;
                message: string;
                details?: {
                    [key: string]: unknown;
                };
            };
        };
        OtpChallenge: {
            /** Format: uuid */
            otp_id: string;
            purpose: string;
            /** @enum {string} */
            channel: "SMS" | "EMAIL" | "WHATSAPP";
            /** @description Masked phone or email */
            destination: string;
            /** @description ISO 8601 date-time (UTC) */
            expires_at: string;
            /** @description ISO 8601 date-time (UTC) */
            resend_available_at: string;
            /** @description Development only */
            dev_code?: string;
        };
        StaffMfaState: {
            enrolled: boolean;
            verified_at: string | null;
            session_fresh: boolean;
            sensitive_fresh: boolean;
            recovery_codes_left: number;
        };
        CompanionSummary: {
            /** Format: uuid */
            id: string;
            status: components["schemas"]["CompanionStatus"];
            next_step: components["schemas"]["CompanionNextStep"];
        };
        User: {
            /** Format: uuid */
            id: string;
            full_name: string;
            display_name: string | null;
            email: string;
            phone: string | null;
            avatar_url: string | null;
            status: components["schemas"]["UserStatus"];
            is_staff: boolean;
            roles: components["schemas"]["RoleCode"][];
            email_verified: boolean;
            phone_verified: boolean;
            age_confirmed: boolean;
            city_id: string | null;
            zone_id: string | null;
            onboarding: {
                complete: boolean;
                next_step: components["schemas"]["OnboardingNextStep"] | null;
            };
            companion: components["schemas"]["CompanionSummary"] | null;
            mfa: components["schemas"]["StaffMfaState"] | null;
        };
        SessionResponse: {
            access_token: string;
            expires_in: number;
            user: components["schemas"]["User"];
            /** @description Mobile clients (X-Client: mobile) only */
            refresh_token?: string;
            /** @description Development only */
            dev_link?: string;
        };
        ChallengeResponse: {
            challenge: components["schemas"]["OtpChallenge"];
        };
        LoginResponse: {
            challenge: components["schemas"]["OtpChallenge"];
        } | {
            /** @constant */
            mfa_required: true;
            mfa_token: string;
            expires_in: number;
        };
        MeResponse: {
            user: components["schemas"]["User"];
        };
        EmailVerifiedResponse: {
            /** @constant */
            verified: true;
        };
        EmailResendResponse: {
            already_verified?: boolean;
            dev_link?: string;
        };
        ForgotPasswordResponse: {
            message: string;
            dev_link?: string;
        };
        ResetPasswordResponse: {
            /** @constant */
            reset: true;
        };
        MfaEnrollResponse: {
            secret: string;
            otpauth_uri: string;
            issuer: string;
            account: string;
        };
        RecoveryCodesResponse: {
            recovery_codes: string[];
        };
        MfaVerifiedResponse: {
            /** @description ISO 8601 date-time (UTC) */
            verified_at: string;
            /** @enum {string} */
            method: "TOTP" | "RECOVERY";
        };
        OnboardingOptions: {
            cities: {
                /** Format: uuid */
                id: string;
                name: string;
                slug: string;
                state?: string | null;
                is_pilot?: boolean;
                zones: {
                    /** Format: uuid */
                    id: string;
                    name: string;
                    slug: string;
                    status?: string;
                }[];
            }[];
            interests: {
                /** Format: uuid */
                id: string;
                name: string;
                slug: string;
            }[];
            legal: {
                terms_version: string | null;
                privacy_version: string | null;
                guidelines_version: string | null;
            };
            min_age: number;
            max_interests: number;
        };
        FixItemView: {
            code: components["schemas"]["FixItem"];
            step: components["schemas"]["FixStep"];
            label: string;
        };
        UploadTarget: {
            /** @enum {string} */
            method: "PUT" | "POST";
            url: string;
            /** @description Send these headers with a PUT upload */
            headers?: {
                [key: string]: string;
            };
            /** @description Form fields for an S3 POST upload; the file goes last as "file" */
            fields?: {
                [key: string]: string;
            };
            /** @description ISO 8601 date-time (UTC) */
            expires_at: string;
        };
        VerificationView: {
            id: string | null;
            status: components["schemas"]["VerificationStatus"] | "NOT_STARTED";
            attempt_number: number | null;
            verification_type: string | null;
            document_type: components["schemas"]["IdDocumentType"] | null;
            required_sides: components["schemas"]["DocumentSide"][];
            documents: {
                [key: string]: {
                    asset_id: string | null;
                    status: string;
                };
            };
            digilocker_completed: boolean;
            submitted_at: string | null;
            decided_at: string | null;
            auto_reason_code: string | null;
            fix_items: components["schemas"]["FixItemView"][];
            decision_reason: {
                code: string;
                text: string;
            } | null;
            note: string | null;
        };
        Checklist: {
            profile: boolean;
            photos: boolean;
            categories: boolean;
            documents: boolean;
            ready: boolean;
            missing: string[];
        };
        SetupState: {
            categories: boolean;
            rates: boolean;
            availability: boolean;
            photos: boolean;
            ready: boolean;
            missing: string[];
            priced_offerings: number;
            weekly_slots: number;
        };
        CompanionView: {
            /** Format: uuid */
            id: string;
            status: components["schemas"]["CompanionStatus"];
            next_step: components["schemas"]["CompanionNextStep"];
            display_name: string;
            intro: string | null;
            languages: {
                /** Format: uuid */
                id: string;
                code: string;
                name: string;
            }[];
            interests: {
                /** Format: uuid */
                id: string;
                name: string;
            }[];
            show_age: boolean;
            /** Format: uuid */
            city_id: string;
            zone_id: string | null;
            service_radius_km: number;
            categories: {
                /** Format: uuid */
                category_id: string;
                code: components["schemas"]["CategoryCode"];
                name: string;
                min_age: number;
                status: components["schemas"]["CategoryStatus"];
                ineligible_reason: string | null;
            }[];
            activities: {
                /** Format: uuid */
                activity_id: string;
                /** Format: uuid */
                category_id: string;
                name: string;
            }[];
            boundaries: {
                /** Format: uuid */
                id: string;
                boundary_option_id: string | null;
                text: string;
                custom: boolean;
                mandatory: boolean;
                moderation_status: components["schemas"]["ModerationStatus"];
            }[];
            photos: {
                /** Format: uuid */
                id: string;
                sort_order: number;
                is_primary: boolean;
                moderation_status: components["schemas"]["ModerationStatus"];
                rejection_reason: string | null;
                url: string | null;
                thumb_url: string | null;
                url_expires_at: string | null;
            }[];
            verification: components["schemas"]["VerificationView"] | null;
            checklist: components["schemas"]["Checklist"];
            setup: components["schemas"]["SetupState"] | null;
            pending_changes: {
                /** Format: uuid */
                id: string;
                field: string;
                proposed_value: unknown;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
            timeline: {
                from: string | null;
                to: components["schemas"]["CompanionStatus"];
                /** @description ISO 8601 date-time (UTC) */
                at: string;
                reason_code: string | null;
            }[];
            review_sla_text: string;
            submitted_at: string | null;
            approved_at: string | null;
            live_at: string | null;
            paused_reason: string | null;
            reverify_due_at: string | null;
            reapply_after: string | null;
            reapply_blocked: boolean;
            retry_after: string | null;
            manual_reopen_required: boolean;
            bank_details_reminder: boolean;
        };
        CompanionResponse: {
            companion: components["schemas"]["CompanionView"];
        };
        ApplyResponse: {
            user: components["schemas"]["User"];
            companion: components["schemas"]["CompanionView"];
        };
        PhotoConfirmedResponse: {
            /** Format: uuid */
            photo_id: string;
            companion: components["schemas"]["CompanionView"];
        };
        UploadUrlResponse: {
            /** Format: uuid */
            asset_id: string;
            side?: components["schemas"]["DocumentSide"];
            upload: components["schemas"]["UploadTarget"];
        };
        LivenessSessionResponse: {
            /** @enum {string} */
            mode: "UPLOAD" | "SDK";
            client_token: string | null;
            ref: string | null;
        };
        DigiLockerStartResponse: {
            url: string | null;
            ref: string;
        };
        GoLiveResponse: {
            already_live: boolean;
            companion: components["schemas"]["CompanionView"];
        };
        CompanionOptions: {
            categories: {
                /** Format: uuid */
                id: string;
                code: components["schemas"]["CategoryCode"];
                name: string;
                tagline: string | null;
                description: string | null;
                min_age: number;
                price_band: {
                    /** @description Money in paise (₹1 = 100) */
                    min_paise: number;
                    /** @description Money in paise (₹1 = 100) */
                    max_paise: number;
                };
                min_duration_minutes: number;
                max_duration_minutes: number;
                activities: {
                    /** Format: uuid */
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                }[];
            }[];
            boundary_options: {
                /** Format: uuid */
                id: string;
                text: string;
                category_id: string | null;
                mandatory: boolean;
            }[];
            languages: {
                /** Format: uuid */
                id: string;
                code: string;
                name: string;
                native_name: string | null;
            }[];
            interests: {
                /** Format: uuid */
                id: string;
                name: string;
                slug: string;
            }[];
            cities: {
                /** Format: uuid */
                id: string;
                name: string;
                slug: string;
                zones: {
                    /** Format: uuid */
                    id: string;
                    name: string;
                    slug: string;
                    status?: string;
                }[];
            }[];
            document_types: {
                code: components["schemas"]["IdDocumentType"];
                label: string;
                sides: components["schemas"]["DocumentSide"][];
                via_digilocker: boolean;
            }[];
            fix_items: components["schemas"]["FixItemView"][];
            reject_reasons: {
                code: components["schemas"]["RejectReason"];
                text: string;
            }[];
            limits: {
                [key: string]: number | string[];
            };
            legal: {
                [key: string]: string | null;
            };
            review_sla_text: string;
            min_age: number;
        };
        AvailabilityResponse: {
            /** Format: uuid */
            id?: string;
            /** @constant */
            timezone: "Asia/Kolkata";
            rules: {
                /** Format: uuid */
                id?: string;
                day_of_week: number;
                start_time: string;
                end_time: string;
            }[];
            exceptions: {
                /** Format: uuid */
                id: string;
                date: string;
                /** @enum {string} */
                type: "BLOCKED" | "EXTRA";
                start_time: string | null;
                end_time: string | null;
                reason: string | null;
            }[];
            settings: {
                buffer_minutes: number;
                min_duration_minutes: number;
                max_duration_minutes: number;
                min_notice_hours: number;
                max_advance_days: number;
                max_bookings_per_day: number;
            };
        };
        RatesResponse: {
            /** @constant */
            currency: "INR";
            rates: {
                /** Format: uuid */
                offering_id: string;
                /** Format: uuid */
                category_id: string;
                category: string;
                category_status: components["schemas"]["CategoryStatus"] | null;
                /** Format: uuid */
                activity_id: string;
                activity: string;
                hourly_rate_paise: number | null;
                min_duration_minutes: number;
                rate_set: boolean;
                active: boolean;
                out_of_band: boolean;
                /** @enum {string} */
                booking_mode: "INSTANT" | "REQUEST";
                band: {
                    /** @description Money in paise (₹1 = 100) */
                    min_paise: number;
                    /** @description Money in paise (₹1 = 100) */
                    max_paise: number;
                };
            }[];
        };
        VerificationQueue: {
            page: number;
            page_size: number;
            total: number;
            items: {
                /** Format: uuid */
                id: string;
                ref: string;
                status: components["schemas"]["VerificationStatus"];
                display_name: string;
                categories: string | null;
                attempt_number: number;
                verification_type: string;
                document_type: components["schemas"]["IdDocumentType"] | null;
                priority: number;
                auto_decision: string | null;
                submitted_at: string | null;
                open_flags: number;
                blocked: boolean;
                claim: {
                    by_name?: string | null;
                    by?: {
                        /** Format: uuid */
                        id: string;
                        name: string;
                    } | null;
                    mine: boolean;
                    /** @description ISO 8601 date-time (UTC) */
                    expires_at: string;
                } | null;
                approval_pending: boolean;
            }[];
        };
        VerificationDetailResponse: {
            verification: {
                /** Format: uuid */
                id: string;
                ref: string;
                status: components["schemas"]["VerificationStatus"];
                verification_type: string;
                attempt_number: number;
                document_type: components["schemas"]["IdDocumentType"] | null;
                id_last4: string | null;
                submitted_at: string | null;
                decided_at: string | null;
                priority: number;
                auto_decision: string | null;
                auto_reason_code: string | null;
                decision: string | null;
                decision_reason_code: string | null;
                decision_note: string | null;
                fix_items: string[];
                reopened: boolean;
                checks: {
                    authenticity: boolean | null;
                    liveness: boolean | null;
                    liveness_score: number | null;
                    face_match_score: number | null;
                    ocr_match: boolean | null;
                    age_ok: boolean | null;
                    age_at_check: number | null;
                };
                ocr_diff: {
                    name: {
                        document: string | null;
                        account: string;
                        match: boolean;
                    };
                    dob: {
                        document: string | null;
                        account: string | null;
                        match: boolean;
                    };
                };
                claim: {
                    by_name?: string | null;
                    by?: {
                        /** Format: uuid */
                        id: string;
                        name: string;
                    } | null;
                    mine: boolean;
                    /** @description ISO 8601 date-time (UTC) */
                    expires_at: string;
                } | null;
                applicant: {
                    /** Format: uuid */
                    user_id: string;
                    full_name: string;
                    email: string | null;
                    phone: string | null;
                    account_status: components["schemas"]["UserStatus"];
                    email_verified: boolean;
                    phone_verified: boolean;
                };
                profile: {
                    /** Format: uuid */
                    id: string;
                    status: components["schemas"]["CompanionStatus"];
                    display_name: string;
                    intro: string | null;
                    languages: string[];
                    city: string | null;
                    zone: string | null;
                    service_radius_km: number;
                    categories: {
                        /** Format: uuid */
                        category_id: string;
                        code: components["schemas"]["CategoryCode"];
                        name: string;
                        min_age: number;
                        status: components["schemas"]["CategoryStatus"];
                        ineligible_reason: string | null;
                    }[];
                    activities: (string | null)[];
                    boundaries: {
                        /** Format: uuid */
                        id: string;
                        text: string;
                        custom: boolean;
                        moderation_status: components["schemas"]["ModerationStatus"];
                    }[];
                    auto_check_failures: number;
                };
                photos: {
                    /** Format: uuid */
                    id: string;
                    is_primary: boolean;
                    moderation_status: components["schemas"]["ModerationStatus"];
                    face_match_score: number | null;
                    face_count: number | null;
                    url: string | null;
                }[];
                documents: {
                    asset_id: string | null;
                    side: components["schemas"]["DocumentSide"] | null;
                    document_type: string;
                    status: string;
                    /** @description ISO 8601 date-time (UTC) */
                    uploaded_at: string;
                }[];
                flags: {
                    /** Format: uuid */
                    id: string;
                    type: components["schemas"]["FlagType"];
                    status: components["schemas"]["FlagStatus"];
                    blocks_approval: boolean;
                    details: unknown;
                    matched_user: {
                        /** Format: uuid */
                        id: string;
                        name: string;
                        status: components["schemas"]["UserStatus"];
                    } | null;
                    resolution_note: string | null;
                    resolved_at: string | null;
                    approval_pending: boolean;
                }[];
                previous_attempts: {
                    /** Format: uuid */
                    id: string;
                    attempt_number: number;
                    verification_type: string;
                    status: components["schemas"]["VerificationStatus"];
                    submitted_at: string | null;
                    decided_at: string | null;
                    auto_reason_code: string | null;
                    decision: string | null;
                    decision_reason_code: string | null;
                    fix_items: string[];
                }[];
                history: {
                    from: string | null;
                    to: string;
                    /** @description ISO 8601 date-time (UTC) */
                    at: string;
                    actor_type: string;
                    reason_code: string | null;
                    note: string | null;
                }[];
                approval_request: {
                    /** Format: uuid */
                    id: string;
                    status: components["schemas"]["ApprovalStatus"];
                    action_type: string;
                    /** Format: uuid */
                    requested_by_user_id: string;
                    /** @description ISO 8601 date-time (UTC) */
                    created_at: string;
                } | null;
                permissions: {
                    can_claim: boolean;
                    can_decide: boolean;
                    can_view_documents: boolean;
                    can_resolve_flags: boolean;
                    can_second_approve: boolean;
                    can_reopen: boolean;
                };
                fix_item_options: components["schemas"]["FixItemView"][];
                reject_reason_options: {
                    code: components["schemas"]["RejectReason"];
                    text: string;
                }[];
            };
        };
        ClaimResponse: {
            /** Format: uuid */
            id: string;
            /** @description ISO 8601 date-time (UTC) */
            claim_expires_at: string;
        };
        ReleaseResponse: {
            /** Format: uuid */
            id: string;
            /** @constant */
            released: true;
        };
        DocumentViewUrlResponse: {
            url: string;
            /** @description ISO 8601 date-time (UTC) */
            expires_at: string;
            side: components["schemas"]["DocumentSide"];
            watermark: string;
        };
        ActionResult: {
            /** @description New status, or PENDING_SECOND_APPROVAL (HTTP 202) when a second approver must agree */
            status: string;
            profile_status?: components["schemas"]["CompanionStatus"];
            /** Format: uuid */
            approval_request_id?: string;
        };
        CreatedResponse: {
            /** Format: uuid */
            id: string;
        };
        ApprovalsResponse: {
            items: {
                /** Format: uuid */
                id: string;
                action_type: string;
                entity_type: string | null;
                entity_id: string | null;
                ref: string;
                reason: string;
                payload: unknown;
                status: components["schemas"]["ApprovalStatus"];
                requested_by: {
                    /** Format: uuid */
                    id: string;
                    name: string;
                } | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                expires_at: string | null;
            }[];
        };
        ModerationQueue: {
            items: {
                /** @enum {string} */
                kind: "FIELD" | "PHOTO" | "CATEGORY";
                /** Format: uuid */
                id: string;
                field?: string;
                companion: {
                    /** Format: uuid */
                    id: string;
                    display_name: string;
                    status: components["schemas"]["CompanionStatus"];
                } | null;
                previous_value?: unknown;
                proposed_value?: unknown;
                url?: string | null;
                category?: string;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
        };
        PriceBandResponse: {
            /** Format: uuid */
            category_id: string;
            /** @description Money in paise (₹1 = 100) */
            min_paise: number;
            /** @description Money in paise (₹1 = 100) */
            max_paise: number;
            offerings_paused: number;
        };
        /** @enum {string} */
        ProfileReportReason: "FAKE_PROFILE" | "INAPPROPRIATE_CONTENT" | "OFF_PLATFORM_CONTACT" | "NOT_PLATONIC" | "SAFETY_CONCERN" | "OTHER";
        /** @enum {string} */
        VenueType: "CAFE" | "RESTAURANT" | "MALL" | "CINEMA" | "EVENT_VENUE" | "BANQUET_HALL" | "PARK" | "TEMPLE" | "MUSEUM" | "PUBLIC_ROUTE" | "OTHER" | "CORPORATE_VENUE" | "CULTURAL_VENUE" | "PUBLIC_SPACE";
        /** @enum {string} */
        VenueStatus: "PROPOSED" | "APPROVED" | "SUSPENDED" | "REJECTED" | "ARCHIVED";
        /** @enum {string} */
        TimeWindow: "morning" | "afternoon" | "evening";
        /** @enum {string} */
        DiscoverySort: "relevance" | "price_asc" | "price_desc" | "soonest";
        DiscoveryCard: {
            /** Format: uuid */
            id: string;
            display_name: string;
            photo_url: string | null;
            zone: {
                /** Format: uuid */
                id: string;
                name: string | null;
            } | null;
            languages: string[];
            categories: {
                /** Format: uuid */
                id: string;
                code: components["schemas"]["CategoryCode"];
                name: string;
            }[];
            /** @description Money in paise (₹1 = 100) */
            from_paise: number;
            next_available_at: string | null;
            verified: boolean;
            new_on_sydecrew: boolean;
        };
        DiscoveryListResponse: {
            in_pilot: boolean;
            city: string | null;
            waitlist?: {
                joined: boolean;
            };
            items: components["schemas"]["DiscoveryCard"][];
            next_cursor: string | null;
        };
        DiscoveryCardsResponse: {
            items: components["schemas"]["DiscoveryCard"][];
        };
        PublicProfile: {
            /** Format: uuid */
            id: string;
            display_name: string;
            intro: string | null;
            /** @description Whole years, only when the companion opted in */
            age: number | null;
            zone: {
                /** Format: uuid */
                id: string;
                name: string;
            } | null;
            city: string | null;
            languages: string[];
            interests: string[];
            photos: {
                /** Format: uuid */
                id: string;
                url: string | null;
                thumb_url: string | null;
            }[];
            categories: {
                /** Format: uuid */
                id: string;
                code: components["schemas"]["CategoryCode"];
                name: string;
            }[];
            offerings: {
                /** Format: uuid */
                category_id: string;
                /** Format: uuid */
                activity_id: string;
                activity: string;
                hourly_rate_paise: number | null;
                min_hours: number;
            }[];
            boundaries: string[];
            cancellation: {
                /** Format: uuid */
                category_id: string;
                lines: string[];
                companion_cancels: string;
            }[];
            availability: {
                date: string;
                morning: boolean;
                afternoon: boolean;
                evening: boolean;
            }[];
            /** @description YYYY-MM */
            verified_since: string | null;
            verified: boolean;
            new_on_sydecrew: boolean;
            meeting_rule: string;
            saved?: boolean;
            preview?: boolean;
            status?: components["schemas"]["CompanionStatus"];
        };
        SavedResponse: {
            saved: boolean;
        };
        ReportedResponse: {
            /** @constant */
            reported: true;
            already_reported: boolean;
        };
        WaitlistResponse: {
            /** @constant */
            joined: true;
            already_joined: boolean;
        };
        DiscoveryOptions: {
            in_pilot: boolean;
            city: string | null;
            city_id: string | null;
            categories: {
                /** Format: uuid */
                id: string;
                code: components["schemas"]["CategoryCode"];
                name: string;
                price_band: {
                    /** @description Money in paise (₹1 = 100) */
                    min_paise: number;
                    /** @description Money in paise (₹1 = 100) */
                    max_paise: number;
                };
                activities: {
                    /** Format: uuid */
                    id: string;
                    name: string;
                    slug: string;
                }[];
            }[];
            languages: {
                /** Format: uuid */
                id: string;
                code: string;
                name: string;
            }[];
            interests: {
                /** Format: uuid */
                id: string;
                name: string;
                slug: string;
            }[];
            zones: {
                /** Format: uuid */
                id: string;
                name: string;
                slug: string;
            }[];
            time_windows: {
                key: components["schemas"]["TimeWindow"];
                start: string;
                end: string;
            }[];
            sorts: components["schemas"]["DiscoverySort"][];
            report_reasons: components["schemas"]["ProfileReportReason"][];
            today: string;
        };
        VenuesResponse: {
            items: {
                /** Format: uuid */
                id: string;
                name: string;
                venue_type: components["schemas"]["VenueType"];
                zone: {
                    /** Format: uuid */
                    id: string;
                    name: string | null;
                } | null;
                categories: string[];
                opening_hours: string | null;
            }[];
        };
        VenueStaff: {
            /** Format: uuid */
            id: string;
            name: string;
            venue_type: components["schemas"]["VenueType"];
            zone: {
                /** Format: uuid */
                id: string;
                name: string | null;
            } | null;
            categories: string[];
            opening_hours: string | null;
            internal_name: string;
            public_label: string | null;
            address: string;
            landmark: string | null;
            latitude: number | null;
            longitude: number | null;
            status: components["schemas"]["VenueStatus"];
            notes: string | null;
            rejection_reason: string | null;
            suspended_reason: string | null;
            proposed_by: {
                /** Format: uuid */
                id: string;
                name: string;
            } | null;
            reviewed_at: string | null;
            /** @description ISO 8601 date-time (UTC) */
            created_at: string;
        };
        VenueStaffListResponse: {
            items: components["schemas"]["VenueStaff"][];
        };
        VenueStatusResponse: {
            /** Format: uuid */
            id: string;
            status: components["schemas"]["VenueStatus"];
            unchanged?: boolean;
        };
        ReportsResponse: {
            items: {
                /** Format: uuid */
                id: string;
                reason_code: string;
                note: string | null;
                status: string;
                priority: string;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                resolution: string | null;
                resolved_at: string | null;
                companion: {
                    /** Format: uuid */
                    id: string;
                    display_name: string;
                    status: components["schemas"]["CompanionStatus"];
                } | null;
                total_reports_for_profile: number;
            }[];
        };
        /** @enum {string} */
        BookingStatus: "DRAFT" | "REQUESTED" | "AWAITING_COMPANION" | "ACCEPTED" | "REJECTED" | "PAYMENT_PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "EXPIRED" | "DISPUTED" | "REFUNDED" | "PARTIALLY_REFUNDED";
        /** @enum {string} */
        BookingMode: "INSTANT" | "REQUEST";
        /** @enum {string} */
        BookingParty: "CUSTOMER" | "COMPANION";
        /** @enum {string} */
        BookingRejectReason: "NOT_AVAILABLE" | "VENUE_NOT_SUITABLE" | "ACTIVITY_NOT_SUITABLE" | "TOO_SHORT_NOTICE" | "OTHER";
        /** @enum {string} */
        BookingCancelReason: "CHANGE_OF_PLANS" | "EMERGENCY" | "FEEL_UNSAFE" | "SCHEDULE_CONFLICT" | "VENUE_ISSUE" | "OTHER";
        /** @enum {string} */
        PlatformCancelReason: "SAFETY" | "VENUE_UNAVAILABLE" | "COMPANION_UNAVAILABLE" | "POLICY_VIOLATION" | "OTHER";
        /** @enum {string} */
        BookingIssue: "NO_SHOW" | "LATE_ARRIVAL" | "ENDED_EARLY" | "BOUNDARY_CROSSED" | "SAFETY_CONCERN" | "OTHER";
        /** @enum {string} */
        DisputeResolution: "RELEASE_TO_COMPANION" | "FULL_REFUND" | "PARTIAL_REFUND";
        /** @enum {string} */
        PaymentStatus: "CREATED" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
        /** @enum {string} */
        RefundStatus: "PENDING_APPROVAL" | "APPROVED" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "REJECTED";
        /** @enum {string} */
        MockPaymentScenario: "SUCCESS" | "FAILED" | "PENDING_THEN_SUCCESS" | "DUPLICATE_WEBHOOK" | "LATE_SUCCESS" | "REFUND_FAIL_ONCE";
        CancellationPolicy: {
            lines: string[];
            companion_cancels: string;
            full_refund_hours: number;
            partial_refund_hours: number;
            partial_refund_bps: number;
        };
        BookingFormResponse: {
            companion: {
                /** Format: uuid */
                id: string;
                display_name: string;
                zone: string | null;
            };
            offerings: {
                /** Format: uuid */
                offering_id: string;
                category: {
                    /** Format: uuid */
                    id: string;
                    code: components["schemas"]["CategoryCode"];
                    name: string;
                };
                activity: {
                    /** Format: uuid */
                    id: string;
                    name: string;
                };
                /** @description Money in paise (₹1 = 100) */
                hourly_rate_paise: number;
                min_duration_minutes: number;
                max_duration_minutes: number;
                instant: boolean;
                closed_reason: string | null;
            }[];
            venues: {
                /** Format: uuid */
                id: string;
                name: string;
                venue_type: components["schemas"]["VenueType"];
                categories: string[];
                pending_approval: boolean;
            }[];
            rules: {
                min_notice_hours: number;
                max_advance_days: number;
                quote_valid_minutes: number;
                plus_one_enabled: boolean;
            };
            cancellation: components["schemas"]["CancellationPolicy"];
        };
        BookingSlotsResponse: {
            date: string;
            duration_minutes: number;
            start_times: string[];
        };
        BookingBreakdown: {
            /** @description Money in paise (₹1 = 100) */
            hourly_rate_paise: number;
            /** @description Money in paise (₹1 = 100) */
            subtotal_paise: number;
            /** @description Money in paise (₹1 = 100) */
            customer_fee_paise: number;
            /** @description Money in paise (₹1 = 100) */
            gst_on_fee_paise: number;
            /** @description Money in paise (₹1 = 100) */
            discount_paise: number;
            /** @description Money in paise (₹1 = 100) */
            total_paise: number;
            /** @description Money in paise (₹1 = 100) */
            commission_paise: number;
            /** @description Money in paise (₹1 = 100) */
            gst_on_commission_paise: number;
            /** @description Money in paise (₹1 = 100) */
            companion_earnings_paise: number;
            is_repeat: boolean;
        };
        BookingQuoteResponse: {
            quote_id: string;
            /** @description ISO 8601 date-time (UTC) */
            expires_at: string;
            booking_mode: components["schemas"]["BookingMode"];
            forced_request_reason: "VENUE_PENDING_APPROVAL" | null;
            companion: {
                /** Format: uuid */
                id: string;
                display_name: string;
            };
            category: {
                /** Format: uuid */
                id: string;
                code: components["schemas"]["CategoryCode"];
                name: string;
            };
            activity: {
                /** Format: uuid */
                id: string;
                name: string;
            };
            venue: {
                /** Format: uuid */
                id: string;
                name: string;
                venue_type: components["schemas"]["VenueType"];
                pending_approval: boolean;
            };
            /** @description ISO 8601 date-time (UTC) */
            start_at: string;
            /** @description ISO 8601 date-time (UTC) */
            end_at: string;
            duration_minutes: number;
            breakdown: components["schemas"]["BookingBreakdown"];
            versions: {
                settings_version: string;
                /** @enum {string} */
                commission_rule: "CATEGORY_DEFAULT" | "REPEAT_BOOKING";
                commission_bps: number;
                customer_fee_bps: number;
                gst_bps: number;
            };
            cancellation: components["schemas"]["CancellationPolicy"];
        };
        BookingView: {
            /** Format: uuid */
            id: string;
            ref: string;
            status: components["schemas"]["BookingStatus"];
            booking_mode: components["schemas"]["BookingMode"];
            viewer: components["schemas"]["BookingParty"];
            category: {
                /** Format: uuid */
                id: string;
                code: components["schemas"]["CategoryCode"];
                name: string;
            };
            activity: {
                /** Format: uuid */
                id: string;
                name: string;
            };
            companion: {
                /** Format: uuid */
                id: string;
                display_name: string;
                photo_url: string | null;
            };
            customer: {
                first_name: string;
            };
            venue: {
                /** Format: uuid */
                id: string;
                name: string;
                venue_type: components["schemas"]["VenueType"];
                zone: string | null;
                pending_approval: boolean;
            } | null;
            /** @description ISO 8601 date-time (UTC) */
            start_at: string;
            /** @description ISO 8601 date-time (UTC) */
            end_at: string;
            duration_minutes: number;
            notes: string | null;
            notes_masked: boolean;
            money: {
                /** @description Money in paise (₹1 = 100) */
                subtotal_paise: number;
                /** @description Money in paise (₹1 = 100) */
                refunded_paise: number;
                /** @description Money in paise (₹1 = 100) */
                customer_fee_paise?: number;
                /** @description Money in paise (₹1 = 100) */
                gst_on_fee_paise?: number;
                /** @description Money in paise (₹1 = 100) */
                discount_paise?: number;
                /** @description Money in paise (₹1 = 100) */
                total_paise?: number;
                /** @description Money in paise (₹1 = 100) */
                commission_paise?: number;
                /** @description Money in paise (₹1 = 100) */
                gst_on_commission_paise?: number;
                /** @description Money in paise (₹1 = 100) */
                earnings_paise?: number;
            };
            due: {
                companion_response_due_at: string | null;
                payment_due_at: string | null;
            };
            payment: {
                status: components["schemas"]["PaymentStatus"];
                attempts: number;
                in_flight: boolean;
            } | null;
            refunds: {
                /** Format: uuid */
                id: string;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                status: components["schemas"]["RefundStatus"];
                reason_code: string | null;
                processed_at: string | null;
            }[];
            check_in: {
                /** @description ISO 8601 date-time (UTC) */
                opens_at: string;
                /** @description ISO 8601 date-time (UTC) */
                closes_at: string;
                customer_in_at: string | null;
                companion_in_at: string | null;
                customer_out_at: string | null;
                companion_out_at: string | null;
            };
            boundaries: string[];
            cancellation: components["schemas"]["CancellationPolicy"];
            dispute: {
                /** Format: uuid */
                id: string;
                status: string;
                issue_code: string | null;
                outcome: string | null;
            } | null;
            /** @description The dispute on this booking, if any (Feature 7) */
            dispute_id: string | null;
            dispute_window_ends_at: string | null;
            timeline: {
                from: components["schemas"]["BookingStatus"] | null;
                to: components["schemas"]["BookingStatus"];
                /** @enum {string} */
                actor_type: "CUSTOMER" | "COMPANION" | "ADMIN" | "SYSTEM";
                reason_code: string | null;
                /** @description ISO 8601 date-time (UTC) */
                at: string;
            }[];
            conversation_id: string | null;
            call_window: {
                /** @description ISO 8601 date-time (UTC) */
                opens_at: string;
                /** @description ISO 8601 date-time (UTC) */
                closes_at: string;
                open: boolean;
            };
            actions: {
                can_call: boolean;
                can_pay: boolean;
                can_cancel: boolean;
                can_accept: boolean;
                can_reject: boolean;
                can_check_in: boolean;
                can_check_out: boolean;
                can_report_issue: boolean;
            };
        };
        BookingResponse: {
            booking: components["schemas"]["BookingView"];
        };
        BookingListResponse: {
            /** @enum {string} */
            tab: "upcoming" | "past" | "cancelled" | "requests";
            items: {
                /** Format: uuid */
                id: string;
                ref: string;
                status: components["schemas"]["BookingStatus"];
                /** @description ISO 8601 date-time (UTC) */
                start_at: string;
                /** @description ISO 8601 date-time (UTC) */
                end_at: string;
                duration_minutes: number;
                activity: string;
                category_code: components["schemas"]["CategoryCode"];
                other_party: string;
                photo_url: string | null;
                venue: string | null;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                companion_response_due_at: string | null;
                payment_due_at: string | null;
                venue_pending_approval: boolean;
            }[];
        };
        BookingPaymentResponse: {
            /** Format: uuid */
            payment_id: string;
            attempt: number;
            status: components["schemas"]["PaymentStatus"];
            /** @enum {string} */
            gateway: "RAZORPAY" | "CASHFREE" | "MOCK";
            order_id: string;
            /** @description Money in paise (₹1 = 100) */
            amount_paise: number;
            due_at: string | null;
            client: ({
                provider: string;
                order_id: string;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                currency: string;
                test_mode?: boolean;
            } & {
                [key: string]: unknown;
            }) | null;
        };
        CancellationPreviewResponse: {
            /** @enum {string} */
            by: "CUSTOMER" | "COMPANION" | "PLATFORM";
            /** @description Money in paise (₹1 = 100) */
            paid_paise: number;
            /** @description Money in paise (₹1 = 100) */
            refund_paise: number;
            /** @description Money in paise (₹1 = 100) */
            companion_keeps_paise: number;
            minutes_before_start: number;
            rule: {
                /** @enum {string} */
                code: "NOT_PAID" | "FULL_REFUND_WINDOW" | "PARTIAL_REFUND_WINDOW" | "NO_REFUND_WINDOW" | "COMPANION_CANCELLED" | "PLATFORM_CANCELLED";
                refund_bps: number;
                text: string;
            };
            companion_penalty: boolean;
        };
        BookingCancelledResponse: {
            refund: {
                /** Format: uuid */
                id: string;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                status: components["schemas"]["RefundStatus"];
            } | null;
            rule: {
                /** @enum {string} */
                code: "NOT_PAID" | "FULL_REFUND_WINDOW" | "PARTIAL_REFUND_WINDOW" | "NO_REFUND_WINDOW" | "COMPANION_CANCELLED" | "PLATFORM_CANCELLED";
                refund_bps: number;
                text: string;
            };
            booking: components["schemas"]["BookingView"];
        };
        MockPaymentOrderResponse: {
            order_id: string;
            /** @description Money in paise (₹1 = 100) */
            amount_paise: number;
            /** @enum {string} */
            status: "CREATED" | "PENDING" | "CAPTURED" | "FAILED";
            scenarios: components["schemas"]["MockPaymentScenario"][];
            /** @constant */
            test_mode: true;
            booking_id: string | null;
        };
        MockCheckoutResponse: {
            scenario: components["schemas"]["MockPaymentScenario"];
            delivered: number[];
            held: number;
        };
        MockFlushResponse: {
            delivered: number[];
        };
        PaymentWebhookAck: {
            /** @constant */
            received: true;
            duplicate: boolean;
            outcome?: string | null;
        };
        AdminBookingsResponse: {
            items: {
                /** Format: uuid */
                id: string;
                ref: string;
                status: components["schemas"]["BookingStatus"];
                booking_mode: components["schemas"]["BookingMode"];
                category_code: components["schemas"]["CategoryCode"];
                /** @description ISO 8601 date-time (UTC) */
                start_at: string;
                companion: string;
                customer: string;
                /** @description Money in paise (₹1 = 100) */
                total_paise: number;
                /** @description Money in paise (₹1 = 100) */
                refunded_paise: number;
                open_refunds: number;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
        };
        AdminBookingResponse: {
            /** Format: uuid */
            id: string;
            ref: string;
            status: components["schemas"]["BookingStatus"];
            booking_mode: components["schemas"]["BookingMode"];
            /** @constant */
            viewer: "STAFF";
            category: {
                /** Format: uuid */
                id: string;
                code: components["schemas"]["CategoryCode"];
                name: string;
            };
            activity: {
                /** Format: uuid */
                id: string;
                name: string;
            };
            companion: {
                /** Format: uuid */
                id: string;
                display_name: string;
                photo_url: string | null;
            };
            customer: {
                first_name: string;
            };
            venue: {
                /** Format: uuid */
                id: string;
                name: string;
                venue_type: components["schemas"]["VenueType"];
                zone: string | null;
                pending_approval: boolean;
            } | null;
            /** @description ISO 8601 date-time (UTC) */
            start_at: string;
            /** @description ISO 8601 date-time (UTC) */
            end_at: string;
            duration_minutes: number;
            notes: string | null;
            notes_masked: boolean;
            money: {
                /** @description Money in paise (₹1 = 100) */
                subtotal_paise: number;
                /** @description Money in paise (₹1 = 100) */
                refunded_paise: number;
                /** @description Money in paise (₹1 = 100) */
                customer_fee_paise?: number;
                /** @description Money in paise (₹1 = 100) */
                gst_on_fee_paise?: number;
                /** @description Money in paise (₹1 = 100) */
                discount_paise?: number;
                /** @description Money in paise (₹1 = 100) */
                total_paise?: number;
                /** @description Money in paise (₹1 = 100) */
                commission_paise?: number;
                /** @description Money in paise (₹1 = 100) */
                gst_on_commission_paise?: number;
                /** @description Money in paise (₹1 = 100) */
                earnings_paise?: number;
            };
            due: {
                companion_response_due_at: string | null;
                payment_due_at: string | null;
            };
            payment: {
                status: components["schemas"]["PaymentStatus"];
                attempts: number;
                in_flight: boolean;
            } | null;
            refunds: {
                /** Format: uuid */
                id: string;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                status: components["schemas"]["RefundStatus"];
                reason_code: string | null;
                processed_at: string | null;
            }[];
            check_in: {
                /** @description ISO 8601 date-time (UTC) */
                opens_at: string;
                /** @description ISO 8601 date-time (UTC) */
                closes_at: string;
                customer_in_at: string | null;
                companion_in_at: string | null;
                customer_out_at: string | null;
                companion_out_at: string | null;
            };
            boundaries: string[];
            cancellation: components["schemas"]["CancellationPolicy"];
            dispute: {
                /** Format: uuid */
                id: string;
                status: string;
                issue_code: string | null;
                outcome: string | null;
            } | null;
            /** @description The dispute on this booking, if any (Feature 7) */
            dispute_id: string | null;
            dispute_window_ends_at: string | null;
            timeline: {
                from: components["schemas"]["BookingStatus"] | null;
                to: components["schemas"]["BookingStatus"];
                /** @enum {string} */
                actor_type: "CUSTOMER" | "COMPANION" | "ADMIN" | "SYSTEM";
                reason_code: string | null;
                /** @description ISO 8601 date-time (UTC) */
                at: string;
            }[];
            conversation_id: string | null;
            call_window: {
                /** @description ISO 8601 date-time (UTC) */
                opens_at: string;
                /** @description ISO 8601 date-time (UTC) */
                closes_at: string;
                open: boolean;
            };
            actions: {
                can_call: boolean;
                can_pay: boolean;
                can_cancel: boolean;
                can_accept: boolean;
                can_reject: boolean;
                can_check_in: boolean;
                can_check_out: boolean;
                can_report_issue: boolean;
            };
            money_staff: {
                /** @description Money in paise (₹1 = 100) */
                subtotal_paise: number;
                /** @description Money in paise (₹1 = 100) */
                customer_fee_paise: number;
                /** @description Money in paise (₹1 = 100) */
                gst_on_fee_paise: number;
                /** @description Money in paise (₹1 = 100) */
                total_paise: number;
                /** @description Money in paise (₹1 = 100) */
                commission_paise: number;
                /** @description Money in paise (₹1 = 100) */
                gst_on_commission_paise: number;
                /** @description Money in paise (₹1 = 100) */
                companion_earnings_paise: number;
                /** @description Money in paise (₹1 = 100) */
                refunded_paise: number;
                versions: {
                    settings_version: string | null;
                    settings: {
                        [key: string]: unknown;
                    } | null;
                };
            };
            ledger: {
                entries: {
                    entry_group: string;
                    /** @enum {string} */
                    account: "CUSTOMER_PAID" | "CUSTOMER_REFUNDED" | "COMPANION_EARNINGS" | "PLATFORM_COMMISSION" | "GST_ON_COMMISSION" | "SERVICE_FEE" | "GST_ON_SERVICE_FEE" | "REFUND_DUE" | "PAID_OUT" | "TDS_WITHHELD";
                    /** @description Money in paise (₹1 = 100) */
                    amount_paise: number;
                    memo: string | null;
                    /** @description ISO 8601 date-time (UTC) */
                    created_at: string;
                }[];
                balances: {
                    [key: string]: number;
                };
                /** @description Money in paise (₹1 = 100) */
                customer_side_paise: number;
                /** @description Money in paise (₹1 = 100) */
                allocation_side_paise: number;
            };
            payments: {
                /** Format: uuid */
                id: string;
                attempt: number;
                gateway: string;
                gateway_order_id: string | null;
                gateway_payment_id: string | null;
                status: components["schemas"]["PaymentStatus"];
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                /** @description Money in paise (₹1 = 100) */
                amount_refunded_paise: number;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                captured_at: string | null;
                failed_at: string | null;
            }[];
            payment_events: {
                txn_type: string;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                status: string;
                gateway_reference: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
            refunds_staff: {
                /** Format: uuid */
                id: string;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                status: components["schemas"]["RefundStatus"];
                reason_code: string | null;
                initiated_by: string;
                requires_approval: boolean;
                approval_request_id: string | null;
                retry_count: number;
                failure_reason: string | null;
                processed_at: string | null;
                allocation: {
                    [key: string]: number;
                };
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
            disputes: {
                /** Format: uuid */
                id: string;
                status: string;
                issue_code: string | null;
                outcome: string | null;
                customer_statement: string | null;
                companion_statement: string | null;
                refund_amount_paise: number | null;
                resolution_notes: string | null;
                resolved_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
            party_events: {
                party: components["schemas"]["BookingParty"];
                /** @enum {string} */
                event_type: "NO_SHOW" | "REQUEST_EXPIRED" | "COMPANION_CANCELLED";
                metadata: {
                    [key: string]: unknown;
                };
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
            earnings: {
                earning_type: string;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                status: string;
                available_at: string | null;
                hold_reason: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
            approvals: {
                /** Format: uuid */
                id: string;
                action_type: string;
                status: string;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
            staff_transitions: components["schemas"]["BookingStatus"][];
        };
        DisputeResolvedResponse: {
            outcome: components["schemas"]["DisputeResolution"];
            refund: {
                /** Format: uuid */
                id: string;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                status: components["schemas"]["RefundStatus"];
            } | null;
            booking: components["schemas"]["AdminBookingResponse"];
        };
        PricingSettingsResponse: {
            can_edit: boolean;
            placeholder_notice: string;
            items: {
                key: string;
                value: unknown;
                description: string | null;
                updated_at: string | null;
                pending_change: {
                    /** Format: uuid */
                    approval_request_id: string;
                    value: unknown;
                    /** @description ISO 8601 date-time (UTC) */
                    requested_at: string;
                } | null;
            }[];
        };
        SettingProposedResponse: {
            /** @constant */
            status: "PENDING_SECOND_APPROVAL";
            /** Format: uuid */
            approval_request_id: string;
        };
        /** @enum {string} */
        MessageModeration: "DELIVERED" | "MASKED" | "HELD" | "REJECTED";
        /** @enum {string} */
        ChatClosedReason: "BLOCKED" | "CLOSED" | "NOT_OPEN";
        /** @enum {string} */
        IncidentStatus: "OPEN" | "ACKNOWLEDGED" | "ESCALATED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
        /** @enum {string} */
        IncidentOutcome: "SAFE_NO_ACTION" | "RESOLVED_BY_DESK" | "EMERGENCY_SERVICES" | "FALSE_ALARM" | "OTHER";
        MessageView: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            conversation_id: string;
            client_message_id: string | null;
            /** @enum {string} */
            from: "ME" | "OTHER" | "SYSTEM";
            /** @enum {string} */
            type: "TEXT" | "IMAGE" | "SYSTEM";
            body: string | null;
            image_url: string | null;
            moderation: components["schemas"]["MessageModeration"];
            /** @description ISO 8601 date-time (UTC) */
            created_at: string;
        };
        ConversationsResponse: {
            items: {
                /** Format: uuid */
                id: string;
                booking: {
                    /** Format: uuid */
                    id: string;
                    ref: string;
                    status: components["schemas"]["BookingStatus"];
                    /** @description ISO 8601 date-time (UTC) */
                    start_at: string;
                };
                other_party: string;
                last_message: {
                    /** @enum {string} */
                    from: "ME" | "OTHER";
                    /** @enum {string} */
                    type: "TEXT" | "IMAGE" | "SYSTEM";
                    preview: string | null;
                    /** @description ISO 8601 date-time (UTC) */
                    at: string;
                } | null;
                unread: number;
                window_closes_at: string | null;
                can_send: boolean;
                closed_reason: components["schemas"]["ChatClosedReason"] | null;
            }[];
        };
        MessagesResponse: {
            conversation: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                booking_id: string;
                other_party: string;
                window_closes_at: string | null;
                can_send: boolean;
                closed_reason: components["schemas"]["ChatClosedReason"] | null;
                other_read_at: string | null;
            };
            items: components["schemas"]["MessageView"][];
            next_before: string | null;
        };
        MessageSentResponse: {
            message: components["schemas"]["MessageView"];
            duplicate: boolean;
        };
        ReadMarkedResponse: {
            /** @description ISO 8601 date-time (UTC) */
            read_at: string;
        };
        BlockedResponse: {
            /** @constant */
            blocked: true;
        };
        PushTokenResponse: {
            registered: boolean;
        };
        CallNumberResponse: {
            virtual_number: string;
            /** @description ISO 8601 date-time (UTC) */
            expires_at: string;
            call_window?: {
                /** @description ISO 8601 date-time (UTC) */
                opens_at: string;
                /** @description ISO 8601 date-time (UTC) */
                closes_at: string;
            };
        };
        CallSimulatedResponse: {
            call_id: string;
            delivered: number[];
        };
        LocationSharingResponse: {
            sharing: boolean;
            expires_at?: string | null;
            contacts_notified?: number;
            stopped?: boolean;
            already?: boolean;
            dev_link?: string;
        };
        LocationStoredResponse: {
            /** @constant */
            stored: true;
        };
        SosResponse: {
            incident: {
                /** Format: uuid */
                id: string;
                ref: string;
                status: components["schemas"]["IncidentStatus"];
                acknowledged: boolean;
                marked_safe: boolean;
                location_shared: boolean;
                /** @description ISO 8601 date-time (UTC) */
                triggered_at: string;
                help_message: string;
            };
            duplicate: boolean;
        };
        SosCurrentResponse: {
            incident: {
                /** Format: uuid */
                id: string;
                ref: string;
                status: components["schemas"]["IncidentStatus"];
                acknowledged: boolean;
                marked_safe: boolean;
                location_shared: boolean;
                /** @description ISO 8601 date-time (UTC) */
                triggered_at: string;
                help_message: string;
            } | null;
        };
        PendingPingResponse: {
            pending: boolean;
            ping: {
                /** Format: uuid */
                id: string;
                /** @description ISO 8601 date-time (UTC) */
                sent_at: string;
            } | null;
        };
        PingAnsweredResponse: {
            responded: boolean;
            sos?: components["schemas"]["SosResponse"];
        };
        TrustedContactsResponse: {
            items: {
                /** Format: uuid */
                id: string;
                name: string;
                relationship: string | null;
                phone_masked: string;
                /** @enum {string} */
                status: "PENDING" | "ACCEPTED";
                invited_at: string | null;
                accepted_at: string | null;
            }[];
            max: number;
        };
        TrustedContactAddedResponse: {
            contact: {
                /** Format: uuid */
                id: string;
                name: string;
                relationship: string | null;
                phone_masked: string;
                /** @enum {string} */
                status: "PENDING" | "ACCEPTED";
                invited_at: string | null;
                accepted_at: string | null;
            };
            dev_link?: string;
        };
        RemovedResponse: {
            /** @constant */
            removed: true;
        };
        InviteInfoResponse: {
            inviter_first_name: string;
            /** @enum {string} */
            status: "PENDING" | "ACCEPTED";
        };
        InviteAcceptedResponse: {
            /** @constant */
            accepted: true;
            already: boolean;
        };
        SharePageResponse: {
            sharer_first_name: string;
            venue: string | null;
            area: string | null;
            /** @description ISO 8601 date-time (UTC) */
            starts_at: string;
            /** @description ISO 8601 date-time (UTC) */
            ends_at: string;
            /** @enum {string} */
            booking_status: "CONFIRMED" | "IN_PROGRESS" | "COMPLETED";
            checked_in: boolean;
            checked_out: boolean;
            last_location: {
                latitude: number;
                longitude: number;
                accuracy_meters: number;
                /** @description ISO 8601 date-time (UTC) */
                at: string;
            } | null;
            /** @description ISO 8601 date-time (UTC) */
            sharing_until: string;
        };
        IncidentsResponse: {
            /** @description ISO 8601 date-time (UTC) */
            server_time: string;
            items: {
                /** Format: uuid */
                id: string;
                ref: string;
                source: string;
                /** @enum {string} */
                severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
                status: components["schemas"]["IncidentStatus"];
                /** @description ISO 8601 date-time (UTC) */
                triggered_at: string;
                ack_due_at: string | null;
                acknowledged_at: string | null;
                pages: number;
                marked_safe: boolean;
                reporter: string | null;
                booking_ref: string | null;
            }[];
        };
        IncidentResponse: {
            /** Format: uuid */
            id: string;
            ref: string;
            source: string;
            /** @enum {string} */
            severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
            status: components["schemas"]["IncidentStatus"];
            /** @description ISO 8601 date-time (UTC) */
            triggered_at: string;
            ack_due_at: string | null;
            acknowledged_at: string | null;
            pages: number;
            marked_safe_at: string | null;
            marked_safe_by: string | null;
            other_party_frozen_at: string | null;
            legal_hold: boolean;
            outcome: string | null;
            resolution: string | null;
            follow_up_due_at: string | null;
            follow_up_completed_at: string | null;
            description: string | null;
            reporter: {
                /** Format: uuid */
                id: string;
                name: string;
                role: components["schemas"]["BookingParty"] | null;
                account_status: string;
                has_verified_phone: boolean;
            } | null;
            other_party: {
                /** Format: uuid */
                id: string;
                name: string;
                role: components["schemas"]["BookingParty"] | null;
                account_status: string;
                has_verified_phone: boolean;
            } | null;
            booking: {
                /** Format: uuid */
                id: string;
                ref: string;
                status: components["schemas"]["BookingStatus"];
                /** @description ISO 8601 date-time (UTC) */
                start_at: string;
                /** @description ISO 8601 date-time (UTC) */
                end_at: string;
                venue: string | null;
                venue_address: string | null;
                zone: string | null;
            } | null;
            location: {
                latitude: number;
                longitude: number;
                accuracy_meters?: number | null;
                /** @description ISO 8601 date-time (UTC) */
                at?: string;
                source?: string;
            } | null;
            trusted_contacts: {
                /** Format: uuid */
                id: string;
                name: string;
                phone_masked: string;
            }[];
            timeline: {
                type: string;
                actor_user_id: string | null;
                notes: string | null;
                metadata: {
                    [key: string]: unknown;
                };
                /** @description ISO 8601 date-time (UTC) */
                at: string;
            }[];
            transcript: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                from: "CUSTOMER" | "COMPANION" | "SYSTEM";
                type: string;
                body: string | null;
                moderation: string;
                /** @description ISO 8601 date-time (UTC) */
                at: string;
            }[];
            calls: {
                status: string;
                started_at: string | null;
                ended_at: string | null;
                duration_seconds: number | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                purpose: string;
                /** @enum {string} */
                caller: "CUSTOMER" | "COMPANION" | "DESK";
            }[];
        };
        FrozenResponse: {
            cancelled: number;
            incident: components["schemas"]["IncidentResponse"];
        };
        HeldMessagesResponse: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                conversation_id: string;
                type: string;
                reason: string | null;
                flags: string[];
                body: string | null;
                original: string | null;
                image_url: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
        };
        HeldDecisionResponse: {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            moderation: "APPROVED" | "REJECTED";
        };
        /** @enum {string} */
        EarningStatus: "PENDING" | "ON_HOLD" | "AVAILABLE" | "IN_BATCH" | "PAID" | "FAILED" | "REVERSED" | "CLAWBACK";
        /** @enum {string} */
        PayoutStatus: "PENDING" | "AWAITING_APPROVAL" | "PROCESSING" | "PAID" | "FAILED" | "ON_HOLD" | "CANCELLED" | "REVERSED";
        /** @enum {string} */
        PayoutBatchStatus: "DRAFT" | "AWAITING_APPROVAL" | "APPROVED" | "PROCESSING" | "COMPLETED" | "PARTIALLY_FAILED" | "CANCELLED";
        /** @enum {string} */
        PayoutAccountStatus: "PENDING_VERIFICATION" | "VERIFIED" | "NEEDS_REVIEW" | "REJECTED" | "COOLING" | "SUPERSEDED";
        /** @enum {string} */
        ComplaintType: "NO_SHOW" | "LATE" | "SERVICE_QUALITY" | "BOUNDARY_VIOLATION" | "BILLING" | "PAYMENT_FAILED" | "SAFETY" | "HARASSMENT" | "THREAT" | "ASSAULT" | "UNSAFE_SITUATION" | "OTHER";
        /** @enum {string} */
        DisputeStatus: "OPEN" | "AWAITING_RESPONSE" | "UNDER_REVIEW" | "RESOLVED" | "APPEALED" | "CLOSED";
        /** @enum {string} */
        TicketStatus: "OPEN" | "IN_PROGRESS" | "PENDING_USER" | "RESOLVED" | "CLOSED";
        /** @enum {string} */
        PayoutHoldSource: "FINANCE" | "TRUST_SAFETY" | "SYSTEM";
        PayoutAccountResponse: {
            current: {
                /** Format: uuid */
                id: string;
                status: components["schemas"]["PayoutAccountStatus"];
                /** @description Only the last 4 digits are ever returned */
                account_last4: string;
                ifsc: string;
                bank_name: string | null;
                account_holder_name: string;
                name_match_score: number | null;
                cooling_until: string | null;
                verified_at: string | null;
                failure_reason: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            } | null;
            pending: {
                /** Format: uuid */
                id: string;
                status: components["schemas"]["PayoutAccountStatus"];
                /** @description Only the last 4 digits are ever returned */
                account_last4: string;
                ifsc: string;
                bank_name: string | null;
                account_holder_name: string;
                name_match_score: number | null;
                cooling_until: string | null;
                verified_at: string | null;
                failure_reason: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            } | null;
            last_rejected: {
                /** Format: uuid */
                id: string;
                status: components["schemas"]["PayoutAccountStatus"];
                /** @description Only the last 4 digits are ever returned */
                account_last4: string;
                ifsc: string;
                bank_name: string | null;
                account_holder_name: string;
                name_match_score: number | null;
                cooling_until: string | null;
                verified_at: string | null;
                failure_reason: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            } | null;
            cooling_hours: number;
        };
        EarningsSummaryResponse: {
            balances: {
                /** @description Money in paise (₹1 = 100) */
                pending: number;
                /** @description Money in paise (₹1 = 100) */
                on_hold: number;
                /** @description Money in paise (₹1 = 100) */
                available: number;
                /** @description Money in paise (₹1 = 100) */
                in_batch: number;
                /** @description Money in paise (₹1 = 100) */
                clawback: number;
                /** @description Money in paise (₹1 = 100) */
                paid: number;
            };
            next_payout_date: string;
            /** @description Money in paise (₹1 = 100) */
            min_payout_paise: number;
            tds_bps: number;
            on_hold: boolean;
            account: {
                last4: string;
                bank_name: string | null;
            } | null;
            last_payout: {
                /** Format: uuid */
                id: string;
                payout_ref: string;
                status: components["schemas"]["PayoutStatus"];
                /** @description Money in paise (₹1 = 100) */
                gross_paise: number;
                /** @description Money in paise (₹1 = 100) */
                tds_paise: number;
                /** @description Money in paise (₹1 = 100) */
                deductions_paise: number;
                /** @description Money in paise (₹1 = 100) */
                net_paise: number;
                account_last4: string | null;
                bank_name: string | null;
                utr: string | null;
                failure_reason: string | null;
                cycle_date: string | null;
                paid_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            } | null;
        };
        EarningsResponse: {
            earnings: {
                /** Format: uuid */
                id: string;
                type: string;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                status: components["schemas"]["EarningStatus"];
                booking_ref: string | null;
                start_at: string | null;
                available_at: string | null;
                paid_at: string | null;
                payout_ref: string | null;
                on_hold_reason: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
            next_before: string | null;
        };
        PayoutsResponse: {
            payouts: {
                /** Format: uuid */
                id: string;
                payout_ref: string;
                status: components["schemas"]["PayoutStatus"];
                /** @description Money in paise (₹1 = 100) */
                gross_paise: number;
                /** @description Money in paise (₹1 = 100) */
                tds_paise: number;
                /** @description Money in paise (₹1 = 100) */
                deductions_paise: number;
                /** @description Money in paise (₹1 = 100) */
                net_paise: number;
                account_last4: string | null;
                bank_name: string | null;
                utr: string | null;
                failure_reason: string | null;
                cycle_date: string | null;
                paid_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
        };
        PayoutResponse: {
            payout: {
                /** Format: uuid */
                id: string;
                payout_ref: string;
                status: components["schemas"]["PayoutStatus"];
                /** @description Money in paise (₹1 = 100) */
                gross_paise: number;
                /** @description Money in paise (₹1 = 100) */
                tds_paise: number;
                /** @description Money in paise (₹1 = 100) */
                deductions_paise: number;
                /** @description Money in paise (₹1 = 100) */
                net_paise: number;
                account_last4: string | null;
                bank_name: string | null;
                utr: string | null;
                failure_reason: string | null;
                cycle_date: string | null;
                paid_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                lines: {
                    /** Format: uuid */
                    id: string;
                    type: string;
                    /** @description Money in paise (₹1 = 100) */
                    amount_paise: number;
                    booking_ref: string | null;
                    start_at: string | null;
                    description: string | null;
                }[];
            };
        };
        AdminPayoutsResponse: {
            payouts: {
                /** Format: uuid */
                id: string;
                payout_ref: string;
                status: components["schemas"]["PayoutStatus"];
                /** @description Money in paise (₹1 = 100) */
                gross_paise: number;
                /** @description Money in paise (₹1 = 100) */
                tds_paise: number;
                /** @description Money in paise (₹1 = 100) */
                deductions_paise: number;
                /** @description Money in paise (₹1 = 100) */
                net_paise: number;
                account_last4: string | null;
                bank_name: string | null;
                utr: string | null;
                failure_reason: string | null;
                cycle_date: string | null;
                paid_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                /** Format: uuid */
                companion_profile_id: string;
                companion_display_name: string;
                retry_count: number;
            }[];
        };
        AdminPayoutResponse: {
            payout: {
                /** Format: uuid */
                id: string;
                payout_ref: string;
                status: components["schemas"]["PayoutStatus"];
                /** @description Money in paise (₹1 = 100) */
                gross_paise: number;
                /** @description Money in paise (₹1 = 100) */
                tds_paise: number;
                /** @description Money in paise (₹1 = 100) */
                deductions_paise: number;
                /** @description Money in paise (₹1 = 100) */
                net_paise: number;
                account_last4: string | null;
                bank_name: string | null;
                utr: string | null;
                failure_reason: string | null;
                cycle_date: string | null;
                paid_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                /** Format: uuid */
                companion_profile_id: string;
                companion_display_name: string;
                retry_count: number;
                lines: {
                    /** Format: uuid */
                    id: string;
                    type: string;
                    /** @description Money in paise (₹1 = 100) */
                    amount_paise: number;
                    booking_ref: string | null;
                    start_at: string | null;
                    description: string | null;
                }[];
            };
        };
        PayoutBatchesResponse: {
            batches: {
                /** Format: uuid */
                id: string;
                batch_ref: string;
                cycle_date: string;
                status: components["schemas"]["PayoutBatchStatus"];
                payout_count: number;
                /** @description Money in paise (₹1 = 100) */
                total_paise: number;
                /** @description Money in paise (₹1 = 100) */
                tds_paise: number;
                failed_count: number;
                approval_request_id: string | null;
                approved_at: string | null;
                processed_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
        };
        PayoutBatchResponse: {
            batch: {
                /** Format: uuid */
                id: string;
                batch_ref: string;
                cycle_date: string;
                status: components["schemas"]["PayoutBatchStatus"];
                payout_count: number;
                /** @description Money in paise (₹1 = 100) */
                total_paise: number;
                /** @description Money in paise (₹1 = 100) */
                tds_paise: number;
                failed_count: number;
                approval_request_id: string | null;
                approved_at: string | null;
                processed_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            };
            payouts: {
                /** Format: uuid */
                id: string;
                payout_ref: string;
                status: components["schemas"]["PayoutStatus"];
                /** @description Money in paise (₹1 = 100) */
                gross_paise: number;
                /** @description Money in paise (₹1 = 100) */
                tds_paise: number;
                /** @description Money in paise (₹1 = 100) */
                deductions_paise: number;
                /** @description Money in paise (₹1 = 100) */
                net_paise: number;
                account_last4: string | null;
                bank_name: string | null;
                utr: string | null;
                failure_reason: string | null;
                cycle_date: string | null;
                paid_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                /** Format: uuid */
                companion_profile_id: string;
                companion_display_name: string;
                retry_count: number;
            }[];
        };
        PayoutBatchBuiltResponse: {
            batch: {
                /** Format: uuid */
                id: string;
                batch_ref: string;
                cycle_date: string;
                status: components["schemas"]["PayoutBatchStatus"];
                payout_count: number;
                /** @description Money in paise (₹1 = 100) */
                total_paise: number;
                /** @description Money in paise (₹1 = 100) */
                tds_paise: number;
                failed_count: number;
                approval_request_id: string | null;
                approved_at: string | null;
                processed_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            };
            created: boolean;
            skipped: {
                held: number;
                no_account: number;
                below_minimum: number;
            } | null;
        };
        PayoutBatchRefResponse: {
            batch: {
                /** Format: uuid */
                id: string;
                batch_ref: string;
                cycle_date: string;
                status: components["schemas"]["PayoutBatchStatus"];
                payout_count: number;
                /** @description Money in paise (₹1 = 100) */
                total_paise: number;
                /** @description Money in paise (₹1 = 100) */
                tds_paise: number;
                failed_count: number;
                approval_request_id: string | null;
                approved_at: string | null;
                processed_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            };
        };
        AdminPayoutAccountsResponse: {
            accounts: {
                /** Format: uuid */
                id: string;
                status: components["schemas"]["PayoutAccountStatus"];
                /** @description Only the last 4 digits are ever returned */
                account_last4: string;
                ifsc: string;
                bank_name: string | null;
                account_holder_name: string;
                name_match_score: number | null;
                cooling_until: string | null;
                verified_at: string | null;
                failure_reason: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                /** Format: uuid */
                companion_profile_id: string;
                reviewed_at: string | null;
                review_notes: string | null;
                companion_display_name?: string | null;
            }[];
        };
        AdminPayoutAccountResponse: {
            account: {
                /** Format: uuid */
                id: string;
                status: components["schemas"]["PayoutAccountStatus"];
                /** @description Only the last 4 digits are ever returned */
                account_last4: string;
                ifsc: string;
                bank_name: string | null;
                account_holder_name: string;
                name_match_score: number | null;
                cooling_until: string | null;
                verified_at: string | null;
                failure_reason: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                /** Format: uuid */
                companion_profile_id: string;
                reviewed_at: string | null;
                review_notes: string | null;
                companion_display_name?: string | null;
            };
        };
        PayoutHoldsResponse: {
            holds: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                companion_profile_id: string;
                companion_display_name: string;
                source: components["schemas"]["PayoutHoldSource"];
                reason: string;
                /** @enum {string} */
                status: "ACTIVE" | "RELEASE_PENDING" | "RELEASED";
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                released_at: string | null;
            }[];
        };
        PayoutHoldResponse: {
            hold: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                companion_profile_id: string;
                companion_display_name: string;
                source: components["schemas"]["PayoutHoldSource"];
                reason: string;
                /** @enum {string} */
                status: "ACTIVE" | "RELEASE_PENDING" | "RELEASED";
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                released_at: string | null;
            };
        };
        PayoutReconcileResponse: {
            checked: number;
            paid: number;
            failed: number;
            reversed: number;
            still_processing: number;
            mismatches: number;
            /** Format: uuid */
            run_id: string;
        };
        PayoutWebhookAck: {
            /** @constant */
            received: true;
            duplicate: boolean;
            outcome: string | null;
        };
        ComplaintCreatedResponse: {
            complaint: {
                /** Format: uuid */
                id: string;
                complaint_ref: string;
                type: components["schemas"]["ComplaintType"];
                status: string;
                /** @description ISO 8601 date-time (UTC) */
                sla_due_at: string;
                routed_to_safety: boolean;
                dispute_id: string | null;
                /** Format: uuid */
                support_ticket_id: string;
            };
        };
        DisputeResponse: {
            dispute: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                booking_id: string;
                booking_ref: string;
                status: components["schemas"]["DisputeStatus"];
                issue_code: string | null;
                my_party: components["schemas"]["BookingParty"];
                respondent_party: string | null;
                response_due_at: string | null;
                can_add_statement: boolean;
                statements: {
                    party: components["schemas"]["BookingParty"];
                    body: string;
                    image_count: number;
                    /** @description ISO 8601 date-time (UTC) */
                    created_at: string;
                }[];
                other_party_responded: boolean;
                decision: components["schemas"]["DisputeResolution"] | null;
                decision_text: string | null;
                refund_paise: number | null;
                resolution_notes: string | null;
                resolved_at: string | null;
                appeal_deadline_at: string | null;
                can_appeal: boolean;
                appeal: {
                    /** Format: uuid */
                    id: string;
                    /** @enum {string} */
                    status: "SUBMITTED" | "IN_REVIEW" | "UPHELD" | "OVERTURNED";
                    submitted_at: string | null;
                    decided_at: string | null;
                    decision_reason: string | null;
                } | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            };
        };
        DisputesResponse: {
            disputes: {
                /** Format: uuid */
                id: string;
                status: components["schemas"]["DisputeStatus"];
                issue_code: string | null;
                decision: string | null;
                response_due_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                booking_ref: string;
            }[];
        };
        EvidenceUploadResponse: {
            /** Format: uuid */
            asset_id: string;
            upload: {
                url: string;
                method: string;
            } & {
                [key: string]: unknown;
            };
        };
        DisputeQueueResponse: {
            disputes: {
                /** Format: uuid */
                id: string;
                booking_ref: string;
                status: components["schemas"]["DisputeStatus"];
                issue_code: string | null;
                respondent_party: string | null;
                response_due_at: string | null;
                statements: number;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                age_hours: number;
                claimed_by: {
                    /** Format: uuid */
                    user_id: string;
                    name: string | null;
                    /** @description ISO 8601 date-time (UTC) */
                    until: string;
                } | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
        };
        StaffRef: {
            /** Format: uuid */
            id: string;
            display_name: string;
        };
        AdminDisputeResponse: {
            dispute: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                booking_id: string;
                booking_ref: string;
                booking_status: components["schemas"]["BookingStatus"];
                status: components["schemas"]["DisputeStatus"];
                issue_code: string | null;
                respondent_party: string | null;
                response_due_at: string | null;
                claimed_by_user_id: string | null;
                claim_expires_at: string | null;
                decision: components["schemas"]["DisputeResolution"] | null;
                /** @description Money in paise (₹1 = 100) */
                refund_paise: number;
                /** @description Money in paise (₹1 = 100) */
                clawback_paise: number;
                resolution_notes: string | null;
                resolved_by_user_id: string | null;
                resolved_at: string | null;
                appeal_deadline_at: string | null;
                /** @description Money in paise (₹1 = 100) */
                refundable_paise: number;
                statements: {
                    party: components["schemas"]["BookingParty"];
                    body: string;
                    images: {
                        /** Format: uuid */
                        id: string;
                        url: string;
                    }[];
                    /** @description ISO 8601 date-time (UTC) */
                    created_at: string;
                }[];
                evidence: {
                    [key: string]: unknown;
                };
                earnings: {
                    earning_type: string;
                    /** @description Money in paise (₹1 = 100) */
                    amount_paise: number;
                    status: components["schemas"]["EarningStatus"];
                    hold_reason: string | null;
                }[];
                refunds: {
                    /** Format: uuid */
                    id: string;
                    /** @description Money in paise (₹1 = 100) */
                    amount_paise: number;
                    status: string;
                    reason_code: string | null;
                    /** @description ISO 8601 date-time (UTC) */
                    created_at: string;
                }[];
                appeal: {
                    /** Format: uuid */
                    id: string;
                    /** @enum {string} */
                    status: "SUBMITTED" | "IN_REVIEW" | "UPHELD" | "OVERTURNED";
                    statement: string | null;
                    original_decider_user_id: string | null;
                    reviewer_user_id: string | null;
                    decision_reason: string | null;
                    submitted_at: string | null;
                    decided_at: string | null;
                    original_decider: components["schemas"]["StaffRef"] | null;
                    reviewer: components["schemas"]["StaffRef"] | null;
                } | null;
                claimed_by: components["schemas"]["StaffRef"] | null;
                resolved_by: components["schemas"]["StaffRef"] | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            };
        };
        DisputeTranscriptResponse: {
            messages: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                from: "CUSTOMER" | "COMPANION" | "SYSTEM";
                type: string;
                body: string | null;
                moderation: string;
                /** @description ISO 8601 date-time (UTC) */
                at: string;
            }[];
        };
        DisputeClaimResponse: {
            claimed: boolean;
            claim_expires_at?: string | null;
        };
        DisputeDecidedResponse: {
            outcome: components["schemas"]["DisputeResolution"];
            refund: {
                /** Format: uuid */
                id: string;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                status: components["schemas"]["RefundStatus"];
            } | null;
            strike: {
                strikes: number;
                review: boolean;
            } | null;
            dispute: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                booking_id: string;
                booking_ref: string;
                booking_status: components["schemas"]["BookingStatus"];
                status: components["schemas"]["DisputeStatus"];
                issue_code: string | null;
                respondent_party: string | null;
                response_due_at: string | null;
                claimed_by_user_id: string | null;
                claim_expires_at: string | null;
                decision: components["schemas"]["DisputeResolution"] | null;
                /** @description Money in paise (₹1 = 100) */
                refund_paise: number;
                /** @description Money in paise (₹1 = 100) */
                clawback_paise: number;
                resolution_notes: string | null;
                resolved_by_user_id: string | null;
                resolved_at: string | null;
                appeal_deadline_at: string | null;
                /** @description Money in paise (₹1 = 100) */
                refundable_paise: number;
                statements: {
                    party: components["schemas"]["BookingParty"];
                    body: string;
                    images: {
                        /** Format: uuid */
                        id: string;
                        url: string;
                    }[];
                    /** @description ISO 8601 date-time (UTC) */
                    created_at: string;
                }[];
                evidence: {
                    [key: string]: unknown;
                };
                earnings: {
                    earning_type: string;
                    /** @description Money in paise (₹1 = 100) */
                    amount_paise: number;
                    status: components["schemas"]["EarningStatus"];
                    hold_reason: string | null;
                }[];
                refunds: {
                    /** Format: uuid */
                    id: string;
                    /** @description Money in paise (₹1 = 100) */
                    amount_paise: number;
                    status: string;
                    reason_code: string | null;
                    /** @description ISO 8601 date-time (UTC) */
                    created_at: string;
                }[];
                appeal: {
                    /** Format: uuid */
                    id: string;
                    /** @enum {string} */
                    status: "SUBMITTED" | "IN_REVIEW" | "UPHELD" | "OVERTURNED";
                    statement: string | null;
                    original_decider_user_id: string | null;
                    reviewer_user_id: string | null;
                    decision_reason: string | null;
                    submitted_at: string | null;
                    decided_at: string | null;
                    original_decider: components["schemas"]["StaffRef"] | null;
                    reviewer: components["schemas"]["StaffRef"] | null;
                } | null;
                claimed_by: components["schemas"]["StaffRef"] | null;
                resolved_by: components["schemas"]["StaffRef"] | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            };
        };
        AppealsResponse: {
            appeals: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                status: "SUBMITTED" | "IN_REVIEW" | "UPHELD" | "OVERTURNED";
                statement: string | null;
                submitted_at: string | null;
                decided_at: string | null;
                original_decider_user_id: string | null;
                original_decider: components["schemas"]["StaffRef"] | null;
                /** Format: uuid */
                dispute_id: string;
                decision: string | null;
                booking_ref: string;
            }[];
        };
        AppealDecidedResponse: {
            appeal: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                status: "SUBMITTED" | "IN_REVIEW" | "UPHELD" | "OVERTURNED";
                reviewer_user_id: string | null;
                decision_reason: string | null;
                decided_at: string | null;
                /** Format: uuid */
                dispute_id: string;
            };
        };
        TicketsResponse: {
            tickets: {
                /** Format: uuid */
                id: string;
                ticket_ref: string;
                category: string | null;
                subject: string;
                status: components["schemas"]["TicketStatus"];
                priority: string;
                booking_id: string | null;
                sla_due_at: string | null;
                first_response_at: string | null;
                resolved_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                /** @description ISO 8601 date-time (UTC) */
                updated_at: string;
            }[];
        };
        TicketResponse: {
            ticket: {
                /** Format: uuid */
                id: string;
                ticket_ref: string;
                category: string | null;
                subject: string;
                status: components["schemas"]["TicketStatus"];
                priority: string;
                booking_id: string | null;
                sla_due_at: string | null;
                first_response_at: string | null;
                resolved_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                /** @description ISO 8601 date-time (UTC) */
                updated_at: string;
                messages: {
                    /** Format: uuid */
                    id: string;
                    body: string;
                    /** @enum {string} */
                    from: "USER" | "SUPPORT";
                    author_name: string | null;
                    internal: boolean;
                    /** @description ISO 8601 date-time (UTC) */
                    created_at: string;
                }[];
            };
        };
        AdminTicketsResponse: {
            tickets: {
                /** Format: uuid */
                id: string;
                ticket_ref: string;
                category: string | null;
                subject: string;
                status: components["schemas"]["TicketStatus"];
                priority: string;
                booking_id: string | null;
                sla_due_at: string | null;
                first_response_at: string | null;
                resolved_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                /** @description ISO 8601 date-time (UTC) */
                updated_at: string;
                assigned_to_user_id: string | null;
                assignee_name: string | null;
                overdue: boolean | null;
            }[];
        };
        AdminTicketResponse: {
            ticket: {
                /** Format: uuid */
                id: string;
                ticket_ref: string;
                category: string | null;
                subject: string;
                status: components["schemas"]["TicketStatus"];
                priority: string;
                booking_id: string | null;
                sla_due_at: string | null;
                first_response_at: string | null;
                resolved_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                /** @description ISO 8601 date-time (UTC) */
                updated_at: string;
                assigned_to_user_id: string | null;
                user: {
                    /** Format: uuid */
                    id: string;
                    name: string;
                } | null;
                complaint: {
                    /** Format: uuid */
                    id: string;
                    complaint_ref: string;
                    complaint_type: string;
                    status: string;
                    safety_incident_id: string | null;
                } | null;
                dispute: {
                    /** Format: uuid */
                    id: string;
                    status: string;
                } | null;
                messages: {
                    /** Format: uuid */
                    id: string;
                    body: string;
                    /** @enum {string} */
                    from: "USER" | "SUPPORT";
                    author_name: string | null;
                    internal: boolean;
                    /** @description ISO 8601 date-time (UTC) */
                    created_at: string;
                    author_user_id?: string | null;
                    author_staff_name?: string | null;
                }[];
            };
        };
        AdminRefundsResponse: {
            refunds: {
                /** Format: uuid */
                id: string;
                booking_id: string | null;
                booking_ref: string | null;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                status: string;
                reason_code: string | null;
                reason: string | null;
                initiated_by: string;
                re_raised_from_refund_id: string | null;
                re_raised_as_refund_id: string | null;
                initiated_by_user: components["schemas"]["StaffRef"] | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            }[];
        };
        RefundReRaisedResponse: {
            refund: {
                /** Format: uuid */
                id: string;
                /** @description Money in paise (₹1 = 100) */
                amount_paise: number;
                status: string;
                /** Format: uuid */
                re_raised_from_refund_id: string;
            };
        };
        ReceiptResponse: {
            receipt: {
                /**
                 * @description Never "Tax invoice" (GST invoices wait for the CA)
                 * @constant
                 */
                label: "Receipt";
                receipt_number: string;
                /** Format: uuid */
                booking_id: string;
                booking_ref: string;
                paid_at: string | null;
                method: string | null;
                activity: string | null;
                companion: string | null;
                venue: string | null;
                /** @description ISO 8601 date-time (UTC) */
                start_at: string;
                duration_minutes: number;
                lines: {
                    label: string;
                    /** @description Money in paise (₹1 = 100) */
                    amount_paise: number;
                }[];
                /** @description Money in paise (₹1 = 100) */
                total_paise: number;
                refunds: {
                    /** @description Money in paise (₹1 = 100) */
                    amount_paise: number;
                    processed_at: string | null;
                }[];
                /** @description Money in paise (₹1 = 100) */
                net_paid_paise: number;
                note: string;
            };
        };
        StatementLinkResponse: {
            /** @description Short-lived signed link (5 minutes); no bearer token needed */
            url: string;
            /** @description ISO 8601 date-time (UTC) */
            expires_at: string;
        };
        DataExportStateResponse: {
            export: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                status: "QUEUED" | "READY" | "EXPIRED" | "FAILED";
                ready_at: string | null;
                expires_at: string | null;
                download_count: number;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
            } | null;
            next_request_at: string | null;
            cooldown_days: number;
        };
        DataExportLinkResponse: {
            url: string;
            /** @description ISO 8601 date-time (UTC) */
            expires_at: string;
        };
        DeletionStateResponse: {
            request: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                status: "COOLING" | "BLOCKED";
                /** @description ISO 8601 date-time (UTC) */
                scheduled_for: string;
                blocked: {
                    /** @enum {string} */
                    code: "UPCOMING_BOOKING" | "OPEN_DISPUTE" | "REFUND_IN_PROGRESS" | "NEGATIVE_BALANCE" | "UNPAID_EARNINGS" | "STAFF_ACCOUNT";
                    message: string;
                }[];
            } | null;
            blockers: {
                /** @enum {string} */
                code: "UPCOMING_BOOKING" | "OPEN_DISPUTE" | "REFUND_IN_PROGRESS" | "NEGATIVE_BALANCE" | "UNPAID_EARNINGS" | "STAFF_ACCOUNT";
                message: string;
            }[];
            cooling_days: number;
        };
        ConsentsResponse: {
            consents: {
                type: string;
                granted: boolean;
                version: string | null;
                /** @description ISO 8601 date-time (UTC) */
                at: string;
                withdrawable: boolean;
            }[];
        };
        GrievanceOfficerResponse: {
            name: string;
            email: string;
            response_days: number;
            /** @description True until the founder fills in the real officer */
            placeholder: boolean;
        };
        StaffListResponse: {
            staff: {
                /** Format: uuid */
                id: string;
                full_name: string;
                email: string;
                status: components["schemas"]["UserStatus"];
                mfa_enabled: boolean;
                mfa_enrolled_at: string | null;
                last_login_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                roles: string[];
            }[];
            invites: {
                /** Format: uuid */
                id: string;
                email: string;
                full_name: string | null;
                role_code: string;
                /** @enum {string} */
                purpose: "ONBOARD" | "MFA_RESET";
                /** @description ISO 8601 date-time (UTC) */
                expires_at: string;
                accepted_at: string | null;
                revoked_at: string | null;
                /** @description ISO 8601 date-time (UTC) */
                created_at: string;
                expired: boolean;
            }[];
        };
        StaffInvitedResponse: {
            invite: {
                /** Format: uuid */
                id: string;
                /** @description ISO 8601 date-time (UTC) */
                expires_at: string;
                /** @description Development only */
                dev_link?: string;
            };
        };
        RevokedResponse: {
            /** @constant */
            revoked: true;
        };
        RequestedResponse: {
            /** @constant */
            requested: true;
        };
        StaffDeactivatedResponse: {
            /** @constant */
            deactivated: true;
            released: {
                verifications: number;
                disputes: number;
                tickets: number;
                reports: number;
                invites: number;
                on_call: number;
            };
        };
        StaffInviteResponse: {
            email: string;
            full_name: string | null;
            role: string;
            /** @enum {string} */
            purpose: "ONBOARD" | "MFA_RESET";
            /** @description ISO 8601 date-time (UTC) */
            expires_at: string;
        };
        StaffInviteAcceptedResponse: {
            recovery_codes: string[];
            email: string;
        };
        HealthResponse: {
            /** @constant */
            status: "ok";
            /** @constant */
            db: "up";
        };
        ReadyResponse: {
            /** @constant */
            status: "ready";
            checks: {
                /** @enum {string} */
                db: "up" | "down" | "skipped" | "pending";
                /** @enum {string} */
                redis: "up" | "down" | "skipped" | "pending";
                /** @enum {string} */
                migrations: "up" | "down" | "skipped" | "pending";
            };
            pending_migrations?: string[];
        };
        NotificationFailure: {
            /** Format: uuid */
            id: string;
            template_code: string | null;
            /** @enum {string} */
            channel: "IN_APP" | "PUSH" | "EMAIL" | "SMS" | "WHATSAPP";
            /** @enum {string} */
            status: "QUEUED" | "SENDING" | "SENT" | "DELIVERED" | "FAILED" | "DEAD" | "READ";
            attempts: number;
            last_error: string | null;
            /** @description Masked phone / email; the message text is never shown */
            recipient: string | null;
            /** Format: uuid */
            user_id: string;
            request_id: string | null;
            last_attempt_at: string | null;
            /** @description ISO 8601 date-time (UTC) */
            created_at: string;
            /** @description ISO 8601 date-time (UTC) */
            updated_at: string;
        };
        NotificationFailuresResponse: {
            items: components["schemas"]["NotificationFailure"][];
        };
        NotificationRetriedResponse: {
            notification: components["schemas"]["NotificationFailure"];
        };
        WebhookAck: {
            /** @constant */
            received: true;
            duplicate?: boolean;
            status?: string;
        };
        postAuthRegisterBody: {
            full_name: string;
            /** Format: email */
            email: string;
            phone: string;
            password: string & (unknown & unknown);
        };
        postAuthLoginBody: {
            identifier: string;
            password: string;
        };
        postAuthOtpVerifyBody: {
            /** Format: uuid */
            otp_id: string;
            code: string;
        };
        postAuthOtpResendBody: {
            /** Format: uuid */
            otp_id: string;
        };
        postAuthMfaLoginBody: {
            code?: string;
            recovery_code?: string;
            mfa_token: string;
        };
        postAuthMfaTotpActivateBody: {
            code: string;
        };
        postAuthMfaVerifyBody: {
            code?: string;
            recovery_code?: string;
        };
        postAuthEmailVerifyBody: {
            token: string;
        };
        postAuthPasswordForgotBody: {
            /** Format: email */
            email: string;
        };
        postAuthPasswordResetBody: {
            token: string;
            password: string & (unknown & unknown);
        };
        postOnboardingCompleteBody: {
            dob: string;
            /** @constant */
            confirm_18_plus: true;
            /** Format: uuid */
            city_id: string;
            /** Format: uuid */
            zone_id: string;
            /** @default [] */
            interest_ids: string[];
            /**
             * @default {
             *       "hide_last_name": true
             *     }
             */
            privacy: {
                /** @default true */
                hide_last_name: boolean;
            };
            consents: {
                /** @constant */
                terms: true;
                /** @constant */
                privacy: true;
                /** @constant */
                community_guidelines: true;
                /** @constant */
                dpdp_data_processing: true;
                /** @default false */
                marketing: boolean;
            };
        };
        postCompanionBookingsByIdRejectBody: {
            /** @enum {string} */
            reason_code: "NOT_AVAILABLE" | "VENUE_NOT_SUITABLE" | "ACTIVITY_NOT_SUITABLE" | "TOO_SHORT_NOTICE" | "OTHER";
            note?: string;
        };
        postCompanionPayoutsByIdStatementLinkBody: {
            /**
             * @default html
             * @enum {string}
             */
            format: "html" | "csv";
        };
        postCompanionPayoutAccountBody: {
            account_number: string;
            confirm_account_number: string;
            ifsc: string;
            account_holder_name: string;
        };
        postCompanionApplyBody: {
            dob?: string;
            /** Format: uuid */
            city_id?: string;
            /** Format: uuid */
            zone_id?: string;
            /** @constant */
            confirm_18_plus: true;
            consents: {
                /** @constant */
                terms: true;
                /** @constant */
                privacy: true;
                /** @constant */
                community_guidelines: true;
                /** @constant */
                dpdp_data_processing: true;
                /** @constant */
                companion_terms: true;
                /** @constant */
                companion_conduct: true;
                /** @constant */
                kyc_biometric_processing: true;
            };
        };
        patchCompanionProfileBody: {
            display_name?: string;
            intro?: string;
            language_ids?: string[];
            /** Format: uuid */
            city_id?: string;
            /** Format: uuid */
            zone_id?: string;
            service_radius_km?: number;
            interest_ids?: string[];
            show_age?: boolean;
        };
        putCompanionCategoriesBody: {
            category_ids: string[];
        };
        putCompanionActivitiesBody: {
            activity_ids: string[];
        };
        putCompanionBoundariesBody: {
            /** @default [] */
            option_ids: string[];
            /** @default [] */
            custom: string[];
        };
        postCompanionPhotosUploadUrlBody: {
            /** @enum {string} */
            mime: "image/jpeg" | "image/png" | "image/webp";
            bytes: number;
            sha256: string;
            /** Format: uuid */
            asset_id?: string;
        };
        putCompanionPhotosOrderBody: {
            photo_ids: string[];
        };
        postCompanionVerificationBody: {
            /** @enum {string} */
            document_type?: "PAN" | "PASSPORT" | "DRIVING_LICENSE" | "VOTER_ID" | "AADHAAR";
            mock_scenario?: string;
        };
        postCompanionVerificationDocumentsUploadUrlBody: {
            /** @enum {string} */
            side: "FRONT" | "BACK" | "SELFIE";
            /** @enum {string} */
            mime: "image/jpeg" | "image/png" | "image/webp";
            bytes: number;
            sha256: string;
            /** Format: uuid */
            asset_id?: string;
        };
        postCompanionVerificationLivenessCompleteBody: {
            provider_ref: string;
        };
        postCompanionVerificationDigilockerCompleteBody: {
            code: string;
        };
        putCompanionAvailabilityBody: {
            rules: {
                day_of_week: number;
                start_time: string;
                end_time: string;
            }[];
            settings?: {
                buffer_minutes: number;
                min_duration_minutes: number;
                max_duration_minutes: number;
                min_notice_hours: number;
                max_advance_days: number;
                max_bookings_per_day?: number;
            };
        };
        postCompanionAvailabilityExceptionsBody: {
            date: string;
            /** @enum {string} */
            type: "BLOCKED" | "EXTRA";
            start_time?: string;
            end_time?: string;
            reason?: string;
        };
        putCompanionRatesBody: {
            rates: {
                /** Format: uuid */
                category_id: string;
                /** Format: uuid */
                activity_id?: string;
                hourly_rate_paise: number;
                min_duration_minutes?: number;
                /** @enum {string} */
                booking_mode?: "INSTANT" | "REQUEST";
            }[];
        };
        postCompanionPauseBody: {
            reason?: string;
        };
        postAdminVerificationsByIdDecisionBody: {
            /** @constant */
            decision: "APPROVE";
            note?: string;
        } | {
            /** @constant */
            decision: "NEEDS_CHANGES";
            fix_items: ("DISPLAY_NAME" | "INTRO" | "PHOTOS_REPLACE" | "PRIMARY_PHOTO_FACE" | "PHOTO_FACE_MISMATCH" | "CATEGORIES" | "BOUNDARIES" | "ID_DOCUMENT_RETAKE" | "ID_DOCUMENT_OTHER_TYPE" | "ID_BACK_MISSING" | "SELFIE_RETAKE" | "NAME_MATCH")[];
            /** @default [] */
            photo_ids: string[];
            note?: string;
        } | {
            /** @constant */
            decision: "REJECT";
            /** @enum {string} */
            reason_code: "UNDERAGE" | "UNDER_CATEGORY_MIN" | "FAKE_DOCUMENT" | "IMPERSONATION" | "BANNED_MATCH" | "SAFETY" | "DUPLICATE_ACCOUNT" | "POLICY_VIOLATION" | "OTHER";
            note: string;
        };
        postAdminVerificationsByIdReopenBody: {
            reason: string;
        };
        postAdminVerificationsByIdFlagsBody: {
            note: string;
            /** @default false */
            blocks_approval: boolean;
        };
        postAdminApprovalsByIdDecisionBody: {
            /** @enum {string} */
            decision: "APPROVE" | "REJECT";
            note?: string;
        };
        postAdminVerificationFlagsByIdResolveBody: {
            /** @enum {string} */
            resolution: "CLEARED" | "CONFIRMED";
            note: string;
        };
        postAdminCompanionsByIdRequireReverificationBody: {
            /** @default RISK_FLAG */
            reason_code: string;
            note: string;
        };
        postAdminCompanionsByIdSuspendBody: {
            reason: string;
        };
        postAdminCompanionsByIdLiftSuspensionBody: {
            reason: string;
        };
        postAdminModerationByKindByIdDecisionBody: {
            /** @enum {string} */
            decision: "APPROVE" | "REJECT";
            reason?: string;
        };
        patchAdminCategoriesByIdPriceBandBody: {
            min_paise: number;
            max_paise: number;
            reason: string;
        };
        postAdminVenuesBody: {
            name: string;
            public_label?: string;
            /** @enum {string} */
            venue_type: "CAFE" | "RESTAURANT" | "MALL" | "CINEMA" | "EVENT_VENUE" | "BANQUET_HALL" | "PARK" | "TEMPLE" | "MUSEUM" | "PUBLIC_ROUTE" | "OTHER" | "CORPORATE_VENUE" | "CULTURAL_VENUE" | "PUBLIC_SPACE";
            /** Format: uuid */
            zone_id: string;
            address: string;
            landmark?: string;
            latitude?: number;
            longitude?: number;
            categories?: ("FRIEND" | "PLUS_ONE" | "CREW_CARE" | "CREW_EVENTS")[];
            opening_hours_text?: string;
            notes?: string;
        };
        patchAdminVenuesByIdBody: {
            name?: string;
            public_label?: string;
            /** @enum {string} */
            venue_type?: "CAFE" | "RESTAURANT" | "MALL" | "CINEMA" | "EVENT_VENUE" | "BANQUET_HALL" | "PARK" | "TEMPLE" | "MUSEUM" | "PUBLIC_ROUTE" | "OTHER" | "CORPORATE_VENUE" | "CULTURAL_VENUE" | "PUBLIC_SPACE";
            /** Format: uuid */
            zone_id?: string;
            address?: string;
            landmark?: string;
            latitude?: number;
            longitude?: number;
            categories?: ("FRIEND" | "PLUS_ONE" | "CREW_CARE" | "CREW_EVENTS")[];
            opening_hours_text?: string;
            notes?: string;
        };
        postAdminVenuesByIdApproveBody: {
            reason?: string;
        };
        postAdminVenuesByIdSuspendBody: {
            reason?: string;
        };
        postAdminVenuesByIdRejectBody: {
            reason?: string;
        };
        postAdminVenueProposalsByIdDecisionBody: {
            /** @enum {string} */
            decision: "APPROVE" | "REJECT";
            reason?: string;
        };
        postAdminReportsByIdDecisionBody: {
            /** @enum {string} */
            decision: "DISMISS" | "WARN" | "REQUIRE_REVERIFICATION" | "SUSPEND";
            note: string;
        };
        postDiscoveryCompanionsByIdReportBody: {
            /** @enum {string} */
            reason_code: "FAKE_PROFILE" | "INAPPROPRIATE_CONTENT" | "OFF_PLATFORM_CONTACT" | "NOT_PLATONIC" | "SAFETY_CONCERN" | "OTHER";
            note?: string;
        };
        postDiscoveryWaitlistBody: {
            /** Format: uuid */
            city_id: string;
            /** Format: uuid */
            zone_id?: string;
            /** Format: uuid */
            category_id?: string;
        };
        postVenuesProposalsBody: {
            name: string;
            /** @enum {string} */
            venue_type: "CAFE" | "RESTAURANT" | "MALL" | "CINEMA" | "EVENT_VENUE" | "BANQUET_HALL" | "PARK" | "TEMPLE" | "MUSEUM" | "PUBLIC_ROUTE" | "OTHER" | "CORPORATE_VENUE" | "CULTURAL_VENUE" | "PUBLIC_SPACE";
            /** Format: uuid */
            zone_id: string;
            address: string;
            /** @default [] */
            categories: ("FRIEND" | "PLUS_ONE" | "CREW_CARE" | "CREW_EVENTS")[];
            note?: string;
        };
        postBookingsByIdLocationSharingBody: {
            enabled: boolean;
        };
        postBookingsByIdLocationBody: {
            latitude: number;
            longitude: number;
            accuracy_meters?: number;
        };
        postBookingsByIdSosBody: {
            /** @default true */
            share_location: boolean;
            latitude?: number;
            longitude?: number;
            accuracy_meters?: number;
            note?: string;
        };
        postBookingsByIdSafetyPingBody: {
            ok: boolean;
        };
        postBookingsQuoteBody: {
            /** Format: uuid */
            companion_id: string;
            /** Format: uuid */
            offering_id: string;
            date: string;
            start_time: string;
            duration_minutes: number;
            /** Format: uuid */
            venue_id: string;
            /** @enum {string} */
            booking_mode?: "INSTANT" | "REQUEST";
        };
        postBookingsBody: {
            quote_id: string;
            notes?: string;
        };
        postBookingsByIdCancelBody: {
            /** @enum {string} */
            reason_code: "CHANGE_OF_PLANS" | "EMERGENCY" | "FEEL_UNSAFE" | "SCHEDULE_CONFLICT" | "VENUE_ISSUE" | "OTHER";
            note?: string;
        };
        postBookingsByIdReportIssueBody: {
            /** @enum {string} */
            issue_code: "NO_SHOW" | "LATE_ARRIVAL" | "ENDED_EARLY" | "BOUNDARY_CROSSED" | "SAFETY_CONCERN" | "OTHER";
            note?: string;
        };
        postComplaintsBody: {
            /** @enum {string} */
            type: "NO_SHOW" | "LATE" | "SERVICE_QUALITY" | "BOUNDARY_VIOLATION" | "BILLING" | "PAYMENT_FAILED" | "SAFETY" | "HARASSMENT" | "THREAT" | "ASSAULT" | "UNSAFE_SITUATION" | "OTHER";
            /** Format: uuid */
            booking_id?: string;
            description: string;
        };
        postDisputesByIdEvidenceUploadUrlBody: {
            /** @enum {string} */
            mime: "image/jpeg" | "image/png" | "image/webp";
            bytes: number;
            sha256: string;
        };
        postDisputesByIdStatementsBody: {
            body: string;
            /** @default [] */
            media_asset_ids: string[];
        };
        postDisputesByIdAppealBody: {
            statement: string;
        };
        postSupportTicketsBody: {
            /** @enum {string} */
            category: "BOOKING" | "PAYMENT" | "PAYOUT" | "ACCOUNT" | "SAFETY" | "OTHER";
            subject: string;
            body: string;
            /** Format: uuid */
            booking_id?: string;
        };
        postSupportTicketsByIdMessagesBody: {
            body: string;
        };
        postMeDeleteAccountStartBody: {
            password: string;
        };
        postMeDeleteAccountBody: {
            /** Format: uuid */
            otp_id: string;
            code: string;
            reason?: string;
        };
        postStaffInvitesByTokenStartBody: {
            password: string & (unknown & unknown);
            full_name?: string;
        };
        postStaffInvitesByTokenActivateBody: {
            code: string;
        };
        postAdminStaffInvitesBody: {
            /** Format: email */
            email: string;
            full_name: string;
            /** @enum {string} */
            role_code: "SUPER_ADMIN" | "OPS_MANAGER" | "SENIOR_OPS" | "VERIFICATION_EXECUTIVE" | "FINANCE_EXECUTIVE" | "TS_AGENT" | "TS_MANAGER" | "SUPPORT_EXECUTIVE" | "SAFETY_DESK";
        };
        postAdminStaffByIdMfaResetBody: {
            reason: string;
        };
        postAdminStaffByIdDeactivateBody: {
            reason: string;
        };
        postConversationsByIdMessagesBody: {
            body?: string;
            /** Format: uuid */
            asset_id?: string;
        };
        postConversationsByIdImagesUploadUrlBody: {
            /** @enum {string} */
            mime: "image/jpeg" | "image/png" | "image/webp";
            bytes: number;
            sha256: string;
        };
        postMessagesByIdReportBody: {
            /** @enum {string} */
            reason_code: "FAKE_PROFILE" | "INAPPROPRIATE_CONTENT" | "OFF_PLATFORM_CONTACT" | "NOT_PLATONIC" | "SAFETY_CONCERN" | "OTHER";
            note?: string;
        };
        postDevicesPushTokenBody: {
            token: string;
            /** @enum {string} */
            platform: "ANDROID" | "IOS";
        };
        postSafetyTrustedContactsBody: {
            name: string;
            phone: string;
            relationship?: string;
        };
        postSafetySosBody: {
            /** @default true */
            share_location: boolean;
            latitude?: number;
            longitude?: number;
            accuracy_meters?: number;
            note?: string;
        };
        postAdminIncidentsByIdCallUserBody: {
            /**
             * @default REPORTER
             * @enum {string}
             */
            party: "REPORTER" | "OTHER";
        };
        postAdminIncidentsByIdCallContactBody: {
            /** Format: uuid */
            trusted_contact_id: string;
        };
        postAdminIncidentsByIdFreezeBody: {
            note: string;
        };
        postAdminIncidentsByIdMarkSafeBody: {
            note?: string;
        };
        postAdminIncidentsByIdCloseBody: {
            /** @enum {string} */
            outcome: "SAFE_NO_ACTION" | "RESOLVED_BY_DESK" | "EMERGENCY_SERVICES" | "FALSE_ALARM" | "OTHER";
            notes: string;
        };
        postAdminIncidentsByIdFollowUpBody: {
            note?: string;
        };
        postAdminMessagesByIdDecisionBody: {
            /** @enum {string} */
            decision: "APPROVE" | "REJECT";
            note?: string;
        };
        postAdminBookingsByIdCancelBody: {
            /** @enum {string} */
            reason_code: "SAFETY" | "VENUE_UNAVAILABLE" | "COMPANION_UNAVAILABLE" | "POLICY_VIOLATION" | "OTHER";
            note: string;
        };
        postAdminBookingsByIdResolveBody: {
            /** @enum {string} */
            outcome: "RELEASE_TO_COMPANION" | "FULL_REFUND" | "PARTIAL_REFUND";
            amount_paise?: number;
            note: string;
        };
        postAdminSettingsPricingBody: {
            key: string;
            value: unknown;
            reason: string;
        };
        postAdminPayoutsBatchesBody: {
            cycle_date?: string;
        };
        postAdminPayoutAccountsByIdDecideBody: {
            /** @enum {string} */
            decision: "APPROVE" | "REJECT";
            note: string;
        };
        postAdminPayoutHoldsBody: {
            /** Format: uuid */
            companion_profile_id: string;
            /** @enum {string} */
            source: "FINANCE" | "TRUST_SAFETY";
            reason: string;
        };
        postAdminPayoutHoldsByIdReleaseBody: {
            note: string;
        };
        postAdminRefundsByIdReRaiseBody: {
            reason: string;
        };
        postAdminDisputesByIdDecideBody: {
            /** @enum {string} */
            outcome: "RELEASE_TO_COMPANION" | "FULL_REFUND" | "PARTIAL_REFUND";
            amount_paise?: number;
            reason: string;
            /** @enum {string} */
            strike_party?: "CUSTOMER" | "COMPANION";
        };
        postAdminAppealsByIdDecideBody: {
            /** @enum {string} */
            decision: "UPHOLD" | "OVERTURN";
            /** @enum {string} */
            outcome?: "RELEASE_TO_COMPANION" | "FULL_REFUND" | "PARTIAL_REFUND";
            amount_paise?: number;
            reason: string;
        };
        postAdminSupportTicketsByIdMessagesBody: {
            body: string;
            /** @default false */
            internal: boolean;
        };
        postAdminSupportTicketsByIdStatusBody: {
            /** @enum {string} */
            status: "IN_PROGRESS" | "RESOLVED" | "CLOSED";
        };
        postPaymentsMockOrdersByOrderIdCompleteBody: {
            /** @enum {string} */
            scenario: "SUCCESS" | "FAILED" | "PENDING_THEN_SUCCESS" | "DUPLICATE_WEBHOOK" | "LATE_SUCCESS" | "REFUND_FAIL_ONCE";
        };
        postCallsMockSimulateBody: {
            /** Format: uuid */
            booking_id: string;
            /**
             * @default ANSWERED
             * @enum {string}
             */
            status: "ANSWERED" | "MISSED" | "BUSY" | "FAILED";
            /** @default 120 */
            duration_seconds: number;
            /** @default false */
            duplicate: boolean;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getAdminAppeals: {
        parameters: {
            query?: {
                status?: "SUBMITTED" | "IN_REVIEW" | "UPHELD" | "OVERTURNED" | "ALL";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppealsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminAppealsByIdDecide: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminAppealsByIdDecideBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppealDecidedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminApprovals: {
        parameters: {
            query?: {
                status?: "PENDING" | "EXECUTED" | "REJECTED" | "EXPIRED";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApprovalsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminApprovalsByIdDecision: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminApprovalsByIdDecisionBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionResult"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminBookings: {
        parameters: {
            query?: {
                status?: "DRAFT" | "REQUESTED" | "AWAITING_COMPANION" | "ACCEPTED" | "REJECTED" | "PAYMENT_PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "EXPIRED" | "DISPUTED" | "REFUNDED" | "PARTIALLY_REFUNDED";
                q?: string;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminBookingsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminBookingsById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminBookingResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminBookingsByIdCancel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminBookingsByIdCancelBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminBookingResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminBookingsByIdResolve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminBookingsByIdResolveBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DisputeResolvedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    patchAdminCategoriesByIdPriceBand: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["patchAdminCategoriesByIdPriceBandBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PriceBandResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminCompanionsByIdLiftSuspension: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminCompanionsByIdLiftSuspensionBody"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionResult"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminCompanionsByIdRequireReverification: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminCompanionsByIdRequireReverificationBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionResult"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminCompanionsByIdSuspend: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminCompanionsByIdSuspendBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionResult"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminDisputes: {
        parameters: {
            query?: {
                status?: "OPEN_ALL" | "OPEN" | "AWAITING_RESPONSE" | "UNDER_REVIEW" | "RESOLVED" | "APPEALED" | "CLOSED";
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DisputeQueueResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminDisputesById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminDisputeResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminDisputesByIdClaim: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DisputeClaimResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminDisputesByIdDecide: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminDisputesByIdDecideBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DisputeDecidedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminDisputesByIdRelease: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DisputeClaimResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminDisputesByIdTranscript: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DisputeTranscriptResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminIncidents: {
        parameters: {
            query?: {
                status?: "open" | "all";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IncidentsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminIncidentsById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IncidentResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminIncidentsByIdAck: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IncidentResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminIncidentsByIdCallContact: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminIncidentsByIdCallContactBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CallNumberResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminIncidentsByIdCallUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminIncidentsByIdCallUserBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CallNumberResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminIncidentsByIdClose: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminIncidentsByIdCloseBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IncidentResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminIncidentsByIdFollowUp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminIncidentsByIdFollowUpBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IncidentResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminIncidentsByIdFreeze: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminIncidentsByIdFreezeBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FrozenResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminIncidentsByIdMarkSafe: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminIncidentsByIdMarkSafeBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IncidentResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminMessagesByIdDecision: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminMessagesByIdDecisionBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HeldDecisionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminMessagesHeld: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HeldMessagesResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminModeration: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ModerationQueue"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminModerationByKindByIdDecision: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                kind: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminModerationByKindByIdDecisionBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionResult"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminNotificationsByIdRetry: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationRetriedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminNotificationsFailures: {
        parameters: {
            query?: {
                status?: "DEAD" | "FAILED";
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationFailuresResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminPayoutAccounts: {
        parameters: {
            query?: {
                status?: "PENDING_VERIFICATION" | "VERIFIED" | "NEEDS_REVIEW" | "REJECTED" | "COOLING" | "SUPERSEDED";
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPayoutAccountsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminPayoutAccountsByIdDecide: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminPayoutAccountsByIdDecideBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPayoutAccountResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminPayoutHolds: {
        parameters: {
            query?: {
                status?: "ACTIVE" | "RELEASE_PENDING" | "RELEASED" | "ALL";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutHoldsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminPayoutHolds: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminPayoutHoldsBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutHoldResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminPayoutHoldsByIdRelease: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminPayoutHoldsByIdReleaseBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutHoldResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminPayouts: {
        parameters: {
            query?: {
                status?: "PENDING" | "AWAITING_APPROVAL" | "PROCESSING" | "PAID" | "FAILED" | "ON_HOLD" | "CANCELLED" | "REVERSED";
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPayoutsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminPayoutsById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPayoutResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminPayoutsByIdRetry: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPayoutResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminPayoutsBatches: {
        parameters: {
            query?: {
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutBatchesResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminPayoutsBatches: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminPayoutsBatchesBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutBatchBuiltResponse"];
                };
            };
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutBatchBuiltResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminPayoutsBatchesById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutBatchResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminPayoutsBatchesByIdRequestApproval: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutBatchRefResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminPayoutsReconcile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutReconcileResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminRefunds: {
        parameters: {
            query?: {
                status?: "PENDING_APPROVAL" | "APPROVED" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "REJECTED";
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminRefundsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminRefundsByIdReRaise: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminRefundsByIdReRaiseBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RefundReRaisedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminReports: {
        parameters: {
            query?: {
                subject?: "PROFILE";
                status?: "OPEN" | "IN_REVIEW" | "ACTIONED" | "DISMISSED";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminReportsByIdDecision: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminReportsByIdDecisionBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionResult"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminSettingsPricing: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PricingSettingsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminSettingsPricing: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminSettingsPricingBody"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SettingProposedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminStaff: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StaffListResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminStaffByIdDeactivate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminStaffByIdDeactivateBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StaffDeactivatedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminStaffByIdMfaReset: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminStaffByIdMfaResetBody"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RequestedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminStaffInvites: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminStaffInvitesBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StaffInvitedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminStaffInvitesByIdRevoke: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RevokedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminSupportTickets: {
        parameters: {
            query?: {
                status?: "ACTIVE" | "OPEN" | "IN_PROGRESS" | "PENDING_USER" | "RESOLVED" | "CLOSED";
                mine?: "true" | "false";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminTicketsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminSupportTicketsById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminTicketResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminSupportTicketsByIdClaim: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminTicketResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminSupportTicketsByIdMessages: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminSupportTicketsByIdMessagesBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminTicketResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminSupportTicketsByIdStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminSupportTicketsByIdStatusBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminTicketResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminVenueProposals: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueStaffListResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminVenueProposalsByIdDecision: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminVenueProposalsByIdDecisionBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueStatusResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminVenues: {
        parameters: {
            query?: {
                status?: "PROPOSED" | "APPROVED" | "SUSPENDED" | "REJECTED" | "ARCHIVED";
                zone?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueStaffListResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminVenues: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminVenuesBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueStatusResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminVenuesById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueStaff"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    patchAdminVenuesById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["patchAdminVenuesByIdBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueStaff"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminVenuesByIdApprove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminVenuesByIdApproveBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueStatusResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminVenuesByIdReject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminVenuesByIdRejectBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueStatusResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminVenuesByIdSuspend: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminVenuesByIdSuspendBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueStatusResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminVerificationFlagsByIdResolve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminVerificationFlagsByIdResolveBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionResult"];
                };
            };
            /** @description Waiting for a second approver */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionResult"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminVerifications: {
        parameters: {
            query?: {
                status?: "IN_REVIEW" | "AUTO_REJECTED" | "APPROVED" | "NEEDS_CHANGES" | "REJECTED" | "AUTO_CHECKING" | "SUBMITTED";
                flagged?: "true" | "false";
                sort?: "priority" | "oldest";
                page?: number;
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VerificationQueue"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminVerificationsById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VerificationDetailResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminVerificationsByIdClaim: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClaimResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminVerificationsByIdDecision: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminVerificationsByIdDecisionBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionResult"];
                };
            };
            /** @description Waiting for a second approver */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionResult"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAdminVerificationsByIdDocumentsByAssetIdViewUrl: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                assetId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentViewUrlResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminVerificationsByIdFlags: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminVerificationsByIdFlagsBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CreatedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminVerificationsByIdRelease: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAdminVerificationsByIdReopen: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAdminVerificationsByIdReopenBody"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionResult"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthEmailResend: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EmailResendResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthEmailVerify: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAuthEmailVerifyBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EmailVerifiedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthLogin: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAuthLoginBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthLogout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAuthMe: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MeResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthMfaLogin: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAuthMfaLoginBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthMfaRecoveryCodes: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecoveryCodesResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthMfaTotpActivate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAuthMfaTotpActivateBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecoveryCodesResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthMfaTotpEnroll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MfaEnrollResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthMfaVerify: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAuthMfaVerifyBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MfaVerifiedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthOtpResend: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAuthOtpResendBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChallengeResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthOtpVerify: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAuthOtpVerifyBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthPasswordForgot: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAuthPasswordForgotBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForgotPasswordResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthPasswordReset: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAuthPasswordResetBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResetPasswordResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthRefresh: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postAuthRegister: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postAuthRegisterBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChallengeResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getBookings: {
        parameters: {
            query?: {
                tab?: "upcoming" | "past" | "cancelled";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingListResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postBookings: {
        parameters: {
            query?: never;
            header: {
                /** @description 8-60 characters; one per booking attempt */
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postBookingsBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingResponse"];
                };
            };
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getBookingsById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postBookingsByIdCall: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CallNumberResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postBookingsByIdCancel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postBookingsByIdCancelBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingCancelledResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getBookingsByIdCancellationPreview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CancellationPreviewResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postBookingsByIdCheckIn: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postBookingsByIdCheckOut: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postBookingsByIdLocation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postBookingsByIdLocationBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LocationStoredResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getBookingsByIdLocationSharing: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LocationSharingResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postBookingsByIdLocationSharing: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postBookingsByIdLocationSharingBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LocationSharingResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postBookingsByIdPay: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingPaymentResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getBookingsByIdReceipt: {
        parameters: {
            query?: {
                format?: "json" | "html";
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReceiptResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postBookingsByIdReportIssue: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postBookingsByIdReportIssueBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getBookingsByIdSafetyPing: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PendingPingResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postBookingsByIdSafetyPing: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postBookingsByIdSafetyPingBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PingAnsweredResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postBookingsByIdSos: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postBookingsByIdSosBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SosResponse"];
                };
            };
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SosResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getBookingsForm: {
        parameters: {
            query: {
                companion_id: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingFormResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postBookingsQuote: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postBookingsQuoteBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingQuoteResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getBookingsSlots: {
        parameters: {
            query: {
                companion_id: string;
                offering_id: string;
                date: string;
                duration_minutes: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingSlotsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCallsMockSimulate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postCallsMockSimulateBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CallSimulatedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    putCompanionActivities: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["putCompanionActivitiesBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionApply: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postCompanionApplyBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApplyResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionAvailability: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AvailabilityResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    putCompanionAvailability: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["putCompanionAvailabilityBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AvailabilityResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionAvailabilityExceptions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postCompanionAvailabilityExceptionsBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AvailabilityResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    deleteCompanionAvailabilityExceptionsById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AvailabilityResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionBookings: {
        parameters: {
            query?: {
                status?: "requests" | "upcoming" | "past" | "cancelled";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingListResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionBookingsByIdAccept: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionBookingsByIdReject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postCompanionBookingsByIdRejectBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    putCompanionBoundaries: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["putCompanionBoundariesBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    putCompanionCategories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["putCompanionCategoriesBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionEarnings: {
        parameters: {
            query?: {
                status?: "PENDING" | "ON_HOLD" | "AVAILABLE" | "IN_BATCH" | "PAID" | "FAILED" | "REVERSED" | "CLAWBACK";
                before?: string;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EarningsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionEarningsSummary: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EarningsSummaryResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionGoLive: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GoLiveResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionMe: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionOptions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionOptions"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionPause: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postCompanionPauseBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionPayoutAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutAccountResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionPayoutAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postCompanionPayoutAccountBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutAccountResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionPayouts: {
        parameters: {
            query?: {
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionPayoutsById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionPayoutsByIdStatement: {
        parameters: {
            query?: {
                format?: "html" | "csv";
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/octet-stream": string;
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionPayoutsByIdStatementLink: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postCompanionPayoutsByIdStatementLinkBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StatementLinkResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionPayoutsStatement: {
        parameters: {
            query: {
                token: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/octet-stream": string;
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    deleteCompanionPhotosById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionPhotosByIdConfirm: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PhotoConfirmedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    putCompanionPhotosOrder: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["putCompanionPhotosOrderBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionPhotosUploadUrl: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postCompanionPhotosUploadUrlBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UploadUrlResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    patchCompanionProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["patchCompanionProfileBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionPublicPreview: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicProfile"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCompanionRates: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RatesResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    putCompanionRates: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["putCompanionRatesBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RatesResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionResume: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionSubmit: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionVerification: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postCompanionVerificationBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionVerificationDigilockerComplete: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postCompanionVerificationDigilockerCompleteBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionVerificationDigilockerStart: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DigiLockerStartResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionVerificationDocumentsByIdConfirm: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionVerificationDocumentsUploadUrl: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postCompanionVerificationDocumentsUploadUrlBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UploadUrlResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionVerificationLivenessComplete: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postCompanionVerificationLivenessCompleteBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postCompanionVerificationLivenessSession: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LivenessSessionResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postComplaints: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postComplaintsBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ComplaintCreatedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getConversations: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConversationsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postConversationsByIdBlock: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BlockedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postConversationsByIdImagesUploadUrl: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postConversationsByIdImagesUploadUrlBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UploadUrlResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getConversationsByIdMessages: {
        parameters: {
            query?: {
                before?: string;
                limit?: number;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessagesResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postConversationsByIdMessages: {
        parameters: {
            query?: never;
            header: {
                /** @description The client message id (8-64 characters) */
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postConversationsByIdMessagesBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageSentResponse"];
                };
            };
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageSentResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postConversationsByIdRead: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReadMarkedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postDevicesPushToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postDevicesPushTokenBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PushTokenResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    deleteDevicesPushToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PushTokenResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getDiscoveryCompanions: {
        parameters: {
            query?: {
                category?: string;
                activity?: string;
                zone?: string;
                language?: string | string[];
                interest?: string | string[];
                date?: string;
                time_window?: "morning" | "afternoon" | "evening";
                start_time?: string;
                end_time?: string;
                duration_minutes?: number;
                min_paise?: number;
                max_paise?: number;
                sort?: "relevance" | "price_asc" | "price_desc" | "soonest";
                cursor?: string;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DiscoveryListResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getDiscoveryCompanionsById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicProfile"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postDiscoveryCompanionsByIdReport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postDiscoveryCompanionsByIdReportBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postDiscoveryCompanionsByIdSave: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SavedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    deleteDiscoveryCompanionsByIdSave: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SavedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getDiscoveryOptions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DiscoveryOptions"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getDiscoveryRecent: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DiscoveryCardsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getDiscoverySaved: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DiscoveryCardsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postDiscoveryWaitlist: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postDiscoveryWaitlistBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WaitlistResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getDisputes: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DisputesResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getDisputesById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DisputeResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postDisputesByIdAppeal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postDisputesByIdAppealBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DisputeResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postDisputesByIdEvidenceUploadUrl: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postDisputesByIdEvidenceUploadUrlBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EvidenceUploadResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postDisputesByIdStatements: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postDisputesByIdStatementsBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DisputeResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getLegalGrievanceOfficer: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GrievanceOfficerResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getMeConsents: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConsentsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postMeConsentsByTypeWithdraw: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                type: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConsentsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getMeDataExport: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataExportStateResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postMeDataExport: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataExportStateResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postMeDataExportByIdLink: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataExportLinkResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getMeDataExportDownload: {
        parameters: {
            query: {
                token: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/octet-stream": string;
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getMeDeleteAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeletionStateResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postMeDeleteAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postMeDeleteAccountBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeletionStateResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postMeDeleteAccountCancel: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeletionStateResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postMeDeleteAccountStart: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postMeDeleteAccountStartBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChallengeResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postMessagesByIdReport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postMessagesByIdReportBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postOnboardingComplete: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postOnboardingCompleteBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MeResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getOnboardingOptions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OnboardingOptions"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getOpenapiJson: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getPaymentsMockOrdersByOrderId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                orderId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MockPaymentOrderResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postPaymentsMockOrdersByOrderIdComplete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                orderId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postPaymentsMockOrdersByOrderIdCompleteBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MockCheckoutResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postPaymentsMockOrdersByOrderIdFlush: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                orderId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MockFlushResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getSafetyInvitesByToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InviteInfoResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postSafetyInvitesByTokenAccept: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InviteAcceptedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getSafetyShareByToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SharePageResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postSafetySos: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postSafetySosBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SosResponse"];
                };
            };
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SosResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postSafetySosByIdSafe: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SosCurrentResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getSafetySosCurrent: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SosCurrentResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getSafetyTrustedContacts: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TrustedContactsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postSafetyTrustedContacts: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postSafetyTrustedContactsBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TrustedContactAddedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    deleteSafetyTrustedContactsById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RemovedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postSafetyTrustedContactsByIdResend: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TrustedContactAddedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getStaffInvitesByToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StaffInviteResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postStaffInvitesByTokenActivate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postStaffInvitesByTokenActivateBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StaffInviteAcceptedResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postStaffInvitesByTokenStart: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postStaffInvitesByTokenStartBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MfaEnrollResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    putStorageLocalUploadByToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/octet-stream": string;
            };
        };
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getStorageLocalViewByToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/octet-stream": string;
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getSupportTickets: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketsResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postSupportTickets: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postSupportTicketsBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getSupportTicketsById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postSupportTicketsByIdMessages: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postSupportTicketsByIdMessagesBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getVenues: {
        parameters: {
            query?: {
                zone?: string;
                category?: "FRIEND" | "PLUS_ONE" | "CREW_CARE" | "CREW_EVENTS";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenuesResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postVenuesProposals: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["postVenuesProposalsBody"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VenueStatusResponse"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postWebhooksCallsByProvider: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                provider: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookAck"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postWebhooksKycByProvider: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                provider: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookAck"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postWebhooksPaymentsByProvider: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                provider: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentWebhookAck"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    postWebhooksPayoutsByProvider: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                provider: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayoutWebhookAck"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
}

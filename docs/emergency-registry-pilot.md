# Sensory Passport Emergency Registry Pilot

## Purpose

Create a private, opt-in emergency accessibility registry that lets a family voluntarily share a limited emergency summary with verified first-responder organizations.

This registry is separate from the regular Sensory Passport. A responder should never receive the full family passport automatically.

## Core principles

- Opt-in only. No family is enrolled automatically.
- Families control what emergency information is included.
- Emergency data is separate from the general passport.
- No public address lookup.
- Responders must use verified organization accounts.
- Every responder lookup is recorded in an audit trail.
- Access can be revoked by the family.
- Entries expire and require periodic renewal so old information does not remain indefinitely.
- Emergency responders retain professional judgment and required emergency protocols.

## Family enrollment fields

- Registered address
- Optional apartment/unit/location notes
- Preferred name
- Top 3 Things to Know
- Communication summary
- Signs of distress or overwhelm
- Sensory triggers
- What helps calm or regulate
- Touch/approach preferences
- Limited responder notes
- Emergency support contact
- Consent date
- Expiration date
- Active/revoked status

Do not make diagnosis, full medical history, medication lists, or other clinical records required fields for registry enrollment.

## Responder access model

Responder access should require:

1. An authenticated user account.
2. Membership in a verified emergency-response organization.
3. An approved responder role such as EMT, paramedic, firefighter, dispatcher, or law-enforcement responder.
4. A documented operational reason for each lookup.
5. Audit logging of who searched, which organization they represented, when the search occurred, and whether a registry entry was found.

The responder result should return only the emergency-specific summary authorized by the family.

## Database architecture

Use the existing Supabase project and existing `profiles`, `profile_guardians`, `provider_organizations`, `provider_members`, consent, access, and audit concepts.

Address-linked emergency registry records should live outside the ordinary public Data API surface, ideally in a non-exposed private schema. Browser clients should not receive a service-role or secret database key.

Suggested private records:

### emergency_registry_entries

- id
- profile_id
- owner_user_id
- status
- address fields
- location notes
- top_three
- communication_summary
- distress_signs
- sensory_triggers
- calming_supports
- touch_preferences
- responder_notes
- emergency_contact_name
- emergency_contact_phone
- consent_given_at
- expires_at
- revoked_at
- created_at
- updated_at

### emergency_registry_lookup_logs

- id
- requester_user_id
- organization_id
- provider_member_id
- registry_entry_id when a match exists
- lookup_reason
- result_found
- created_at

Avoid duplicating the full searched address in audit logs unless there is a documented operational need.

## Authorization

Family users may create, view, update, revoke, and delete only emergency entries for profiles they own or are authorized to edit.

Responder accounts must not receive unrestricted direct table access. Address lookup should pass through a controlled server-side endpoint or function that:

- verifies the authenticated responder,
- verifies their organization,
- checks their responder role,
- records the audit event,
- returns only the limited emergency summary.

Require stronger authentication such as MFA for responder accounts before production use.

## Pilot workflow

1. Family completes the normal Sensory Passport.
2. Family opens Emergency Registry enrollment.
3. The app explains that enrollment is optional and address-linked.
4. Family chooses exactly what information responders may see.
5. Family confirms consent and expiration/renewal terms.
6. Verified pilot responder signs into the responder portal.
7. Responder searches an address during a legitimate response.
8. System records the lookup.
9. If a match exists, the responder sees the Top 3 and emergency support summary only.
10. Family can later revoke or update the entry.

## Before production

Before any real family address data is collected, complete privacy/security review, terms and consent language, retention/deletion rules, incident response planning, responder identity verification procedures, and applicable legal review. Test with synthetic data first.

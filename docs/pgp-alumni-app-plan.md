# PGP College Alumni & Management Mobile App Plan

## 1. Architecture overview

### Recommended approach
- **Mobile app:** React Native with Expo + TypeScript for fast MVP delivery across Android/iOS.
- **Backend API:** Node.js + Express or NestJS + TypeScript.
- **Database:** MySQL 8 for production, seeded initially from Excel/CSV imports.
- **Storage:** S3-compatible object storage for attachments (MP3, MP4, JPG/PNG, PDF).
- **Realtime:** Socket.IO for forum thread updates; fallback to short polling.

### Textual architecture diagram
```text
[React Native App]
   |- Alumni login / profile / admin posts / forum / chat
   |- Admin login / post creation / moderation
   |
   v
[API Gateway / Backend Service - TypeScript]
   |- Auth module
   |- Alumni profile module
   |- Admin post module
   |- Forum moderation module
   |- Attachment upload module
   |- Import module (CSV -> MySQL)
   |
   +--> [MySQL]
   |      |- users
   |      |- alumni_profiles
   |      |- admin_posts
   |      |- post_attachments
   |      |- forum_posts
   |      |- forum_comments
   |      |- audit_logs
   |
   +--> [Object Storage]
   |      |- images/
   |      |- videos/
   |      |- audio/
   |      |- pdf/
   |
   +--> [Redis - optional]
          |- token/session cache
          |- rate limiting
          |- websocket scaling
```

### Current batch clarification
- Default recommendation: **include current batch students** so they can engage early.
- Add an **admin setting**: `allow_current_batch_access = true/false` to exclude them later without code changes.

## 2. MVP scope

### MVP features
1. Secure alumni and admin authentication.
2. Alumni sign-up/profile creation.
3. Admin-authored published posts visible to alumni.
4. Attachment upload support for MP3, MP4, JPG, PNG, PDF.
5. Alumni forum submission to moderation queue.
6. Admin approve/reject moderation flow.
7. Approved forum posts visible to all alumni.
8. Basic thread comments with realtime updates if available, polling fallback if not.
9. CSV import of alumni master data for bootstrap.

### Core user stories
- As an **alumni**, I can log in using registration number + DOB or phone + DOB so I can access the app even if my registration number is unavailable.
- As an **alumni**, I can view official management/admin posts with attachments.
- As an **alumni**, I can submit a forum post for approval.
- As an **admin**, I can create, publish, and manage official posts.
- As an **admin**, I can review pending forum posts and approve/reject them.
- As an **alumni**, I can join discussions under approved forum topics.
- As an **admin**, I can disable current batch access if policy changes.

## 3. Phased roadmap

### Phase 1 - MVP (4-6 weeks)
- Authentication and role-based access.
- Alumni profile onboarding.
- Admin posts + attachment uploads.
- Forum moderation queue.
- Approved posts and comment threads.
- CSV import tooling.

### Phase 2 - Hardening
- Push notifications.
- Advanced search/filter by batch, tags, post type.
- Audit logging and analytics dashboards.
- Stronger admin moderation workflows.
- Richer profile completion.

### Phase 3 - Scale and engagement
- Event registration.
- Donations/campaign modules.
- Mentorship matching.
- Placement/referral board.
- AI-assisted moderation or duplicate detection.

## 4. Tech stack recommendation

### Recommended stack
- **Mobile:** React Native + Expo + TypeScript.
- **API:** NestJS or Express + TypeScript.
- **ORM:** Prisma.
- **DB:** MySQL 8.
- **Auth:** JWT access tokens + refresh tokens, bcrypt/argon2 password hashing.
- **Storage:** AWS S3 / Cloudflare R2 / MinIO.
- **Realtime:** Socket.IO.
- **Validation:** Zod or class-validator.
- **Testing:** Jest + Supertest + Playwright/Appium later.
- **Deployment:** Docker + Nginx + managed MySQL.

### Why this stack
- TypeScript improves maintainability across backend and mobile layers.
- React Native gives a single codebase for Android/iOS.
- Prisma simplifies MySQL migration and schema evolution.
- S3-compatible storage avoids storing files in the database.

## 5. MySQL schema outline

### users
- `id` (uuid, pk)
- `role` (`ALUMNI`, `ADMIN`)
- `login_identifier_type` (`REG_NO`, `PHONE`, `EMAIL`, `USERNAME`)
- `registered_no` (nullable, indexed)
- `phone_number` (nullable, indexed)
- `password_hash`
- `password_salt` (if hashing library requires explicit salt storage)
- `dob_last_reset_at` (nullable)
- `is_active`
- `created_at`, `updated_at`

### alumni_profiles
- `id` (uuid, pk)
- `user_id` (fk users.id)
- `first_name`
- `last_name`
- `student_name`
- `batch_year`
- `registration_number` (nullable)
- `phone_number`
- `allow_access`
- `is_current_batch`
- `created_at`, `updated_at`

### app_settings
- `id`
- `allow_current_batch_access` (boolean)
- `updated_by`
- `updated_at`

### admin_posts
- `id`
- `author_user_id`
- `title`
- `content`
- `status` (`DRAFT`, `PUBLISHED`, `ARCHIVED`)
- `published_at`
- `created_at`, `updated_at`

### post_attachments
- `id`
- `post_id`
- `file_name`
- `mime_type`
- `storage_key`
- `public_url`
- `file_size_bytes`
- `created_at`

### forum_posts
- `id`
- `author_user_id`
- `title`
- `content`
- `status` (`PENDING`, `APPROVED`, `REJECTED`)
- `reviewed_by` (nullable)
- `reviewed_at` (nullable)
- `review_notes` (nullable)
- `created_at`, `updated_at`

### forum_comments
- `id`
- `forum_post_id`
- `author_user_id`
- `message`
- `created_at`, `updated_at`

### audit_logs
- `id`
- `actor_user_id`
- `action`
- `entity_type`
- `entity_id`
- `metadata_json`
- `created_at`

## 6. Excel/CSV to MySQL import workflow

1. Admin exports alumni records from Excel as CSV.
2. Backend import job validates required columns:
   - first_name
   - last_name
   - phone_number
   - student_name
   - batch_year
   - registration_number (optional)
   - dob
3. Normalize phone numbers and registration numbers.
4. Reject invalid rows into an error report CSV.
5. For valid rows:
   - upsert `users`
   - hash DOB-based initial password securely
   - upsert `alumni_profiles`
6. Produce import summary: inserted, updated, rejected.
7. Over time, switch operational reads/writes fully to MySQL.

## 7. API blueprint

### Authentication
- `POST /api/auth/alumni/login`
- `POST /api/auth/admin/login`
- `POST /api/auth/signup`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/me`

### Admin posts
- `POST /api/admin/posts`
- `GET /api/posts`
- `GET /api/posts/:postId`
- `POST /api/uploads/presign`

### Forum
- `POST /api/forum/submissions`
- `GET /api/forum/posts`
- `GET /api/forum/posts/:postId/comments`
- `POST /api/forum/posts/:postId/comments`

### Moderation
- `GET /api/admin/forum/pending`
- `PATCH /api/admin/forum/:postId/review`

### Imports and settings
- `POST /api/admin/imports/alumni-csv`
- `PATCH /api/admin/settings/current-batch-access`

## 8. Response/data model examples

### Alumni login request
```json
{
  "loginType": "REG_NO",
  "identifier": "PGP2019CSE001",
  "dob": "2001-05-14"
}
```

### Alumni login response
```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "user": {
    "id": "uuid",
    "role": "ALUMNI",
    "firstName": "Anitha",
    "batchYear": 2019
  }
}
```

### Forum review request
```json
{
  "decision": "APPROVED",
  "reviewNotes": "Relevant alumni update"
}
```

## 9. Security notes
- Never store DOB in plain text.
- Treat DOB only as an **initial secret**, then require password reset after first login if possible.
- Hash passwords with **Argon2id** or **bcrypt** with strong cost factors.
- Use short-lived access tokens and rotating refresh tokens.
- Validate file MIME type and extension, scan uploads, and size-limit by type.
- Enforce role-based authorization on every admin route.
- Add rate limiting to login and upload endpoints.
- Encrypt transport with HTTPS only.
- Add audit logs for sign-in, approval, rejection, and post creation.

## 10. Deployment guidance
- Use separate environments: dev, staging, prod.
- Run backend in Docker behind Nginx.
- Use managed MySQL with automated backups.
- Store secrets in environment variables or a secret manager.
- Use object storage lifecycle rules and signed URLs.
- Add monitoring with health checks, logs, and error reporting.

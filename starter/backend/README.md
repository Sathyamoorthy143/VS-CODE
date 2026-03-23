# Backend starter: local testing guide

This folder is a **runnable backend starter** for the PGP alumni app plan.

## 1) Install dependencies

```bash
cd starter/backend
npm install
```

## 2) Configure environment

```bash
cp .env.example .env
```

Set a strong `JWT_SECRET` in `.env`.

## 3) Start the API locally

```bash
npm run dev
```

The API starts on `http://localhost:4000` by default.

## 4) Run automated tests

```bash
npm test
```

This runs a smoke-test flow for:
- alumni signup
- alumni login with phone + DOB
- admin post creation
- alumni post feed retrieval
- forum submission
- admin approval
- alumni comments on approved thread

## 5) Manual test with curl

### Health
```bash
curl http://localhost:4000/health
```

### Alumni signup
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Asha",
    "lastName": "R",
    "studentName": "Asha R",
    "batchYear": 2020,
    "phoneNumber": "9876543210",
    "registrationNumber": "PGP2020IT001",
    "dob": "2002-06-01"
  }'
```

### Alumni login using phone + DOB
```bash
curl -X POST http://localhost:4000/api/auth/alumni/login \
  -H 'Content-Type: application/json' \
  -d '{
    "loginType": "PHONE",
    "identifier": "9876543210",
    "dob": "2002-06-01"
  }'
```

### Request upload slot
```bash
curl -X POST http://localhost:4000/api/uploads/presign \
  -H 'Content-Type: application/json' \
  -d '{
    "fileName": "invite.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": 2048
  }'
```

### Create admin post
```bash
curl -X POST http://localhost:4000/api/admin/posts \
  -H 'Content-Type: application/json' \
  -H 'x-user-id: admin-1' \
  -d '{
    "title": "Welcome alumni",
    "content": "Annual meet registration opens soon.",
    "attachmentInputs": [
      {
        "fileName": "invite.pdf",
        "mimeType": "application/pdf",
        "storageKey": "invite.pdf",
        "publicUrl": "https://example.com/invite.pdf",
        "fileSizeBytes": 2048
      }
    ]
  }'
```

### Submit forum post
```bash
curl -X POST http://localhost:4000/api/forum/submissions \
  -H 'Content-Type: application/json' \
  -H 'x-user-id: alumni-1' \
  -d '{
    "title": "Need placement guidance",
    "content": "Anyone from 2021 batch working in product companies?"
  }'
```

### Approve forum post
Replace `<POST_ID>` with the ID returned by the previous step.

```bash
curl -X PATCH http://localhost:4000/api/admin/forum/<POST_ID>/review \
  -H 'Content-Type: application/json' \
  -H 'x-user-id: admin-1' \
  -d '{
    "decision": "APPROVED",
    "reviewNotes": "Useful topic for alumni."
  }'
```

### Add comment to approved thread
```bash
curl -X POST http://localhost:4000/api/forum/posts/<POST_ID>/comments \
  -H 'Content-Type: application/json' \
  -H 'x-user-id: alumni-2' \
  -d '{
    "message": "Yes, I can help."
  }'
```

## 6) How to test this in the Codex app
1. Open the repo/worktree in Codex.
2. Ask Codex to run:
   - `cd starter/backend && npm install`
   - `cd starter/backend && npm test`
3. Ask Codex to start the API with `cd starter/backend && npm run dev`.
4. In a second task/thread, ask Codex to exercise the curl examples above.
5. Review the output, then ask Codex to extend the starter with MySQL/Prisma or a React Native client.

## 7) Important limitations of this starter
- It uses **in-memory arrays**, so data resets on restart.
- Admin auth is only a route skeleton; seed or persistent admin creation should be added next.
- File upload returns a **mock presigned URL** and should be replaced with real S3/R2/MinIO integration.
- Route-level RBAC middleware, DTO validation, refresh-token rotation persistence, and DB-backed audit logs should be added before production.

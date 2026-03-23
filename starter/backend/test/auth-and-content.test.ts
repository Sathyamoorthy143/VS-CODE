import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app';
import { resetStore } from '../src/store';

test.beforeEach(() => {
  resetStore();
});

test('alumni can sign up and log in with phone + DOB', async () => {
  const app = createApp();

  const signupResponse = await request(app)
    .post('/api/auth/signup')
    .send({
      firstName: 'Asha',
      lastName: 'R',
      studentName: 'Asha R',
      batchYear: 2020,
      phoneNumber: '9876543210',
      registrationNumber: 'PGP2020IT001',
      dob: '2002-06-01',
    });

  assert.equal(signupResponse.status, 201);

  const loginResponse = await request(app)
    .post('/api/auth/alumni/login')
    .send({
      loginType: 'PHONE',
      identifier: '9876543210',
      dob: '2002-06-01',
    });

  assert.equal(loginResponse.status, 200);
  assert.ok(loginResponse.body.accessToken);
});

test('admin can publish a post and alumni can fetch it', async () => {
  const app = createApp();

  const createPost = await request(app)
    .post('/api/admin/posts')
    .set('x-user-id', 'admin-1')
    .send({
      title: 'Welcome alumni',
      content: 'Annual meet registration opens soon.',
      attachmentInputs: [
        {
          fileName: 'invite.pdf',
          mimeType: 'application/pdf',
          storageKey: 'invite.pdf',
          publicUrl: 'https://example.com/invite.pdf',
          fileSizeBytes: 2048,
        },
      ],
    });

  assert.equal(createPost.status, 201);
  assert.equal(createPost.body.attachments.length, 1);

  const feedResponse = await request(app).get('/api/posts');
  assert.equal(feedResponse.status, 200);
  assert.equal(feedResponse.body.length, 1);
});

test('forum submissions stay pending until approved, then comments work', async () => {
  const app = createApp();

  const submitResponse = await request(app)
    .post('/api/forum/submissions')
    .set('x-user-id', 'alumni-1')
    .send({
      title: 'Need placement guidance',
      content: 'Anyone from 2021 batch working in product companies?',
    });

  assert.equal(submitResponse.status, 201);
  assert.equal(submitResponse.body.status, 'PENDING');

  const postId = submitResponse.body.id;

  const approveResponse = await request(app)
    .patch(`/api/admin/forum/${postId}/review`)
    .set('x-user-id', 'admin-1')
    .send({
      decision: 'APPROVED',
      reviewNotes: 'Useful topic for alumni.'
    });

  assert.equal(approveResponse.status, 200);
  assert.equal(approveResponse.body.status, 'APPROVED');

  const commentResponse = await request(app)
    .post(`/api/forum/posts/${postId}/comments`)
    .set('x-user-id', 'alumni-2')
    .send({ message: 'Yes, I can help.' });

  assert.equal(commentResponse.status, 201);
});

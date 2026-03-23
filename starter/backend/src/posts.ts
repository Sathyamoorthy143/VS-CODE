import crypto from 'crypto';
import { Request, Response, Router } from 'express';
import { AdminPost, Attachment } from './models';
import { attachments, posts } from './store';

const router = Router();

router.post('/admin/posts', (req: Request, res: Response) => {
  const { title, content, attachmentInputs = [] } = req.body;
  const authorUserId = req.header('x-user-id') || 'mock-admin-user';

  const post: AdminPost = {
    id: crypto.randomUUID(),
    authorUserId,
    title,
    content,
    status: 'PUBLISHED',
    publishedAt: new Date(),
    createdAt: new Date(),
  };

  posts.push(post);

  for (const file of attachmentInputs) {
    attachments.push({
      id: crypto.randomUUID(),
      postId: post.id,
      fileName: file.fileName,
      mimeType: file.mimeType,
      storageKey: file.storageKey,
      publicUrl: file.publicUrl,
      fileSizeBytes: file.fileSizeBytes,
    });
  }

  return res.status(201).json({
    ...post,
    attachments: attachments.filter((item) => item.postId === post.id),
  });
});

router.get('/posts', (_req: Request, res: Response) => {
  const publishedPosts = posts
    .filter((post) => post.status === 'PUBLISHED')
    .map((post) => ({
      ...post,
      attachments: attachments.filter((item) => item.postId === post.id),
    }));

  return res.json(publishedPosts);
});

export default router;

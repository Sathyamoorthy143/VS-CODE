import crypto from 'crypto';
import { Request, Response, Router } from 'express';
import { ForumComment, ForumPost } from './models';

const router = Router();
const forumPosts: ForumPost[] = [];
const comments: ForumComment[] = [];

router.post('/forum/submissions', (req: Request, res: Response) => {
  const { title, content } = req.body;
  const authorUserId = req.header('x-user-id') || 'mock-alumni-user';

  const post: ForumPost = {
    id: crypto.randomUUID(),
    authorUserId,
    title,
    content,
    status: 'PENDING',
    createdAt: new Date(),
  };

  forumPosts.push(post);
  return res.status(201).json(post);
});

router.get('/admin/forum/pending', (_req: Request, res: Response) => {
  return res.json(forumPosts.filter((post) => post.status === 'PENDING'));
});

router.patch('/admin/forum/:postId/review', (req: Request, res: Response) => {
  const { postId } = req.params;
  const { decision, reviewNotes } = req.body as { decision: 'APPROVED' | 'REJECTED'; reviewNotes?: string };
  const reviewerId = req.header('x-user-id') || 'mock-admin-user';

  const post = forumPosts.find((item) => item.id === postId);
  if (!post) {
    return res.status(404).json({ message: 'Forum post not found' });
  }

  post.status = decision;
  post.reviewedBy = reviewerId;
  post.reviewNotes = reviewNotes;

  return res.json(post);
});

router.get('/forum/posts', (_req: Request, res: Response) => {
  return res.json(forumPosts.filter((post) => post.status === 'APPROVED'));
});

router.post('/forum/posts/:postId/comments', (req: Request, res: Response) => {
  const { postId } = req.params;
  const { message } = req.body;
  const approvedPost = forumPosts.find((item) => item.id === postId && item.status === 'APPROVED');

  if (!approvedPost) {
    return res.status(404).json({ message: 'Approved forum post not found' });
  }

  const comment: ForumComment = {
    id: crypto.randomUUID(),
    forumPostId: postId,
    authorUserId: req.header('x-user-id') || 'mock-alumni-user',
    message,
    createdAt: new Date(),
  };

  comments.push(comment);

  // In production, also emit via WebSocket/Socket.IO here.
  return res.status(201).json(comment);
});

router.get('/forum/posts/:postId/comments', (req: Request, res: Response) => {
  const { postId } = req.params;
  return res.json(comments.filter((comment) => comment.forumPostId === postId));
});

export default router;

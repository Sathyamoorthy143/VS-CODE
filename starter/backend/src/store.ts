import { AdminPost, Attachment, ForumComment, ForumPost, User } from './models';

export const users: User[] = [];
export const posts: AdminPost[] = [];
export const attachments: Attachment[] = [];
export const forumPosts: ForumPost[] = [];
export const comments: ForumComment[] = [];

export function resetStore() {
  users.length = 0;
  posts.length = 0;
  attachments.length = 0;
  forumPosts.length = 0;
  comments.length = 0;
}

export type UserRole = 'ALUMNI' | 'ADMIN';
export type AlumniLoginType = 'REG_NO' | 'PHONE';
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ForumStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  role: UserRole;
  registrationNumber?: string | null;
  phoneNumber?: string | null;
  passwordHash: string;
  isActive: boolean;
}

export interface AlumniProfile {
  userId: string;
  firstName: string;
  lastName: string;
  studentName: string;
  batchYear: number;
  registrationNumber?: string | null;
  phoneNumber: string;
  isCurrentBatch: boolean;
  allowAccess: boolean;
}

export interface AdminPost {
  id: string;
  authorUserId: string;
  title: string;
  content: string;
  status: PostStatus;
  publishedAt?: Date;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  postId: string;
  fileName: string;
  mimeType: string;
  storageKey: string;
  publicUrl: string;
  fileSizeBytes: number;
}

export interface ForumPost {
  id: string;
  authorUserId: string;
  title: string;
  content: string;
  status: ForumStatus;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: Date;
}

export interface ForumComment {
  id: string;
  forumPostId: string;
  authorUserId: string;
  message: string;
  createdAt: Date;
}

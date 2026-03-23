import { Request, Response, Router } from 'express';

const router = Router();

const allowedMimeTypes = new Set([
  'audio/mpeg',
  'video/mp4',
  'image/jpeg',
  'image/png',
  'application/pdf',
]);

router.post('/uploads/presign', async (req: Request, res: Response) => {
  const { fileName, mimeType, sizeBytes } = req.body;

  if (!allowedMimeTypes.has(mimeType)) {
    return res.status(400).json({ message: 'Unsupported file type' });
  }

  if (sizeBytes > 25 * 1024 * 1024) {
    return res.status(400).json({ message: 'File too large' });
  }

  const storageKey = `${Date.now()}-${fileName}`;
  return res.json({
    uploadUrl: `https://storage.example.com/upload/${storageKey}`,
    storageKey,
    mimeType,
  });
});

export default router;

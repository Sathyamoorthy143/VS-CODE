import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, Router } from 'express';
import { AlumniLoginType, User } from './models';
import { users } from './store';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'replace-in-env';

function findAlumni(identifier: string, loginType: AlumniLoginType) {
  return users.find((user) =>
    user.role === 'ALUMNI' &&
    (loginType === 'REG_NO'
      ? user.registrationNumber === identifier
      : user.phoneNumber === identifier),
  );
}

router.post('/auth/signup', async (req: Request, res: Response) => {
  const { firstName, lastName, studentName, batchYear, phoneNumber, registrationNumber, dob } = req.body;

  const passwordHash = await bcrypt.hash(dob, 12);
  const user: User = {
    id: crypto.randomUUID(),
    role: 'ALUMNI',
    registrationNumber: registrationNumber || null,
    phoneNumber,
    passwordHash,
    isActive: true,
  };

  users.push(user);

  return res.status(201).json({
    message: 'Signup successful',
    user: {
      id: user.id,
      firstName,
      lastName,
      studentName,
      batchYear,
      phoneNumber,
      registrationNumber,
    },
  });
});

router.post('/auth/alumni/login', async (req: Request, res: Response) => {
  const { loginType, identifier, dob } = req.body as {
    loginType: AlumniLoginType;
    identifier: string;
    dob: string;
  };

  const user = findAlumni(identifier, loginType);
  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const passwordMatches = await bcrypt.compare(dob, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });

  return res.json({ accessToken, refreshToken, user: { id: user.id, role: user.role } });
});

router.post('/auth/admin/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const admin = users.find((user) => user.role === 'ADMIN' && user.phoneNumber === username);

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const accessToken = jwt.sign({ sub: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: '15m' });
  return res.json({ accessToken, user: { id: admin.id, role: admin.role } });
});

export default router;

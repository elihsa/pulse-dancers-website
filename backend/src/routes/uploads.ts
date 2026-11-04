import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/id-document', authenticate, upload.single('document'), async (req: any, res) => {
  try {
    res.json({ message: 'Upload successful', filename: req.file?.originalname });
  } catch (error) {
    res.status(400).json({ error: 'Upload failed' });
  }
});

export default router;
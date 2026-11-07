import express from 'express';
import { authenticate } from '../middleware/auth';
import { upload } from '../services/cloudinary';

const router = express.Router();

router.post('/id-document', authenticate, upload.single('document'), async (req: any, res) => {
  try {
    const file = req.file;
    if (!file || !file.path) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
      message: 'Upload successful', 
      url: file.path,
      publicId: file.filename 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(400).json({ error: 'Upload failed' });
  }
});

export default router;
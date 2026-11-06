import express from 'express';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/database';
import { upload } from '../services/cloudinary';
import { z } from 'zod';

const router = express.Router();

// Submit ID verification documents
router.post('/submit', authenticate, upload.fields([
  { name: 'id_front', maxCount: 1 },
  { name: 'id_back', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]), async (req: any, res) => {
  try {
    const userId = req.user.id;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files.id_front || !files.id_back || !files.selfie) {
      return res.status(400).json({ error: 'All three documents required: ID front, ID back, and selfie' });
    }

    const idFrontUrl = files.id_front[0].path;
    const idBackUrl = files.id_back[0].path;
    const selfieUrl = files.selfie[0].path;

    // Update user with verification documents
    const { data: user, error } = await supabase
      .from('users')
      .update({
        id_document_front_url: idFrontUrl,
        id_document_back_url: idBackUrl,
        id_selfie_url: selfieUrl,
        id_verification_status: 'pending',
        id_verification_submitted_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('id, email, full_name, id_verification_status')
      .single();

    if (error) throw error;

    // TODO: Trigger facial recognition check via third-party API
    // TODO: Notify admin team for manual review

    res.json({
      message: 'Verification documents submitted successfully. Review typically takes 24 hours.',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        id_verification_status: user.id_verification_status
      }
    });
  } catch (error: any) {
    console.error('Submit verification error:', error);
    res.status(400).json({ error: error.message || 'Failed to submit verification' });
  }
});

// Get current user's verification status
router.get('/status', authenticate, async (req: any, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, id_verification_status, id_verification_submitted_at, id_verification_reviewed_at, id_verification_notes')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    res.json(user);
  } catch (error: any) {
    console.error('Get verification status error:', error);
    res.status(400).json({ error: error.message || 'Failed to get verification status' });
  }
});

// Admin: List pending verifications
router.get('/admin/pending', authenticate, async (req: any, res) => {
  try {
    // Check if user is admin (you'd add an admin role or check)
    // For now, allow any authenticated user to see (in production, restrict to admins)
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, id_verification_status, id_verification_submitted_at, id_document_front_url, id_document_back_url, id_selfie_url')
      .eq('id_verification_status', 'pending')
      .order('id_verification_submitted_at', { ascending: true });

    if (error) throw error;

    res.json(users);
  } catch (error: any) {
    console.error('Admin pending verifications error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch pending verifications' });
  }
});

// Admin: Approve/reject verification
const reviewSchema = z.object({
  action: z.enum(['approve', 'reject']),
  notes: z.string().optional()
});

router.patch('/admin/:id/review', authenticate, async (req: any, res) => {
  try {
    const { action, notes } = reviewSchema.parse(req.body);
    const targetUserId = req.params.id;

    const newStatus = action === 'approve' ? 'verified' : 'rejected';

    const { data: user, error } = await supabase
      .from('users')
      .update({
        id_verification_status: newStatus,
        id_verification_reviewed_at: new Date().toISOString(),
        id_verification_notes: notes || null,
        id_verified: action === 'approve' // Also set legacy id_verified for backward compatibility
      })
      .eq('id', targetUserId)
      .select('id, email, full_name, id_verification_status')
      .single();

    if (error) throw error;

    // TODO: Send email notification to user about verification result

    res.json({
      message: `Verification ${action}d successfully`,
      user
    });
  } catch (error: any) {
    console.error('Review verification error:', error);
    res.status(400).json({ error: error.message || 'Failed to review verification' });
  }
});

export default router;
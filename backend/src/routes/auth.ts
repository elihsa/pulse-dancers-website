import express from 'express';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { sendPasswordResetEmail } from '../services/email';

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  full_name: z.string().min(2),
  role: z.enum(['host', 'renter', 'both']).default('renter'),
});

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    
    // Check if email exists
    const { data: existing, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw checkError;
    }
    
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: data.email,
        phone: data.phone,
        password_hash: passwordHash,
        full_name: data.full_name,
        role: data.role,
      })
      .select('id, email, phone, full_name, role')
      .single();

    if (error) throw error;

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(201).json({ message: 'Registration successful', user, token });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, phone, full_name, role, password_hash')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const { password_hash, ...userWithoutPassword } = user;

    res.json({ message: 'Login successful', user: userWithoutPassword, token });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message || 'Login failed' });
  }
});

router.get('/profile', authenticate, async (req: any, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, phone, full_name, role')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(user);
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch profile' });
  }
});

router.delete('/account', authenticate, async (req: any, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Account deleted successfully' });
  } catch (error: any) {
    console.error('Delete account error:', error);
    res.status(400).json({ error: error.message || 'Failed to delete account' });
  }
});

// Forgot password - request reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('email', email)
      .single();

    // Always return success to prevent email enumeration
    if (error || !user) {
      return res.json({ message: 'If an account exists with that email, a password reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    // Store reset token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_reset_token: resetTokenHash,
        password_reset_expires: resetTokenExpiry,
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Send reset email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, user.full_name, resetUrl);

    res.json({ message: 'If an account exists with that email, a password reset link has been sent' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(400).json({ error: error.message || 'Failed to process request' });
  }
});

// Reset password - verify token and set new password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email')
      .eq('password_reset_token', tokenHash)
      .gt('password_reset_expires', new Date().toISOString())
      .single();

    if (error || !user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: passwordHash,
        password_reset_token: null,
        password_reset_expires: null,
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(400).json({ error: error.message || 'Failed to reset password' });
  }
});

export default router;
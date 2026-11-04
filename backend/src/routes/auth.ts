import express from 'express';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

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

export default router;
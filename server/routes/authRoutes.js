import express from 'express';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import path from 'path';

const router = express.Router();

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'mail.gmx.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    to: options.to,
    from: process.env.EMAIL_ADDRESS,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
}

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();
    req.session.userId = user._id;
    

    // Call sendEmail function
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Our Application',
      text: `Dear ${username},\n\nWelcome to my Exam Project application. I am glad to have you onboard. Respectfully - 
      N. SKibsted.\n`,
    });

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.comparePassword(password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

      req.session.userId = user._id;
      res.status(200).json({ message: 'User logged in successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/forgotPassword', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    // Call sendEmail function
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
              Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
              http://localhost:${process.env.PORT}/auth/resetPassword/${token}\n\n
              If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    });

    res.status(200).json({ success: true, message: 'recovery email sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/resetPassword/:token', async (req, res) => {
  try {
    const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
    }
    res.sendFile(path.resolve('../client/public/resetPassword.html'));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/resetPassword/:token', async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(404).json({ error: 'Password reset token is invalid or has expired.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Mark the password as modified before saving
    user.markModified('password');
    
    await user.save();
    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to destroy session' });
      } else {
        res.clearCookie('user_sid');
        res.json({ message: 'Logged out successfully' });
      }
    });
  } else {
    res.status(400).json({ error: 'User is not logged in' });
  }
});

export default router;

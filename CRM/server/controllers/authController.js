import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { sendOTP } from '../utils/mailer.js';

/**
 * Step 1: Request an OTP code.
 * Generates a 6-digit code and emails it to the authorized admin.
 */
export const requestOTP = async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();

  try {
    console.log('🔍 DB: Checking admin existence...');
    const admin = await Admin.findOne({ where: { email } });
    console.log('✅ DB: Admin check complete.');

    if (!admin) {
      console.log('⚠️ AUTH: Email not found in Admin table.');
      return res.status(200).json({ message: 'If you are authorized, a code has been sent.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    console.log('💾 DB: Saving OTP to TiDB Cloud...');
    await Admin.update(
      { otp, otpExpiry },
      { where: { email } }
    );
    console.log('✅ DB: OTP saved successfully.');

    console.log('📧 MAIL: Triggering Resend API...');
    await sendOTP(email, otp);
    console.log('✅ MAIL: Resend API responded.');

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP Request Error:', error);
    res.status(500).json({ message: 'Error processing login request' });
  }
};

/**
 * Step 2: Verify the OTP and issue a JWT.
 */
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log('Attempting OTP verification for:', { email, otp }); // Log received data

  try {
    const admin = await Admin.findOne({ where: { email, otp } });
    console.log('Admin found:', admin ? 'Yes' : 'No'); // Log if admin was found

    // Check if OTP matches and hasn't expired
    if (!admin) {
      console.log('Verification failed: No admin found with matching email and OTP.');
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }
    
    if (new Date() > new Date(admin.otpExpiry)) {
      console.log('Verification failed: OTP has expired. Current time:', new Date(), 'Expiry:', admin.otpExpiry);
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    // 🔑 Create Token with ID (Matches your middleware)
    const token = jwt.sign(
      { id: admin.id, email: admin.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Clear OTP from DB
    await admin.update({ otp: null, otpExpiry: null });

    res.status(200).json({ token, admin: { email: admin.email, name: admin.name } });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ message: "Verification failed" });
  }
};

/**
 * @desc    Get current admin profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    // req.user is populated by the authMiddleware
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
      }
    });
  } catch (error) {
    console.error('Profile Fetch Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
};

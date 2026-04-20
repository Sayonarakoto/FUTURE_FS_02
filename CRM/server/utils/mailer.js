import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a notification to the admin when a new lead is captured.
 */
export const sendLeadNotification = async (leadData) => {
  try {
    await resend.emails.send({
      from: 'CRM Alerts <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      subject: `New Lead: ${leadData.name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h3>New Lead Received</h3>
          <p><strong>Name:</strong> ${leadData.name}</p>
          <p><strong>Email:</strong> ${leadData.email}</p>
          <p><strong>Type:</strong> ${leadData.inquiryType || 'General'}</p>
          <p><strong>Message:</strong> ${leadData.message}</p>
          <hr />
          <p>View this in your Nexus Dashboard.</p>
        </div>
      `,
    });
    console.log("📧 Notification email sent!");
  } catch (error) {
    console.error("❌ Email failed to send", error);
  }
};

/**
 * Sends a Magic Link to the admin for passwordless authentication.
 */
export const sendMagicLinkEmail = async (email, link) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CRM Auth <onboarding@resend.dev>',
      to: email,
      subject: '🔐 Your Secure Login Link',
      html: `
        <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 450px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 40px; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #111827; margin-bottom: 24px;">Nexus CRM</h2>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 32px;">Click the button below to sign in to your dashboard. This link is valid for 10 minutes and can only be used once.</p>
          <a href="${link}" style="display: block; width: 100%; text-align: center; background-color: #2563eb; color: #ffffff; padding: 14px 0; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Sign in to Dashboard
          </a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 32px; text-align: center;">If you didn't request this email, you can safely ignore it.</p>
        </div>
      `,
    });

    if (error) throw error;
    console.log("📧 Magic Link sent successfully via Resend!");
  } catch (error) {
    console.error("❌ Magic Link failed to send", error);
    throw error;
  }
};

/**
 * Sends a one-time password (OTP) to the admin.
 */
export const sendOTP = async (email, otp) => {
  try {
    console.log(`📡 RESEND: Sending to ${email} using onboarding@resend.dev...`);
    const { data, error } = await resend.emails.send({
      from: 'CRM Auth <onboarding@resend.dev>',
      to: process.env.RESEND_TEST_EMAIL || email, // Use test email if defined, otherwise original email
      subject: '🔐 Your Secure Login Code',
      html: `
        <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 450px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 40px; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #111827; margin-bottom: 24px;">Nexus CRM</h2>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px;">Your one-time password (OTP) for secure login is:</p>
          <h1 style="letter-spacing: 5px; color: #2563eb; text-align: center; margin-bottom: 24px;">${otp}</h1>
          <p style="color: #666666; font-size: 14px; text-align: center;">This code expires in 10 minutes.</p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 32px; text-align: center;">If you didn't request this code, you can safely ignore it.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ RESEND ERROR:", error);
      throw error;
    }
    console.log("✅ RESEND SUCCESS:", data?.id);
  } catch (error) {
    console.error("❌ OTP failed to send", error);
    throw error;
  }
};

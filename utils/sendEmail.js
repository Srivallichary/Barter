// Send email using Resend as primary provider, with safe fallbacks for local/dev
const { Resend } = require('resend');
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  const resendKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.EMAIL_FROM || process.env.RESEND_FROM || `no-reply@${process.env.EMAIL_DOMAIN || 'example.com'}`;

  // Prefer Resend API when configured
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const resp = await resend.emails.send({
        from: fromAddress,
        to,
        subject,
        html: html || `<pre>${text || ''}</pre>`,
      });

      // Log delivery metadata (non-sensitive)
      console.log('Resend: email queued/sent', { id: resp.id, to, from: fromAddress });
      return resp;
    } catch (err) {
      // Log error without leaking secrets
      try {
        console.error('Resend send error:', err && err.message ? err.message : err);
      } catch (logErr) {
        console.error('Resend send error (unserializable):', String(err));
      }
      // Throw a generic error up the stack; controllers should not leak internals
      const e = new Error('Failed to send email via Resend');
      e.cause = err;
      throw e;
    }
  }

  // If Resend not configured, try SMTP if configured (explicit credentials), else console fallback
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
  const service = process.env.EMAIL_SERVICE;

  if (user && pass && (host || service)) {
    const transportOptions = { auth: { user, pass } };
    if (service) transportOptions.service = service;
    else {
      transportOptions.host = host; transportOptions.port = port; transportOptions.secure = port === 465;
    }

    const transporter = nodemailer.createTransport(transportOptions);
    try {
      const info = await transporter.sendMail({ from: fromAddress, to, subject, text, html });
      console.log('SMTP: email sent', { messageId: info.messageId, to, from: fromAddress });
      return info;
    } catch (err) {
      console.error('SMTP send error:', err && err.message ? err.message : err);
      // Fall through to console fallback
    }
  }

  // Console fallback for development (no external provider configured)
  console.warn('No email provider configured. Falling back to console output for OTPs.');
  console.log('\n========================================================');
  console.log(`Email to: ${to}`);
  console.log(`From: ${fromAddress}`);
  console.log(`Subject: ${subject}`);
  if (text) console.log('Text body:\n', text);
  if (html) console.log('HTML body:\n', html);
  console.log('========================================================\n');
  return { fallback: true };
};

module.exports = sendEmail;
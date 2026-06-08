import nodemailer from 'nodemailer';

import { env } from './env.js';

// Create a nodemailer transporter using env SMTP details
const transporter = nodemailer.createTransport({
  host: env.email.host,
  port: env.email.port,
  secure: env.email.port === 465, // true for 465, false for other ports
  auth: {
    user: env.email.user,
    pass: env.email.pass,
  },
});

// Verify SMTP connection config on load (development environment warning only)
if (env.server.isDev) {
  transporter.verify((error) => {
    if (error) {
      console.warn('⚠️ SMTP Transporter Warning:', error.message);
    } else {
      console.log('📨 SMTP Mailer config verified and ready.');
    }
  });
}

/**
 * Sends an email using the pre-configured transporter.
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML content
 * @returns {Promise<Object>} Sent mail info
 */
export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: env.email.from || '"CampusCore" <no-reply@campuscore.com>',
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

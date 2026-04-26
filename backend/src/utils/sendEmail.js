import nodemailer from 'nodemailer';
import { logger } from '../config/logger.js';

/**
 * Utility to send emails
 * @param {Object} options 
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email HTML body
 */
export const sendEmail = async (options) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Define the email options
        const mailOptions = {
            from: `Myntra Clone <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully to ${options.email}`);
    } catch (error) {
        logger.error('Error sending email: ', error);
        // We don't throw here to avoid crashing the main flow (e.g. user registration)
        // if the email service is down or misconfigured.
    }
};

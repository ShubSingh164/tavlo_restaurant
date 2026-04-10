/**
 * Tavlo — Notification Service
 *
 * Direct port of tavlo-nest's notification/notification.service.ts
 *
 * Sends OTP emails via Gmail SMTP (nodemailer).
 * Uses the same HTML email template and branded design as tavlo-nest.
 *
 * Falls back to console logging if Gmail credentials are not configured.
 *
 * @module services/notification
 */

import nodemailer from 'nodemailer';

// ─── SMTP Transporter (lazy-initialized singleton) ───────────────────────────

let transporter: nodemailer.Transporter | null = null;
let isConfigured = false;

function getTransporter(): nodemailer.Transporter | null {
    if (transporter) return transporter;

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (gmailUser && gmailAppPassword) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: gmailAppPassword,
            },
        });
        isConfigured = true;
        console.log('✅ Gmail SMTP transporter configured');
    } else {
        console.warn(
            '⚠️ GMAIL_USER or GMAIL_APP_PASSWORD not set — ' +
            'falling back to mock emails (check terminal for OTPs)'
        );
    }

    return transporter;
}

// ─── Send Email ──────────────────────────────────────────────────────────────
// Same branded HTML template as tavlo-nest

export async function sendEmail(
    to: string,
    subject: string,
    content: string
): Promise<void> {
    // Always log for debugging (same as NestJS)
    console.log(`[EMAIL] To: ${to}, Subject: ${subject}, Content: ${content}`);

    const transport = getTransporter();

    if (transport && isConfigured) {
        try {
            const gmailUser = process.env.GMAIL_USER;
            await transport.sendMail({
                from: `"Tavlo Restaurant" <${gmailUser}>`,
                to,
                subject,
                html: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff; border-radius: 12px; border: 1px solid #eee;">
                        <div style="text-align: center; margin-bottom: 24px;">
                            <h2 style="color: #e86c25; margin: 0; font-size: 28px;">Tavlo</h2>
                            <p style="color: #888; font-size: 13px; margin-top: 4px;">Restaurant ERP Platform</p>
                        </div>
                        <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 16px 0;" />
                        <div style="text-align: center; padding: 20px 0;">
                            <p style="color: #333; font-size: 16px; margin-bottom: 8px;">${subject}</p>
                            <div style="background: #f8f4f0; border-radius: 8px; padding: 20px; margin: 16px 0;">
                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #e86c25;">${content.replace(/.*?(\d{6}).*/, '$1')}</span>
                            </div>
                            <p style="color: #888; font-size: 13px;">This code expires in 5 minutes. Do not share it with anyone.</p>
                        </div>
                        <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 16px 0;" />
                        <p style="color: #aaa; font-size: 11px; text-align: center;">If you didn't request this code, please ignore this email.</p>
                    </div>
                `,
            });
            console.log(`✅ Email sent to ${to}`);
        } catch (error) {
            console.error(`❌ Failed to send email to ${to}: ${(error as Error).message}`);
            // Don't throw — the OTP is still logged above for dev fallback
        }
    }
}

// ─── Send SMS (Mock) ─────────────────────────────────────────────────────────
// Same as tavlo-nest — just logs

export async function sendSms(to: string, content: string): Promise<void> {
    console.log(`[MOCK SMS] To: ${to}, Content: ${content}`);
}

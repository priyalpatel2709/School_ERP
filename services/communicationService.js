const nodemailer = require("nodemailer");
const { logger } = require("../helper/logger");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

/**
 * @returns {{ success: boolean, messageId?: string, simulated?: boolean }}
 */
async function sendEmail({ to, subject, text, html }) {
  const t = getTransporter();
  if (!t) {
    logger.info(`[email:not-configured] to=${to} subject=${subject} body=${text || html || ""}`);
    return { success: true, simulated: true };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const info = await t.sendMail({
    from,
    to,
    subject,
    text: text || "",
    html: html || text || "",
  });
  return { success: true, messageId: info.messageId };
}

/**
 * Placeholder SMS — log only unless SDK wired.
 */
async function sendSms({ to, body }) {
  logger.info(`[sms:stub] to=${to} msg=${body}`);
  return { success: true, simulated: true };
}

module.exports = {
  sendEmail,
  sendSms,
};

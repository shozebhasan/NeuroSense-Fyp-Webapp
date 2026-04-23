import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your Neuro Sense password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 0; }
            .container { max-width: 500px; margin: 40px auto; padding: 40px; background: #111; border: 1px solid #222; border-radius: 12px; }
            .logo { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.5px; margin-bottom: 32px; }
            .logo span { color: #888; }
            h1 { font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #fff; }
            p { color: #999; font-size: 14px; line-height: 1.6; margin: 0 0 24px; }
            .btn { display: inline-block; padding: 12px 28px; background: #fff; color: #000; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
            .footer { margin-top: 32px; font-size: 12px; color: #555; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Neuro<span>Sense</span></div>
            <h1>Reset your password</h1>
            <p>We received a request to reset your password. Click the button below to create a new one. This link expires in 1 hour.</p>
            <a href="${resetUrl}" class="btn">Reset Password</a>
            <div class="footer">
              <p>If you didn't request this, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
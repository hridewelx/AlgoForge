import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL;

/**
 * Sends a password reset email with a secure link
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Secure reset token
 * @param {string} username - User's username for personalization
 * @returns {Promise<object>} Resend API response
 */
export const sendPasswordResetEmail = async (email, resetToken, username) => {
  const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">AlgoForge</h1>
                  <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Master algorithms. Build your future.</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 40px 30px 40px;">
                  <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
                  <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                    Hi <strong>${username || "there"}</strong>,
                  </p>
                  <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                    We received a request to reset your password for your AlgoForge account. Click the button below to create a new password:
                  </p>
                  
                  <!-- CTA Button -->
                  <table role="presentation" style="margin: 30px 0;">
                    <tr>
                      <td style="border-radius: 8px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); text-align: center;">
                        <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
                          Reset My Password
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 20px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="margin: 10px 0 20px 0; padding: 12px; background-color: #f1f5f9; border-radius: 6px; color: #475569; font-size: 13px; word-break: break-all;">
                    ${resetLink}
                  </p>
                  
                  <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 10px 0; color: #ef4444; font-size: 14px; font-weight: 600;">
                      ⚠️ Important Security Information
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 14px; line-height: 1.6;">
                      <li>This link will expire in <strong>1 hour</strong></li>
                      <li>If you didn't request this, please ignore this email</li>
                      <li>Never share this link with anyone</li>
                    </ul>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                    © 2025 AlgoForge. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                    You're receiving this email because a password reset was requested for your account.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: "AlgoForge <onboarding@resend.dev>",
      to: email,
      subject: "Reset Your AlgoForge Password",
      html: htmlContent,
    });

    console.log("Password reset email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

/**
 * Generates a random 6-digit verification code
 * @returns {string} 6-digit code
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends a verification code email for signup
 * @param {string} email - Recipient email address
 * @param {string} code - 6-digit verification code
 * @param {string} firstName - User's first name for personalization
 * @returns {Promise<object>} Resend API response
 */
export const sendVerificationEmail = async (email, code, firstName) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">AlgoForge</h1>
                  <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Master algorithms. Build your future.</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 40px 30px 40px;">
                  <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">Verify Your Email</h2>
                  <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                    Hi <strong>${firstName}</strong>,
                  </p>
                  <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                    Welcome to AlgoForge! To complete your registration, please use the verification code below:
                  </p>
                  
                  <!-- Verification Code Box -->
                  <div style="margin: 30px 0; text-align: center;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%); padding: 20px 40px; border-radius: 12px; border: 2px dashed #14b8a6;">
                      <p style="margin: 0 0 8px 0; color: #0f766e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                      <p style="margin: 0; color: #0d9488; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${code}
                      </p>
                    </div>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6; text-align: center;">
                    Enter this code in the signup page to verify your email address.
                  </p>
                  
                  <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 10px 0; color: #0891b2; font-size: 14px; font-weight: 600;">
                      ℹ️ Important Information
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 14px; line-height: 1.6;">
                      <li>This code will expire in <strong>10 minutes</strong></li>
                      <li>If you didn't request this, you can safely ignore this email</li>
                      <li>Never share this code with anyone</li>
                    </ul>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                    © 2025 AlgoForge. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                    You're receiving this email because someone started the signup process with this email address.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: "AlgoForge <onboarding@resend.dev>",
      to: email,
      subject: "Verify Your AlgoForge Email - Code Inside",
      html: htmlContent,
    });

    console.log("Verification email sent successfully:", response);
    console.log("\n===========================================");
    console.log("🔢 VERIFICATION CODE (for development):");
    console.log(code);
    console.log("===========================================\n");
    return response;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

/**
 * Sends a welcome email after successful registration
 * @param {string} email - Recipient email address
 * @param {string} firstName - User's first name for personalization
 * @param {string} username - User's username
 * @returns {Promise<object>} Resend API response
 */
export const sendWelcomeEmail = async (email, firstName, username) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to AlgoForge</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Welcome to AlgoForge!</h1>
                  <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Master algorithms. Build your future.</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 40px 30px 40px;">
                  <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">Your Account is Ready! 🎉</h2>
                  <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                    Hi <strong>${firstName}</strong>,
                  </p>
                  <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                    Congratulations! Your AlgoForge account has been successfully created. You're now part of a community of developers passionate about algorithms and competitive programming.
                  </p>
                  
                  <!-- Account Details Box -->
                  <div style="margin: 30px 0; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #10b981;">
                    <p style="margin: 0 0 10px 0; color: #065f46; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Account Details</p>
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 5px 0; color: #047857; font-size: 14px; font-weight: 600;">Email:</td>
                        <td style="padding: 5px 0; color: #065f46; font-size: 14px;">${email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #047857; font-size: 14px; font-weight: 600;">Username:</td>
                        <td style="padding: 5px 0; color: #065f46; font-size: 14px;">@${username}</td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- CTA Button -->
                  <table role="presentation" style="margin: 30px 0;">
                    <tr>
                      <td style="border-radius: 8px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); text-align: center;">
                        <a href="${FRONTEND_URL}/login" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
                          Start Solving Problems
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600;">What's Next?</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 14px; line-height: 1.8;">
                      <li>Explore our collection of 500+ coding problems</li>
                      <li>Test your code in real-time with 10+ programming languages</li>
                      <li>Read detailed editorials and watch video solutions</li>
                      <li>Track your progress with our analytics dashboard</li>
                      <li>Get AI-powered hints when you're stuck</li>
                    </ul>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                    © 2025 AlgoForge. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                    Happy coding! If you have any questions, feel free to reach out to our support team.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: "AlgoForge <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to AlgoForge! Your Account is Ready 🎉",
      html: htmlContent,
    });

    console.log("Welcome email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return null;
  }
};

export default {
  sendPasswordResetEmail,
  sendVerificationEmail,
  generateVerificationCode,
  sendWelcomeEmail,
};

import nodemailer from 'nodemailer';

export async function sendOrderEmail(order: any, artwork: any) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  const orderIdShort = order.id.substring(0, 8).toUpperCase();
  const subject = `Raaga Artspace - Order Confirmed #${orderIdShort}`;

  const htmlContent = `
    <div style="font-family: 'Playfair Display', Georgia, serif; background-color: #F8F4EF; padding: 40px; color: #3E3E3E; max-width: 600px; margin: 0 auto; border-radius: 20px; border: 1px solid #EAE3DB;">
      <h2 style="text-align: center; letter-spacing: 2px; color: #3E3E3E; border-bottom: 1px solid #EAE3DB; padding-bottom: 20px; margin-bottom: 30px;">
        RAAGA Artspace
      </h2>
      <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${order.customerName}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; color: #555;">
        Thank you for booking a visual meditation canvas from Raaga Artspace. We are happy to confirm your order details below:
      </p>

      <div style="background-color: #FFFFFF; padding: 25px; border-radius: 15px; border: 1px solid #EAE3DB; margin: 30px 0;">
        <h3 style="margin-top: 0; color: #3E3E3E; border-bottom: 1px dashed #EAE3DB; padding-bottom: 10px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
          Order Details (#${orderIdShort})
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #777;">Artwork:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #3E3E3E;">${artwork.title}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #777;">Dimensions:</td>
            <td style="padding: 8px 0; text-align: right; color: #3E3E3E;">${artwork.dimensions}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #777;">Quantity:</td>
            <td style="padding: 8px 0; text-align: right; color: #3E3E3E;">${order.quantity}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #777;">Price:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #A3B18A; font-size: 16px;">₹${order.amount.toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #F4EFEB; padding: 20px; border-radius: 12px; margin-bottom: 30px; font-size: 13px; line-height: 1.6;">
        <strong style="color: #3E3E3E; display: block; margin-bottom: 6px;">Shipping Location:</strong>
        ${order.address}<br />
        <strong style="color: #3E3E3E; display: block; margin-top: 10px; margin-bottom: 6px;">Contact Phone:</strong>
        ${order.phone}
      </div>

      <p style="font-size: 12px; text-align: center; color: #888; margin-top: 40px; border-top: 1px solid #EAE3DB; padding-top: 20px;">
        Track your shipment anytime at: <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders/${order.id}" style="color: #A3B18A; text-decoration: none; font-weight: bold;">Fulfillment Timeline</a><br />
        © ${new Date().getFullYear()} Raaga Artspace. Art that calms the mind and soothes the soul.
      </p>
    </div>
  `;

  if (!gmailUser || !gmailPass) {
    console.log(`[Gmail Mock] Email credentials not set in .env.`);
    console.log(`[Gmail Mock] Sending order receipt email to Customer: ${order.email}`);
    console.log(`[Gmail Mock] Copying Admin notification to: admin@raagaartspace.com`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    // Send to Customer
    await transporter.sendMail({
      from: `"Raaga Artspace" <${gmailUser}>`,
      to: order.email,
      subject,
      html: htmlContent,
    });

    // Send copy to Admin
    await transporter.sendMail({
      from: `"Raaga Artspace" <${gmailUser}>`,
      to: gmailUser, // Send copy to self/admin email
      subject: `[New Booking Alert] Order Confirmed #${orderIdShort}`,
      html: htmlContent.replace('Dear <strong>', '<strong>[ADMIN NOTIFICATION]</strong><br />New booking received from <strong>'),
    });

    console.log(`[Gmail SMTP] Booking confirmation emails successfully dispatched.`);
  } catch (error) {
    console.error('[Gmail SMTP Error] Failed to send email via Nodemailer:', error);
  }
}
export async function sendPasswordResetEmail(email: string, token: string) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/reset-password?token=${encodeURIComponent(token)}`;
  const subject = 'Raaga Artspace - Admin Password Reset';
  const htmlContent = `
    <div style="font-family: 'Playfair Display', Georgia, serif; background-color: #F8F4EF; padding: 40px; color: #3E3E3E; max-width: 600px; margin: 0 auto; border-radius: 20px; border: 1px solid #EAE3DB;">
      <h2 style="text-align: center; letter-spacing: 2px; color: #3E3E3E; border-bottom: 1px solid #EAE3DB; padding-bottom: 20px; margin-bottom: 30px;">Password Reset Request</h2>
      <p style="font-size: 16px; line-height: 1.6;">A password reset has been requested for your admin account.</p>
      <p style="font-size: 14px; line-height: 1.6;">Click the button below to set a new password. This link will expire in 24 hours.</p>
      <a href="${resetLink}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #A3B18A; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
      <p style="font-size: 12px; color: #888; margin-top: 30px;">If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  if (!gmailUser || !gmailPass) {
    console.log('[Gmail Mock] Email credentials not set.');
    console.log(`[Gmail Mock] Would send password reset email to ${email} with link ${resetLink}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    });
    await transporter.sendMail({
      from: `"Raaga Artspace" <${gmailUser}>`,
      to: email,
      subject,
      html: htmlContent,
    });
    console.log('[Gmail SMTP] Password reset email sent to', email);
  } catch (error) {
    console.error('[Gmail SMTP Error] Failed to send password reset email:', error);
  }
}



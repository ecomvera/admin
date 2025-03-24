import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({
      ok: false,
      error: "Email is required",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal that the user doesn't exist for security reasons
    return NextResponse.json({
      ok: true,
      message: "If your email is registered, you will receive a password reset link",
    });
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Save the reset token to the database
  await prisma.passwordReset.upsert({
    where: { email },
    update: { token: resetToken, expireAt: resetTokenExpiry },
    create: { email, token: resetToken, expireAt: resetTokenExpiry },
  });

  // Create reset URL
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${email}`;

  // Send email
  await sendEmail({
    to: email,
    subject: "Password Reset Request",
    html: `
      <div>
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });

  return NextResponse.json({
    ok: true,
    message: "Password reset link sent to your email",
  });
}

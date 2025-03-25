export const createEmailTemplate = (application: { fullName: string; email: string; phone: string; jobTitle: string }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>New Job Application</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background-color: #652d19; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0;">New Job Application</h1>
    </div>

    <!-- Content Card -->
    <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h2 style="color: #1f2937; margin-top: 0;">Application Details</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Name:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${application.fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Email:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${application.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Phone:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${application.phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #4b5563;">Position:</td>
          <td style="padding: 8px 0; color: #1f2937;">${application.jobTitle}</td>
        </tr>
      </table>

      <div style="margin-top: 25px; padding: 20px; background-color: #f8fafc; border-radius: 6px;">
        <h3 style="margin: 0 0 15px 0; color: #1f2937;">📎 Attachment</h3>
        <p style="margin: 0; color: #4b5563;">Resume attached to this email</p>
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <a href="mailto:${
          application.email
        }" style="display: inline-block; background-color: #3b9d50; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Reply to Applicant</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 0.875rem;">
      <p style="margin: 0;">Best regards,<br>Silkyester</p>
      <p style="margin: 15px 0 0 0;">© ${new Date().getFullYear()} Silkyester. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

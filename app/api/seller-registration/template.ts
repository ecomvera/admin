export const createSellerEmailTemplate = (data: {
  fullName: string;
  email: string;
  phone: string;
  storeName: string;
  businessAddress: string;
  businessType: string;
  productCategories: string[];
  otherCategory?: string;
  gstNumber: string;
  businessDocument?: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>New Seller Registration - Silkyester</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="background-color: #652d19; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">New Seller Registration Received</h1>
      </div>

      <!-- Content -->
      <div style="padding: 32px;">
      <!-- Seller Info -->
      <div style="margin-bottom: 32px;">
        <h2 style="color: #652d19; font-size: 18px; margin: 0 0 16px 0;">Seller Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; width: 120px; color: #64748b;">Name:</td>
            <td style="padding: 8px 0; color: #1e293b;">${data.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Email:</td>
            <td style="padding: 8px 0; color: #1e293b;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Phone:</td>
            <td style="padding: 8px 0; color: #1e293b;">${data.phone}</td>
          </tr>
        </table>
      </div>

      <!-- Business Info -->
      <div style="margin-bottom: 32px;">
        <h2 style="color: #652d19; font-size: 18px; margin: 0 0 16px 0;">Business Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; width: 140px; color: #64748b;">Store Name:</td>
            <td style="padding: 8px 0; color: #1e293b;">${data.storeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Address:</td>
            <td style="padding: 8px 0; color: #1e293b;">${data.businessAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Business Type:</td>
            <td style="padding: 8px 0; color: #1e293b;">${data.businessType}</td>
          </tr>
        </table>
      </div>

      <!-- Product Categories -->
      <div style="margin-bottom: 32px;">
        <h2 style="color: #652d19; font-size: 18px; margin: 0 0 16px 0;">Product Categories</h2>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${data.productCategories
            .map(
              (category) => `
            <div style="background-color: #e2e8f0; color: #1e293b; padding: 4px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px;">
              ${category.replace(/([A-Z])/g, " $1").trim()}
            </div>
          `
            )
            .join("")}
          ${
            data.otherCategory
              ? `
            <div style="background-color: #e2e8f0; color: #1e293b; padding: 4px 12px; border-radius: 20px; font-size: 14px;">
              ${data.otherCategory}
            </div>
          `
              : ""
          }
        </div>
      </div>

      <!-- GST & Documents -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; width: 140px; color: #64748b;">GST Number:</td>
            <td style="padding: 8px 0; color: #1e293b;">${data.gstNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Documents:</td>
            <td style="padding: 8px 0; color: #1e293b;">
              ${data.businessDocument ? "Attached to this email" : "No documents uploaded"}
            </td>
          </tr>
        </table>
      </div>

      <!-- Action Button -->
      <!-- <div style="margin-top: 32px; text-align: center;">
        <a href="[Your-Dashboard-URL]" 
           style="display: inline-block; background-color: #3b9d50; color: white; 
                  padding: 12px 24px; border-radius: 6px; text-decoration: none; 
                  font-weight: bold; font-size: 14px;">
          View Application
        </a>
      </div> -->
    </div>

    <!-- Footer -->
    <div style="padding: 24px; background-color: #f1f5f9; border-radius: 0 0 8px 8px; 
                text-align: center; font-size: 12px; color: #64748b;">
      <p style="margin: 0;">Silkyester Marketplace<br>
        Gayatri Nagar, Linepar, Moradabad, Uttar Pradesh 244001<br>
        © ${new Date().getFullYear()} Silkyester. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

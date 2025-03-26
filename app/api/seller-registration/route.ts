import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createSellerEmailTemplate } from "./template";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      storeName: formData.get("storeName") as string,
      businessAddress: formData.get("businessAddress") as string,
      businessType: formData.get("businessType") as string,
      productCategories: JSON.parse(formData.get("productCategories") as string),
      gstNumber: formData.get("gstNumber") as string,
      otherCategory: (formData.get("otherCategory") as string) || undefined,
      businessDocument: formData.get("businessDocument") as File | null,
    };

    console.log(data);

    // // Save to database
    // const seller = await prisma.seller.create({
    //   data: {
    //     ...data,
    //     businessDocument: data.businessDocument ? await uploadToCloudinary(data.businessDocument) : null,
    //   },
    // });

    // Send email
    const mailOptions = {
      to: process.env.APPLICATION_RECEIVER_EMAIL as string,
      subject: `New Seller Application: ${data.fullName}`,
      html: createSellerEmailTemplate({ ...data, businessDocument: data.businessDocument?.name }),
      attachments: data.businessDocument
        ? [
            {
              filename: data.businessDocument.name,
              content: Buffer.from(await data.businessDocument.arrayBuffer()),
            },
          ]
        : [],
    };

    const result = await sendEmail(mailOptions);

    if (!result.success) {
      console.error("Error sending email:", result.error);
      return NextResponse.json({
        ok: false,
        message: "Failed to submit application",
        error: result.error,
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Application submitted successfully",
    });
  } catch (error: any) {
    console.error("Error submitting application:", error);
    return NextResponse.json({
      ok: false,
      message: "Failed to submit application",
      error: error.message,
    });
  }
}

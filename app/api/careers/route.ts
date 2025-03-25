import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { createEmailTemplate } from "./template";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    // Extract form data
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const jobTitle = formData.get("job_title") as string;
    const resume = formData.get("resume") as File;

    // // Save to database
    // const application = await prisma.jobApplication.create({
    //   data: {
    //     fullName,
    //     email,
    //     phone,
    //     jobTitle,
    //     resumeUrl: "email-attachment", // Or modify your schema
    //   },
    // });

    // Send email
    const mailOptions = {
      to: process.env.JOB_APPLICATION_RECEIVER_EMAIL as string,
      subject: `New Job Application: ${fullName}`,
      html: createEmailTemplate({
        fullName,
        email,
        phone,
        jobTitle,
      }),
      attachments: [
        {
          filename: resume.name,
          content: Buffer.from(await resume.arrayBuffer()),
        },
      ],
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

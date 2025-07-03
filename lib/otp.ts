export const generateOTP = async () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export const fast2SMS = async (otp: string, number: string) => {
  try {
    const data = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "post",
      headers: {
        authorization: process.env.FAST2SMS_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // variables_values: otp,
        route: "dlt",
        numbers: number,
        message: `${process.env.NEXT_PUBLIC_APP_NAME} - Your OTP is ${otp}. OTP is valid for 10 minutes.`,
        // flash: 0,
        language: "english",
        // numbers_type: 1,
        sender_id: "FSTSMS",
        // variables_name: "OTP",
        // entity_id: "1",
        // template_id: otp + Date.now(),
      }),
    }).then((res) => res.json());

    console.log("data -", data);

    if (data.return) {
      return { ok: true, message: "OTP sent successfully" };
    }

    return { ok: false, error: "Failed to send OTP" };
  } catch (error) {
    console.log("error -", error);
    return { ok: false, error: "Failed to send OTP" };
  }
};

export const sendOTP = async (otp: string, number: string) => {
  return await fast2SMS(otp, number);
};

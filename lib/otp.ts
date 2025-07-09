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
        route: "dlt",
        sender_id: "SILKYE",
        message: 189464,
        variables_values: otp,
        numbers: number,
        flash: 0,
      }),
    }).then((res) => res.json());

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

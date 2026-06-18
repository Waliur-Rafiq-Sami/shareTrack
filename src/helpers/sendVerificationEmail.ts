import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  console.log("[sendVerificationEmail] starting send", {
    email,
    username,
    verifyCode,
    hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
  });

  if (!process.env.RESEND_API_KEY) {
    console.error("[sendVerificationEmail] RESEND_API_KEY is not set");
  }

  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "TradeLedger Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    const hasError = response && "error" in response && response.error;
    const hasData = response && "data" in response && response.data;

    if (hasError) {
      const apiError = (response as { error: { message: string } }).error;
      console.error("[sendVerificationEmail] Resend internal error:", apiError);

      return {
        success: false,
        message: apiError.message || "Failed to send verification email.",
      };
    }

    console.log("[sendVerificationEmail] Resend API Response received", {
      email,
      username,
      verifyCode,
      data: hasData ? (response as { data: unknown }).data : null,
    });

    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error(
      "[sendVerificationEmail] failed to send verification email:",
      emailError,
    );
    return {
      success: false,
      message:
        "Failed to send verification email. Check server logs for details.",
    };
  }
}

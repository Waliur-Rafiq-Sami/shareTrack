// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import bcrypt from "bcryptjs";
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// export async function POST(request: Request) {
//   await dbConnect();

//   try {
//     const {
//       username,
//       email,
//       password,
//       dateOfBirth,
//       phoneNumber,
//       address,
//       profession,
//     } = await request.json();

//     console.log("[sign-up] request received", {
//       username,
//       email,
//       dateOfBirth,
//       phoneNumber,
//       address,
//       profession,
//     });

//     // 1. Checks ONLY for verified users. If a username exists but is unverified,
//     // it will pass through, meaning unverified usernames are not unique.
//     const existingVerifiedUserByUsername = await UserModel.findOne({
//       username,
//       isVerified: true,
//     });

//     if (existingVerifiedUserByUsername) {
//       return Response.json(
//         {
//           success: false,
//           message: "Username is already taken",
//         },
//         { status: 400 },
//       );
//     }

//     const existingUserByEmail = await UserModel.findOne({ email });
//     let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

//     if (existingUserByEmail) {
//       if (existingUserByEmail.isVerified) {
//         return Response.json(
//           {
//             success: false,
//             message: "User already exists with this email",
//           },
//           { status: 400 },
//         );
//       } else {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         existingUserByEmail.password = hashedPassword;
//         existingUserByEmail.dateOfBirth = new Date(dateOfBirth);
//         existingUserByEmail.phoneNumber = phoneNumber;
//         existingUserByEmail.address = address;
//         existingUserByEmail.profession = profession;
//         existingUserByEmail.verifyCode = verifyCode;
//         existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
//         await existingUserByEmail.save();
//       }
//     } else {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const expiryDate = new Date();
//       expiryDate.setHours(expiryDate.getHours() + 1);

//       const newUser = new UserModel({
//         username,
//         email,
//         password: hashedPassword,
//         dateOfBirth: new Date(dateOfBirth),
//         phoneNumber,
//         address,
//         profession,
//         verifyCode,
//         verifyCodeExpiry: expiryDate,
//         isVerified: false,
//       });

//       await newUser.save();
//     }

//     // 2. Send verification email
//     const emailResponse = await sendVerificationEmail(
//       email,
//       username,
//       verifyCode,
//     );

//     console.log("[sign-up] sendVerificationEmail response", emailResponse);

//     if (!emailResponse.success) {
//       const resendWarningText =
//         "You can only send testing emails to your own email address";

//       // Check if the failure is specifically due to Resend's free-tier domain restriction
//       if (
//         emailResponse.message &&
//         emailResponse.message.includes(resendWarningText)
//       ) {
//         return Response.json(
//           {
//             verifyCode: verifyCode, ///////////////////////////////
//             success: true,
//             redirectToVerify: true,
//             message:
//               "User registered, but email was blocked by Resend testing limitations. Redirecting to verification page.",
//           },
//           { status: 201 }, // Return a 201 so your frontend handles it as a success/redirect
//         );
//       }

//       // Any other genuine email error
//       return Response.json(
//         {
//           success: false,
//           message: emailResponse.message,
//         },
//         { status: 500 },
//       );
//     }

//     // Standard successful response
//     return Response.json(
//       {
//         verifyCode: verifyCode, ///////////////////////////////
//         success: true,
//         message: "User registered successfully. Please verify your account.",
//         email: email,
//       },
//       { status: 201 },
//     );
//   } catch (error) {
//     console.error("Error registering user:", error);
//     return Response.json(
//       {
//         success: false,
//         message: "Error registering user",
//       },
//       { status: 500 },
//     );
//   }
// }

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const {
      username,
      email,
      password,
      dateOfBirth,
      phoneNumber,
      address,
      profession,
    } = await request.json();

    console.log("[sign-up] request received", {
      username,
      email,
      dateOfBirth,
      phoneNumber,
      address,
      profession,
    });

    // 1. Checks ONLY for verified users.
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 },
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.dateOfBirth = new Date(dateOfBirth);
        existingUserByEmail.phoneNumber = phoneNumber;
        existingUserByEmail.address = address;
        existingUserByEmail.profession = profession;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        address,
        profession,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
      });

      await newUser.save();
    }

    // 2. Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    console.log("[sign-up] sendVerificationEmail response", emailResponse);

    if (!emailResponse.success) {
      const resendWarningText =
        "You can only send testing emails to your own email address";

      // Check if the failure is specifically due to Resend's free-tier domain restriction
      if (
        emailResponse.message &&
        emailResponse.message.includes(resendWarningText)
      ) {
        return Response.json(
          {
            verifyCode: verifyCode, // TEST MODE
            success: true,
            redirectToVerify: true,
            message:
              "User registered, but email was blocked by Resend testing limitations. Redirecting to verification page.",
          },
          { status: 201 },
        );
      }

      // Any other genuine email error
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }

    // Standard successful response
    return Response.json(
      {
        verifyCode: verifyCode, // TEST MODE
        success: true,
        message: "User registered successfully. Please verify your account.",
        email: email,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 },
    );
  }
}

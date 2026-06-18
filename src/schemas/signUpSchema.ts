import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phoneNumber: z
    .string()
    .min(7, { message: "Phone number is required" })
    .max(20, { message: "Phone number looks too long" }),
  address: z
    .string()
    .min(10, { message: "Address is required" })
    .max(250, { message: "Address must be shorter than 250 characters" }),
  profession: z.string().optional(),
});

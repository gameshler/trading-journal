import { z } from "zod";

export const emailSchema = z.string().trim().email().min(1).max(255);
const passwordSchema = z.string().trim().min(8).max(255);
const userAgentSchema = z.string().optional();

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: userAgentSchema,
});

export const registerSchema = loginSchema
  .extend({
    fullName: z.string().min(1).max(255),
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verificationCodeSchema = z.string().trim().min(1).max(24);

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});

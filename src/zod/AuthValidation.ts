import { z } from "zod";

import { Role } from "@/app/constants/role";

const emailSchema = z.string().trim().email("Invalid email address");

export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required"),
	rememberMe: z.boolean().default(false),
});

export const registerSchema = z.object({
	name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
	email: emailSchema,
	password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password is too long"),
	confirmPassword: z.string().min(1, "Confirm password is required"),
	role: z.enum([Role.ProjectManager, Role.TeamMember]).default(Role.TeamMember),
	rememberMe: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"],
});

export const demoLoginSchema = z.object({
	role: z.enum(["admin", "manager", "member"]).default("member"),
});

export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z.string().min(8, "Password must be at least 8 characters").max(128, "Password is too long"),
		confirmPassword: z.string().min(1, "Confirm password is required"),
		revokeOtherSessions: z.boolean().default(false),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type DemoLoginFormValues = z.infer<typeof demoLoginSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

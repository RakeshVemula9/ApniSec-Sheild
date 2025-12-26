import { z } from "zod";
import { ValidationError } from "../errors/AppError";

// Validation schemas
const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    name: z.string().min(2, "Name must be at least 2 characters"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

// Auth validator class
export class AuthValidator {
    static validateRegister(data: any) {
        try {
            return registerSchema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new ValidationError("Validation failed", error.issues);
            }
            throw error;
        }
    }

    static validateLogin(data: any) {
        try {
            return loginSchema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new ValidationError("Validation failed", error.issues);
            }
            throw error;
        }
    }
}

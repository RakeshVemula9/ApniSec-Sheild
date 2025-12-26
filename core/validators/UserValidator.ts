import { z } from "zod";
import { ValidationError } from "../errors/AppError";

// User profile update schema
const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
});

// User validator class
export class UserValidator {
    static validateProfileUpdate(data: any) {
        try {
            return updateProfileSchema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new ValidationError("Validation failed", error.errors);
            }
            throw error;
        }
    }
}

import { z } from "zod";
import { ValidationError } from "../errors/AppError";

// Issue type enum for validation
const issueTypeEnum = z.enum(["CLOUD_SECURITY", "REDTEAM_ASSESSMENT", "VAPT"]);
const issueStatusEnum = z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]);
const issuePriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

// Validation schemas
const createIssueSchema = z.object({
    type: issueTypeEnum,
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    priority: issuePriorityEnum.optional(),
    status: issueStatusEnum.optional(),
});

const updateIssueSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").optional(),
    description: z.string().min(10, "Description must be at least 10 characters").optional(),
    priority: issuePriorityEnum.optional(),
    status: issueStatusEnum.optional(),
});

// Issue validator class
export class IssueValidator {
    static validateCreate(data: any) {
        try {
            return createIssueSchema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new ValidationError("Validation failed", error.issues);
            }
            throw error;
        }
    }

    static validateUpdate(data: any) {
        try {
            return updateIssueSchema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new ValidationError("Validation failed", error.issues);
            }
            throw error;
        }
    }

    static validateIssueType(type: string) {
        try {
            return issueTypeEnum.parse(type);
        } catch (error) {
            throw new ValidationError("Invalid issue type");
        }
    }
}

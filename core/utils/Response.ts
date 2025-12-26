import { NextResponse } from "next/server";
import { AppError } from "../errors/AppError";

// Response utility class for consistent API responses
export class ApiResponse {
    static success<T>(data: T, message: string = "Success", statusCode: number = 200) {
        return NextResponse.json(
            {
                success: true,
                message,
                data,
            },
            { status: statusCode }
        );
    }

    static error(error: Error | AppError, statusCode: number = 500) {
        const isAppError = error instanceof AppError;

        // Convert Prisma errors to user-friendly messages
        let userMessage = error.message;
        let finalStatusCode = isAppError ? (error as AppError).statusCode : statusCode;

        // Detect Prisma/Database errors and make them user-friendly
        if (!isAppError) {
            const errorMsg = error.message.toLowerCase();

            // Database connection errors
            if (errorMsg.includes('tenant or user not found') ||
                errorMsg.includes('could not connect') ||
                errorMsg.includes('connection') ||
                errorMsg.includes('econnrefused')) {
                userMessage = 'Unable to connect to the database. Please try again later or contact support if the problem persists.';
                finalStatusCode = 503; // Service Unavailable
            }
            // Authentication errors
            else if (errorMsg.includes('authentication failed') ||
                errorMsg.includes('password authentication')) {
                userMessage = 'Database authentication error. Please contact support.';
                finalStatusCode = 503;
            }
            // Unique constraint violations
            else if (errorMsg.includes('unique constraint') ||
                errorMsg.includes('already exists')) {
                userMessage = 'This record already exists. Please use different values.';
                finalStatusCode = 409; // Conflict
            }
            // Record not found errors
            else if (errorMsg.includes('record to') && errorMsg.includes('not found')) {
                userMessage = 'The requested resource was not found.';
                finalStatusCode = 404;
            }
            // Generic Prisma errors
            else if (errorMsg.includes('prisma') || errorMsg.includes('p1') || errorMsg.includes('p2')) {
                userMessage = 'A database error occurred. Please try again later.';
                finalStatusCode = 500;
            }
            // JWT/Auth errors
            else if (errorMsg.includes('jwt') || errorMsg.includes('token')) {
                userMessage = 'Authentication token is invalid or expired. Please log in again.';
                finalStatusCode = 401;
            }
        }

        return NextResponse.json(
            {
                success: false,
                message: userMessage,
                ...(isAppError && (error as AppError).isOperational && {
                    errors: (error as any).errors,
                }),
            },
            { status: finalStatusCode }
        );
    }

    static rateLimit(retryAfter: number) {
        return NextResponse.json(
            {
                success: false,
                message: "Too many requests, please try again later",
            },
            {
                status: 429,
                headers: {
                    "X-RateLimit-Limit": "100",
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": new Date(Date.now() + retryAfter * 1000).toISOString(),
                    "Retry-After": retryAfter.toString(),
                },
            }
        );
    }
}

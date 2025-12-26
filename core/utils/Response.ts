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

        return NextResponse.json(
            {
                success: false,
                message: error.message,
                ...(isAppError && (error as AppError).isOperational && {
                    errors: (error as any).errors,
                }),
            },
            { status: isAppError ? (error as AppError).statusCode : statusCode }
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

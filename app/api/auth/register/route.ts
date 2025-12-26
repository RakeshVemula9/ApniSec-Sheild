import { NextRequest } from "next/server";
import { AuthHandler } from "@/core/handlers/AuthHandler";
import { RateLimiter } from "@/core/middlewares/RateLimiter";
import { ApiResponse } from "@/core/utils/Response";

export const runtime = "nodejs";

const handler = new AuthHandler();
const rateLimiter = RateLimiter.getInstance();

export async function POST(request: NextRequest) {
    try {
        // Get client identifier (IP or user agent as fallback)
        const ip = request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown";
        const key = `register:${ip}`;

        // Check rate limit
        const rateLimit = rateLimiter.check(key);
        if (!rateLimit.allowed) {
            const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
            return ApiResponse.rateLimit(retryAfter);
        }

        // Process request
        const response = await handler.register(request);

        // Add rate limit headers
        const headers = rateLimiter.getRateLimitHeaders(key);
        Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;
    } catch (error) {
        return ApiResponse.error(error as Error);
    }
}

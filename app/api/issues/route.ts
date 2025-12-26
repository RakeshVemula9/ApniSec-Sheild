import { NextRequest } from "next/server";
import { IssueHandler } from "@/core/handlers/IssueHandler";
import { RateLimiter } from "@/core/middlewares/RateLimiter";
import { ApiResponse } from "@/core/utils/Response";

export const runtime = "nodejs";


export async function GET(request: NextRequest) {
    try {
        const handler = new IssueHandler();
        const rateLimiter = RateLimiter.getInstance();
        
        const ip = request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown";
        const key = `issues:list:${ip}`;

        const rateLimit = rateLimiter.check(key);
        if (!rateLimit.allowed) {
            const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
            return ApiResponse.rateLimit(retryAfter);
        }

        const response = await handler.getIssues(request);

        const headers = rateLimiter.getRateLimitHeaders(key);
        Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;
    } catch (error) {
        return ApiResponse.error(error as Error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const handler = new IssueHandler();
        const rateLimiter = RateLimiter.getInstance();
        
        const ip = request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown";
        const key = `issues:create:${ip}`;

        const rateLimit = rateLimiter.check(key);
        if (!rateLimit.allowed) {
            const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
            return ApiResponse.rateLimit(retryAfter);
        }

        const response = await handler.createIssue(request);

        const headers = rateLimiter.getRateLimitHeaders(key);
        Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;
    } catch (error) {
        return ApiResponse.error(error as Error);
    }
}

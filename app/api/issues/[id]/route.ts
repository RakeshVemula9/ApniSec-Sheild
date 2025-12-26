import { NextRequest } from "next/server";
import { IssueHandler } from "@/core/handlers/IssueHandler";
import { RateLimiter } from "@/core/middlewares/RateLimiter";
import { ApiResponse } from "@/core/utils/Response";

export const runtime = "nodejs";

const handler = new IssueHandler();
const rateLimiter = RateLimiter.getInstance();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const ip = request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown";
        const key = `issues:get:${ip}`;

        const rateLimit = rateLimiter.check(key);
        if (!rateLimit.allowed) {
            const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
            return ApiResponse.rateLimit(retryAfter);
        }

        const response = await handler.getIssue(request, id);

        const headers = rateLimiter.getRateLimitHeaders(key);
        Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;
    } catch (error) {
        return ApiResponse.error(error as Error);
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const ip = request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown";
        const key = `issues:update:${ip}`;

        const rateLimit = rateLimiter.check(key);
        if (!rateLimit.allowed) {
            const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
            return ApiResponse.rateLimit(retryAfter);
        }

        const response = await handler.updateIssue(request, id);

        const headers = rateLimiter.getRateLimitHeaders(key);
        Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;
    } catch (error) {
        return ApiResponse.error(error as Error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const ip = request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown";
        const key = `issues:delete:${ip}`;

        const rateLimit = rateLimiter.check(key);
        if (!rateLimit.allowed) {
            const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
            return ApiResponse.rateLimit(retryAfter);
        }

        const response = await handler.deleteIssue(request, id);

        const headers = rateLimiter.getRateLimitHeaders(key);
        Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;
    } catch (error) {
        return ApiResponse.error(error as Error);
    }
}

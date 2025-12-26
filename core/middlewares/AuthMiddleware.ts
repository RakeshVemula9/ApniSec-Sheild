import { NextRequest } from "next/server";
import { JWT } from "../utils/JWT";
import { AuthError } from "../errors/AppError";

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        userId: string;
        email: string;
    };
}

// Authentication middleware class
export class AuthMiddleware {
    static authenticate(request: NextRequest): { userId: string; email: string } {
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AuthError("No token provided");
        }

        const token = authHeader.substring(7);

        try {
            const decoded = JWT.verify(token);
            return {
                userId: decoded.userId,
                email: decoded.email,
            };
        } catch (error) {
            throw new AuthError("Invalid or expired token");
        }
    }

    static getToken(request: NextRequest): string | null {
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }
}

import { NextRequest } from "next/server";
import { AuthService } from "../services/AuthService";
import { AuthValidator } from "../validators/AuthValidator";
import { ApiResponse } from "../utils/Response";
import { AppError } from "../errors/AppError";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

// Auth Handler - HTTP Request/Response Layer
export class AuthHandler {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async register(request: NextRequest) {
        try {
            const body = await request.json();

            // Validate input
            const validatedData = AuthValidator.validateRegister(body);

            // Register user
            const result = await this.authService.register(validatedData);

            return ApiResponse.success(result, "User registered successfully", 201);
        } catch (error) {
            return ApiResponse.error(error as Error);
        }
    }

    async login(request: NextRequest) {
        try {
            const body = await request.json();

            // Validate input
            const validatedData = AuthValidator.validateLogin(body);

            // Login user
            const result = await this.authService.login(validatedData);

            return ApiResponse.success(result, "Login successful");
        } catch (error) {
            return ApiResponse.error(error as Error);
        }
    }

    async logout(request: NextRequest) {
        try {
            // In JWT auth, logout is mostly client-side (remove token)
            // But we can still validate the token exists
            AuthMiddleware.authenticate(request);

            return ApiResponse.success(null, "Logout successful");
        } catch (error) {
            return ApiResponse.error(error as Error);
        }
    }

    async getMe(request: NextRequest) {
        try {
            // Authenticate user
            const { userId } = AuthMiddleware.authenticate(request);

            // Get user data
            const user = await this.authService.getMe(userId);

            return ApiResponse.success(user, "User retrieved successfully");
        } catch (error) {
            return ApiResponse.error(error as Error);
        }
    }
}

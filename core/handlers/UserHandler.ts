import { NextRequest } from "next/server";
import { UserService } from "../services/UserService";
import { UserValidator } from "../validators/UserValidator";
import { ApiResponse } from "../utils/Response";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

// User Handler - HTTP Request/Response Layer
export class UserHandler {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async getProfile(request: NextRequest) {
        try {
            // Authenticate user
            const { userId } = AuthMiddleware.authenticate(request);

            // Get profile
            const user = await this.userService.getProfile(userId);

            return ApiResponse.success(user, "Profile retrieved successfully");
        } catch (error) {
            return ApiResponse.error(error as Error);
        }
    }

    async updateProfile(request: NextRequest) {
        try {
            // Authenticate user
            const { userId } = AuthMiddleware.authenticate(request);

            const body = await request.json();

            // Validate input
            const validatedData = UserValidator.validateProfileUpdate(body);

            // Update profile
            const user = await this.userService.updateProfile(userId, validatedData);

            return ApiResponse.success(user, "Profile updated successfully");
        } catch (error) {
            return ApiResponse.error(error as Error);
        }
    }
}

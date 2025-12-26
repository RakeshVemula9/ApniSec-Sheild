import { NextRequest } from "next/server";
import { IssueService } from "../services/IssueService";
import { IssueValidator } from "../validators/IssueValidator";
import { ApiResponse } from "../utils/Response";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { IssueType } from "@prisma/client";

// Issue Handler - HTTP Request/Response Layer
export class IssueHandler {
    private issueService: IssueService;

    constructor() {
        this.issueService = new IssueService();
    }

    async createIssue(request: NextRequest) {
        try {
            // Authenticate user
            const { userId } = AuthMiddleware.authenticate(request);

            const body = await request.json();

            // Validate input
            const validatedData = IssueValidator.validateCreate(body);

            // Create issue
            const issue = await this.issueService.createIssue({
                ...validatedData,
                userId,
            });

            return ApiResponse.success(issue, "Issue created successfully", 201);
        } catch (error) {
            return ApiResponse.error(error as Error);
        }
    }

    async getIssues(request: NextRequest) {
        try {
            // Authenticate user
            const { userId } = AuthMiddleware.authenticate(request);

            // Get query parameters
            const { searchParams } = new URL(request.url);
            const type = searchParams.get("type");

            // Validate type if provided
            let issueType: IssueType | undefined;
            if (type) {
                issueType = IssueValidator.validateIssueType(type) as IssueType;
            }

            // Get issues
            const issues = await this.issueService.getIssues(userId, issueType);

            return ApiResponse.success(issues, "Issues retrieved successfully");
        } catch (error) {
            return ApiResponse.error(error as Error);
        }
    }

    async getIssue(request: NextRequest, id: string) {
        try {
            // Authenticate user
            const { userId } = AuthMiddleware.authenticate(request);

            // Get issue
            const issue = await this.issueService.getIssue(id, userId);

            return ApiResponse.success(issue, "Issue retrieved successfully");
        } catch (error) {
            return ApiResponse.error(error as Error);
        }
    }

    async updateIssue(request: NextRequest, id: string) {
        try {
            // Authenticate user
            const { userId } = AuthMiddleware.authenticate(request);

            const body = await request.json();

            // Validate input
            const validatedData = IssueValidator.validateUpdate(body);

            // Update issue
            const issue = await this.issueService.updateIssue(id, userId, validatedData);

            return ApiResponse.success(issue, "Issue updated successfully");
        } catch (error) {
            return ApiResponse.error(error as Error);
        }
    }

    async deleteIssue(request: NextRequest, id: string) {
        try {
            // Authenticate user
            const { userId } = AuthMiddleware.authenticate(request);

            // Delete issue
            await this.issueService.deleteIssue(id, userId);

            return ApiResponse.success(null, "Issue deleted successfully");
        } catch (error) {
            return ApiResponse.error(error as Error);
        }
    }
}

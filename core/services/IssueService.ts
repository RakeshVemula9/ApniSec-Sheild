import { IssueRepository, CreateIssueData, UpdateIssueData } from "../repositories/IssueRepository";
import { UserRepository } from "../repositories/UserRepository";
import { EmailService } from "./EmailService";
import { NotFoundError } from "../errors/AppError";
import { IssueType } from "@prisma/client";

// Issue Service - Business Logic Layer
export class IssueService {
    private issueRepository: IssueRepository;
    private userRepository: UserRepository;
    private emailService: EmailService;

    constructor() {
        this.issueRepository = new IssueRepository();
        this.userRepository = new UserRepository();
        this.emailService = new EmailService();
    }

    async createIssue(data: CreateIssueData) {
        // Create issue
        const issue = await this.issueRepository.create(data);

        // Get user for email
        const user = await this.userRepository.findById(data.userId);

        // Send notification email (async, don't wait)
        if (user) {
            this.emailService.sendIssueCreatedEmail(user.email, user.name, issue).catch(console.error);
        }

        return issue;
    }

    async getIssues(userId: string, type?: IssueType) {
        return this.issueRepository.findAll(userId, type);
    }

    async getIssue(id: string, userId: string) {
        const issue = await this.issueRepository.findById(id, userId);
        if (!issue) {
            throw new NotFoundError("Issue not found");
        }
        return issue;
    }

    async updateIssue(id: string, userId: string, data: UpdateIssueData) {
        // Check if issue exists
        const existingIssue = await this.issueRepository.findById(id, userId);
        if (!existingIssue) {
            throw new NotFoundError("Issue not found");
        }

        // Update issue
        return this.issueRepository.update(id, userId, data);
    }

    async deleteIssue(id: string, userId: string) {
        // Check if issue exists
        const existingIssue = await this.issueRepository.findById(id, userId);
        if (!existingIssue) {
            throw new NotFoundError("Issue not found");
        }

        // Delete issue
        await this.issueRepository.delete(id, userId);
    }
}

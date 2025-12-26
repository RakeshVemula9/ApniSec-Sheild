import { UserRepository } from "../repositories/UserRepository";
import { EmailService } from "./EmailService";
import { NotFoundError, ValidationError } from "../errors/AppError";

// User Service - Business Logic Layer  
export class UserService {
    private userRepository: UserRepository;
    private emailService: EmailService;

    constructor() {
        this.userRepository = new UserRepository();
        this.emailService = new EmailService();
    }

    async getProfile(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return user;
    }

    async updateProfile(userId: string, data: { name?: string; email?: string }) {
        // Check if user exists
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new NotFoundError("User not found");
        }

        // If email is being updated, check if it's already taken
        if (data.email && data.email !== existingUser.email) {
            const emailExists = await this.userRepository.findByEmail(data.email);
            if (emailExists) {
                throw new ValidationError("Email is already taken");
            }
        }

        // Update user
        const updatedUser = await this.userRepository.update(userId, data);

        // Send notification email (async, don't wait)
        this.emailService.sendProfileUpdatedEmail(updatedUser.email, updatedUser.name).catch(console.error);

        return updatedUser;
    }
}

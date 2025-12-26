import { UserRepository } from "../repositories/UserRepository";
import { Password } from "../utils/Password";
import { JWT } from "../utils/JWT";
import { AuthError, ValidationError } from "../errors/AppError";
import { EmailService } from "./EmailService";

// Auth Service - Business Logic Layer
export class AuthService {
    private userRepository: UserRepository;
    private emailService: EmailService;

    constructor() {
        this.userRepository = new UserRepository();
        this.emailService = new EmailService();
    }

    async register(data: { email: string; password: string; name: string }) {
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ValidationError("User with this email already exists");
        }

        // Hash password
        const hashedPassword = await Password.hash(data.password);

        // Create user
        const user = await this.userRepository.create({
            email: data.email,
            password: hashedPassword,
            name: data.name,
        });

        // Send welcome email (async, don't wait)
        this.emailService.sendWelcomeEmail(user.email, user.name).catch(console.error);

        // Generate JWT token
        const token = JWT.sign({ userId: user.id, email: user.email });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
            token,
        };
    }

    async login(data: { email: string; password: string }) {
        // Find user
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new AuthError("Invalid credentials");
        }

        // Verify password
        const isPasswordValid = await Password.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new AuthError("Invalid credentials");
        }

        // Generate JWT token
        const token = JWT.sign({ userId: user.id, email: user.email });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
            token,
        };
    }

    async getMe(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AuthError("User not found");
        }

        return user;
    }
}

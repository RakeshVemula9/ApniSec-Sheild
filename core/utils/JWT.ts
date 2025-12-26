import jwt from "jsonwebtoken";
import { AuthError } from "../errors/AppError";

// JWT utility class for token management
export class JWT {
    private static secret: string = process.env.JWT_SECRET || "your-secret-key";
    private static expiresIn: string = process.env.JWT_EXPIRES_IN || "7d";

    static sign(payload: object): string {
        return jwt.sign(payload, this.secret as jwt.Secret, { expiresIn: this.expiresIn } as jwt.SignOptions);
    }

    static verify(token: string): any {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            throw new AuthError("Invalid or expired token");
        }
    }

    static decode(token: string): any {
        return jwt.decode(token);
    }
}

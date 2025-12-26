import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

// User Repository - Data Access Layer
export class UserRepository {
    async create(data: { email: string; password: string; name: string }): Promise<User> {
        return prisma.user.create({
            data,
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async update(id: string, data: Partial<{ name: string; email: string }>): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }
}

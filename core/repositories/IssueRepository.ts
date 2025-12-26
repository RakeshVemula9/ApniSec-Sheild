import { prisma } from "@/lib/prisma";
import { Issue, IssueType, IssueStatus, IssuePriority } from "@prisma/client";

export interface CreateIssueData {
    type: IssueType;
    title: string;
    description: string;
    priority?: IssuePriority;
    status?: IssueStatus;
    userId: string;
}

export interface UpdateIssueData {
    title?: string;
    description?: string;
    priority?: IssuePriority;
    status?: IssueStatus;
}

// Issue Repository - Data Access Layer
export class IssueRepository {
    async create(data: CreateIssueData): Promise<Issue> {
        return prisma.issue.create({
            data: {
                type: data.type,
                title: data.title,
                description: data.description,
                priority: data.priority || "MEDIUM",
                status: data.status || "OPEN",
                userId: data.userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findAll(userId: string, type?: IssueType): Promise<Issue[]> {
        return prisma.issue.findMany({
            where: {
                userId,
                ...(type && { type }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findById(id: string, userId: string): Promise<Issue | null> {
        return prisma.issue.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async update(id: string, userId: string, data: UpdateIssueData): Promise<Issue> {
        return prisma.issue.update({
            where: {
                id,
                userId,
            },
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async delete(id: string, userId: string): Promise<void> {
        await prisma.issue.delete({
            where: {
                id,
                userId,
            },
        });
    }
}

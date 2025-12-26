export interface Metadata {
    title: string;
    description: string;
    keywords?: string[];
    openGraph?: {
        title: string;
        description: string;
        type: string;
    };
}

export const metadata: Metadata = {
    title: "Dashboard - ApniSec",
    description: "Manage your security issues and track their progress",
};

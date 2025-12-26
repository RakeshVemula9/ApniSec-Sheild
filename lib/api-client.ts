// API client for making authenticated requests
export class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        if (typeof window !== "undefined") {
            this.token = localStorage.getItem("token");
        }
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
        }
    }

    removeToken() {
        this.token = null;
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }
    }

    getToken(): string | null {
        return this.token;
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }

        return headers;
    }

    async request<T>(
        endpoint: string,
        method: string = "GET",
        body?: any
    ): Promise<{ success: boolean; data?: T; message?: string; errors?: any }> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers: this.getHeaders(),
            ...(body && { body: JSON.stringify(body) }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Request failed");
        }

        return data;
    }

    // Auth methods
    async register(data: { email: string; password: string; name: string }) {
        return this.request("/api/auth/register", "POST", data);
    }

    async login(data: { email: string; password: string }) {
        return this.request("/api/auth/login", "POST", data);
    }

    async logout() {
        return this.request("/api/auth/logout", "POST");
    }

    async getMe() {
        return this.request("/api/auth/me");
    }

    // Issue methods
    async getIssues(type?: string) {
        const queryParam = type ? `?type=${type}` : "";
        return this.request(`/api/issues${queryParam}`);
    }

    async createIssue(data: any) {
        return this.request("/api/issues", "POST", data);
    }

    async getIssue(id: string) {
        return this.request(`/api/issues/${id}`);
    }

    async updateIssue(id: string, data: any) {
        return this.request(`/api/issues/${id}`, "PUT", data);
    }

    async deleteIssue(id: string) {
        return this.request(`/api/issues/${id}`, "DELETE");
    }

    // User methods
    async getProfile() {
        return this.request("/api/users/profile");
    }

    async updateProfile(data: { name?: string; email?: string }) {
        return this.request("/api/users/profile", "PUT", data);
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

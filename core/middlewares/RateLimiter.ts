import { RateLimitError } from "../errors/AppError";

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// Rate Limiter class - Custom implementation
export class RateLimiter {
    private static instance: RateLimiter;
    private store: Map<string, RateLimitEntry>;
    private readonly limit: number;
    private readonly windowMs: number;

    private constructor(limit: number = 100, windowMs: number = 15 * 60 * 1000) {
        this.store = new Map();
        this.limit = limit;
        this.windowMs = windowMs;

        // Cleanup old entries every 5 minutes
        setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }

    static getInstance(): RateLimiter {
        if (!RateLimiter.instance) {
            RateLimiter.instance = new RateLimiter();
        }
        return RateLimiter.instance;
    }

    check(key: string): {
        allowed: boolean;
        remaining: number;
        resetTime: number;
    } {
        const now = Date.now();
        const entry = this.store.get(key);

        // If no entry or reset time has passed, create new entry
        if (!entry || now >= entry.resetTime) {
            const newEntry: RateLimitEntry = {
                count: 1,
                resetTime: now + this.windowMs,
            };
            this.store.set(key, newEntry);

            return {
                allowed: true,
                remaining: this.limit - 1,
                resetTime: newEntry.resetTime,
            };
        }

        // Increment count
        entry.count++;
        this.store.set(key, entry);

        const allowed = entry.count <= this.limit;
        const remaining = Math.max(0, this.limit - entry.count);

        return {
            allowed,
            remaining,
            resetTime: entry.resetTime,
        };
    }

    getRateLimitHeaders(key: string) {
        const result = this.check(key);
        const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);

        return {
            "X-RateLimit-Limit": this.limit.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
            ...((!result.allowed) && { "Retry-After": retryAfter.toString() }),
        };
    }

    private cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()) {
            if (now >= entry.resetTime) {
                this.store.delete(key);
            }
        }
    }
}

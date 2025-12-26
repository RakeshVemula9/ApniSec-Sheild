// Base error class for application errors
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication errors
export class AuthError extends AppError {
  constructor(message: string = "Authentication failed", statusCode: number = 401) {
    super(message, statusCode);
  }
}

// Validation errors
export class ValidationError extends AppError {
  public errors: any;

  constructor(message: string = "Validation failed", errors: any = null) {
    super(message, 400);
    this.errors = errors;
  }
}

// Not found errors
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

// Rate limit errors
export class RateLimitError extends AppError {
  public retryAfter: number;

  constructor(retryAfter: number = 900) {
    super("Too many requests, please try again later", 429);
    this.retryAfter = retryAfter;
  }
}

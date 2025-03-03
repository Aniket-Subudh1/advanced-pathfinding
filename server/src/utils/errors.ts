export class ApiError extends Error {
    status: number;
    
    constructor(message: string, status: number = 500) {
      super(message);
      this.name = this.constructor.name;
      this.status = status;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class NotFoundError extends ApiError {
    constructor(message: string = 'Resource not found') {
      super(message, 404);
    }
  }
  
  export class BadRequestError extends ApiError {
    constructor(message: string = 'Bad request') {
      super(message, 400);
    }
  }
  
  export class ValidationError extends ApiError {
    errors: Record<string, string[]>;
    
    constructor(message: string = 'Validation failed', errors: Record<string, string[]> = {}) {
      super(message, 422);
      this.errors = errors;
    }
  }
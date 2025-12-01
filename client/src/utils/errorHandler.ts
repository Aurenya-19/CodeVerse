// Comprehensive Error Handling System for CodeVerse

export interface ErrorResponse {
  message: string;
  code: number;
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown';
  details?: string;
  timestamp: string;
}

export class AppError extends Error {
  constructor(
    public message: string,
    public code: number = 500,
    public type: 'network' | 'auth' | 'validation' | 'server' | 'unknown' = 'unknown',
    public details?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function parseError(error: any): ErrorResponse {
  const timestamp = new Date().toISOString();

  // Handle fetch/network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: 'Network connection failed. Please check your internet.',
      code: 0,
      type: 'network',
      timestamp,
    };
  }

  // Handle API error responses
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data || {};

    if (status === 401) {
      return {
        message: 'Your session expired. Please log in again.',
        code: 401,
        type: 'auth',
        details: data.message,
        timestamp,
      };
    }

    if (status === 403) {
      return {
        message: 'You don\'t have permission to do this.',
        code: 403,
        type: 'auth',
        details: data.message,
        timestamp,
      };
    }

    if (status === 400) {
      return {
        message: data.message || 'Invalid request. Please check your input.',
        code: 400,
        type: 'validation',
        details: data.details,
        timestamp,
      };
    }

    if (status === 404) {
      return {
        message: 'The resource you\'re looking for doesn\'t exist.',
        code: 404,
        type: 'server',
        timestamp,
      };
    }

    if (status >= 500) {
      return {
        message: data.message || 'Server error. Our team has been notified. Please try again later.',
        code: status,
        type: 'server',
        details: data.details,
        timestamp,
      };
    }
  }

  // Handle AppError
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      type: error.type,
      details: error.details,
      timestamp,
    };
  }

  // Handle generic errors
  if (error instanceof Error) {
    return {
      message: error.message || 'Something went wrong. Please try again.',
      code: 500,
      type: 'unknown',
      timestamp,
    };
  }

  // Fallback for unknown errors
  return {
    message: 'An unexpected error occurred. Please try again later.',
    code: 500,
    type: 'unknown',
    timestamp,
  };
}

export function getErrorMessage(error: any): string {
  const errorResponse = parseError(error);
  return errorResponse.message;
}

export function logError(error: any, context?: string): void {
  const errorResponse = parseError(error);
  console.error(`[${errorResponse.type.toUpperCase()}] ${context || 'Error'}:`, {
    message: errorResponse.message,
    code: errorResponse.code,
    details: errorResponse.details,
    timestamp: errorResponse.timestamp,
  });
  
  // In production, send to monitoring service
  if (import.meta.env.PROD) {
    // Could send to Sentry, LogRocket, etc.
  }
}

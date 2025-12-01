// Professional error handling - hide technical details from users
export interface ApiError {
  status: number;
  userMessage: string;
  logMessage: string;
  details?: any;
}

// Map technical errors to user-friendly messages
const errorMessages: Record<string, string> = {
  "duplicate key": "This item already exists. Please try again.",
  "not found": "The item you're looking for doesn't exist.",
  "unauthorized": "Please log in to continue.",
  "forbidden": "You don't have permission to do that.",
  "validation": "Please check your input and try again.",
  "timeout": "The request took too long. Please try again.",
  "network": "Connection error. Please check your internet and try again.",
  "database": "We're experiencing technical difficulties. Please try again later.",
  "internal": "Something went wrong. Our team has been notified. Please try again later.",
};

export function sanitizeError(error: any, isDev: boolean = false): ApiError {
  const message = error?.message?.toLowerCase() || "";
  const status = error?.status || error?.statusCode || 500;

  // Check for specific error types
  if (message.includes("duplicate")) {
    return {
      status: 409,
      userMessage: errorMessages["duplicate key"],
      logMessage: `Duplicate entry: ${error.message}`,
    };
  }
  if (message.includes("not found")) {
    return {
      status: 404,
      userMessage: errorMessages["not found"],
      logMessage: `Not found: ${error.message}`,
    };
  }
  if (message.includes("unauthorized") || message.includes("not authenticated")) {
    return {
      status: 401,
      userMessage: errorMessages["unauthorized"],
      logMessage: `Unauthorized: ${error.message}`,
    };
  }
  if (message.includes("forbidden")) {
    return {
      status: 403,
      userMessage: errorMessages["forbidden"],
      logMessage: `Forbidden: ${error.message}`,
    };
  }
  if (message.includes("validation")) {
    return {
      status: 400,
      userMessage: errorMessages["validation"],
      logMessage: `Validation error: ${error.message}`,
    };
  }
  if (message.includes("timeout")) {
    return {
      status: 504,
      userMessage: errorMessages["timeout"],
      logMessage: `Timeout: ${error.message}`,
    };
  }

  // Default error handling based on status code
  if (status >= 500) {
    return {
      status,
      userMessage: errorMessages["internal"],
      logMessage: error.message || "Internal server error",
      details: isDev ? error.stack : undefined,
    };
  }

  return {
    status: status || 400,
    userMessage: errorMessages["validation"],
    logMessage: error.message || "Bad request",
    details: isDev ? error.stack : undefined,
  };
}

export function formatErrorResponse(error: any, isDev: boolean = false) {
  const sanitized = sanitizeError(error, isDev);
  return {
    message: sanitized.userMessage,
    code: sanitized.status,
    ...(isDev && sanitized.details && { debug: sanitized.details }),
  };
}

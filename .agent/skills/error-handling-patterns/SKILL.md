---
name: error-handling-patterns
description: Master error handling patterns across languages including exceptions, Result types, error propagation, and graceful degradation to build resilient applications. Use when implementing error handling, designing APIs, or improving application reliability.
---

# Error Handling Patterns

Build resilient applications with robust error handling strategies that gracefully handle failures and provide excellent debugging experiences.

## When to Use This Skill
- Implementing error handling in new features
- Designing error-resilient APIs
- Debugging production issues
- Improving application reliability
- Creating better error messages for users and developers
- Implementing retry and circuit breaker patterns
- Handling async/concurrent errors
- Building fault-tolerant distributed systems

## Core Concepts

### 1. Error Handling Philosophies
**Exceptions vs Result Types:**
- **Exceptions**: Traditional try-catch, disrupts control flow. Use for unexpected errors, exceptional conditions.
- **Result Types**: Explicit success/failure, functional approach. Use for expected errors, validation failures.
- **Error Codes**: C-style, requires discipline.
- **Option/Maybe Types**: For nullable values. (Rust `Option`, Haskell `Maybe`)
- **Panics/Crashes**: Unrecoverable errors, programming bugs.

### 2. Error Categories
**Recoverable Errors:**
- Network timeouts
- Missing files
- Invalid user input
- API rate limits

**Unrecoverable Errors:**
- Out of memory
- Stack overflow
- Programming bugs (null pointer, etc.)

## Language-Specific Patterns

### Python Error Handling

**Custom Exception Hierarchy:**
```python
from datetime import datetime

class ApplicationError(Exception):
    """Base exception for all application errors."""
    def __init__(self, message: str, code: str = None, details: dict = None):
        super().__init__(message)
        self.code = code
        self.details = details or {}
        self.timestamp = datetime.utcnow()

class ValidationError(ApplicationError):
    """Raised when validation fails."""
    pass

class NotFoundError(ApplicationError):
    """Raised when resource not found."""
    pass

class ExternalServiceError(ApplicationError):
    """Raised when external service fails."""
    def __init__(self, message: str, service: str, **kwargs):
        super().__init__(message, **kwargs)
        self.service = service
```

**Context Managers for Cleanup:**
```python
from contextlib import contextmanager

@contextmanager
def database_transaction(session):
    """Ensure transaction is committed or rolled back."""
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        raise
    finally:
        session.close()
```

**Retry with Exponential Backoff:**
```python
import time
from functools import wraps
from typing import TypeVar, Callable

T = TypeVar('T')

def retry(
    max_attempts: int = 3,
    backoff_factor: float = 2.0,
    exceptions: tuple = (Exception,)
):
    """Retry decorator with exponential backoff."""
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        def wrapper(*args, **kwargs) -> T:
            last_exception = None
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    if attempt < max_attempts - 1:
                        sleep_time = backoff_factor ** attempt
                        time.sleep(sleep_time)
                        continue
                    raise
            raise last_exception
        return wrapper
    return decorator
```

### TypeScript/JavaScript Error Handling

**Custom Error Classes:**
```typescript
class ApplicationError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500,
        public details?: Record<string, any>
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends ApplicationError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, 'VALIDATION_ERROR', 400, details);
    }
}
```

**Result Type Pattern:**
```typescript
type Result<T, E = Error> =
    | { ok: true; value: T }
    | { ok: false; error: E };

function Ok<T>(value: T): Result<T, never> {
    return { ok: true, value };
}

function Err<E>(error: E): Result<never, E> {
    return { ok: false, error };
}

// Usage
function parseJSON<T>(json: string): Result<T, SyntaxError> {
    try {
        const value = JSON.parse(json) as T;
        return Ok(value);
    } catch (error) {
        return Err(error as SyntaxError);
    }
}
```

### Rust Error Handling
**Result and Option Types:**
```rust
use std::fs::File;
use std::io::{self, Read};

// Custom error types
#[derive(Debug)]
enum AppError {
    Io(io::Error),
    Parse(std::num::ParseIntError),
    NotFound(String),
    Validation(String),
}

impl From<io::Error> for AppError {
    fn from(error: io::Error) -> Self {
        AppError::Io(error)
    }
}

// Combining Option and Result
fn get_user_age(id: &str) -> Result<u32, AppError> {
    find_user(id)
        .ok_or_else(|| AppError::NotFound(id.to_string()))
        .map(|user| user.age)
}
```

## Universal Patterns

### Pattern 1: Circuit Breaker
Prevent cascading failures in distributed systems.
*(See Python example implementation in original request)*

### Pattern 2: Error Aggregation
Collect multiple errors instead of failing on first error (e.g. form validation).
*(See TypeScript `ErrorCollector` example)*

### Pattern 3: Graceful Degradation
Provide fallback functionality when errors occur (e.g. cache fallback, default values).

## Best Practices
1. **Fail Fast**: Validate input early, fail quickly
2. **Preserve Context**: Include stack traces, metadata, timestamps
3. **Meaningful Messages**: Explain what happened and how to fix it
4. **Log Appropriately**: Error = log, expected failure = don't spam logs
5. **Handle at Right Level**: Catch where you can meaningfully handle
6. **Clean Up Resources**: Use try-finally, context managers, defer
7. **Don't Swallow Errors**: Log or re-throw, don't silently ignore
8. **Type-Safe Errors**: Use typed errors when possible

## Common Pitfalls
- **Catching Too Broadly**: `except Exception` hides bugs
- **Empty Catch Blocks**: Silently swallowing errors
- **Logging and Re-throwing**: Creates duplicate log entries
- **Not Cleaning Up**: Forgetting to close files, connections
- **Poor Error Messages**: "Error occurred" is not helpful

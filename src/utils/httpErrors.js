export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

export class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

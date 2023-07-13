export default class AppError extends Error {
  status: APIStatus;
  isOperational: boolean;
  constructor(public statusCode: number = 500, public message: string) {
    super(message);
    this.status = `${statusCode}`.startsWith("4")
      ? APIStatus.FAILED
      : APIStatus.ERROR;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export enum APIStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  FAILED = "FAILED",
}

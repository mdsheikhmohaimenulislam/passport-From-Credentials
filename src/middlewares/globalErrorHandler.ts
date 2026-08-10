import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { Prisma } from "../../generated/prisma/client";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let errMessage: string =
    err.message || "Internal server Error!";
  let errorDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errMessage = "Incorrect body or missing fields";
  }

  // Don't leak Error object across JSON.stringify (it serializes to {}).
  // Expose message + name + optional stack in dev.
  const safeError: Record<string, unknown> = {
    name: err?.name,
    message: err?.message,
  };
  if (process.env.NODE_ENV !== "production") {
    safeError.stack = err?.stack;
  }

  res.status(statusCode).json({
    success: false,
    message: errMessage,
    error: safeError,
  });
}

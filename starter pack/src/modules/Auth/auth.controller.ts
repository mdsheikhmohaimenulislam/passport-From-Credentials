import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.service";
import catchAsync from "../../utils/catchAsync";

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthServices.register(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: user,
    });
  },
);

export const AuthControllers = {
  register,
};

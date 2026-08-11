import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import passport from "passport";
import { createUserTokens } from "../../halpers/authToken";
import { clearAuthCookie, setAuthCookie } from "../../halpers/authCookie";
import sendResponse from "../../utils/sendResponse";
import config from "../../config";

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

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      try {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(new Error(info?.message || "Invalid credential!"));
        }

        const userTokens = createUserTokens(user);
        setAuthCookie(res, userTokens);

        const { password, ...rest } = user;

        sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "User login Successfully",
          data: {
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            rest,
          },
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  },
);

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", async (err: any, user: any, info: any) => {
      try {
        if (err) {
          return next(
            new Error(err?.message || "Google Authentication failed"),
          );
        }
        if (!user) {
          return next(
            new Error(err?.message || "Google Authentication failed"),
          );
        }

        const userTokens = createUserTokens(user);
        setAuthCookie(res, userTokens);
        res.redirect(`${config.FRONTEND_URL}/auth/success`);
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  },
);

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    clearAuthCookie(res);

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User logout successfully",
      data: null,
    });
  },
);

export const AuthControllers = {
  register,
  credentialsLogin,
  googleCallback,
  logOut,
};

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { email, includes } from "zod";
import { prisma } from "../lib/prisma";
import bcryptjs from "bcryptjs";
import config from ".";
import { AuthProvider, Role } from "../../../generated/prisma/enums";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          were: {
            email,
          },
        });

        if (!user) {
          return done(null, false, {
            message: "User does not exists",
          });
        }

        if (!user.password) {
          return done(null, false, {
            message:
              "this account doest not have password, please login with google.",
          });
        }

        const isPasswordMatch = await bcryptjs.compare(password, user.password);

        if (!isPasswordMatch) {
          return done(null, false, {
            message: "password doest not match.",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CLIENT_CALLBACK_URL,
    },

    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      const email = profile.emails?.[0].value;

      if (!email) {
        return done(null, false, {
          message: "No email found from google",
        });
      }

      let user = await prisma.user.findUnique({
        were: {
          email,
        },
        include: {
          auths: true,
        },
      });

      if (user) {
        const googleAuth = user.auths.find(
          (auth: any) => auth.provider === AuthProvider.GOOGLE,
        );

        if (!googleAuth) {
          await prisma.auth.create({
            data: {
              provider: AuthProvider.GOOGLE,
              ProviderId: profile.id,
              userId: user.id,
            },
          });
        }
        return done(null, user);
      }

      user = await prisma.user.create({
        data: {
          name: profile.displayName,
          email: email,
          role: Role.USER,
          author: {
            create: {
              provider: AuthProvider.GOOGLE,
              providerId: profile.id,
            },
          },
        },
        include: {
          auths: true,
        },
      });

      return done(null,user)
    },
  ),
);

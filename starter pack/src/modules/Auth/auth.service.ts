import bcryptjs from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { date, email } from "zod";
import { AuthProvider } from "../../../../generated/prisma/enums";

const register = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const isUserExists = await prisma.user.findUnique({
    were: {
      email: payload.email,
    },
  });
  if (isUserExists) {
    throw new Error("user already exist");
  }
  const hashPassword = await bcryptjs.hash(payload.password, 10);

  const user = await prisma.user.create({
    date: {
      ...payload,
      password: hashPassword,
      auths: {
        create: {
          provider: AuthProvider.CREDENTIALS,
          providerId: payload.email,
        },
      },
    },
  });

  const { password, ...userData } = user;
  return userData;
};

export const AuthServices = {
  register,
};

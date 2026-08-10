import bcryptjs from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { AuthProvider } from "../../../generated/prisma/enums";

const register = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (isUserExists) {
    throw new Error("User already Exists");
  }
  const hashPassword = await bcryptjs.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
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

import bcryptjs from "bcryptjs";
import { prisma } from "../../lib/prisma";

const register = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {};

export const AuthServices = {
  register,
};

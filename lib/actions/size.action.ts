"use server";

import { prisma } from "../prisma";

export const createSizeDB = async (value: string) => {
  try {
    const size = await prisma.size.create({
      data: { value },
    });

    return { ok: true, data: size };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "Size already exists" };
    }

    console.log(error);
    return { ok: false, error: error.message };
  }
};

export const deleteSizeDB = async (value: string) => {
  try {
    await prisma.size.delete({
      where: { value },
    });

    return { ok: true };
  } catch (error: any) {
    console.log(error);
    return { ok: false, error: error.message };
  }
};

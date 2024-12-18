"use server";

import { prisma } from "../prisma";

export const addWareHouse = async (data: any) => {
  try {
    const warehouse = await prisma.wareHouse.create({
      data,
    });
    return { ok: true, data: warehouse };
  } catch (err: any) {
    console.log(err);
    if (err.code === "P2002") {
      return { ok: false, error: "Warehouse already exists" };
    }
    return { ok: false, error: "Something went wrong" };
  }
};

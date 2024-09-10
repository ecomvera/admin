// "use server";

// import { prisma } from "../prisma";

// export const createAttribute = async (key: string) => {
//   try {
//     await prisma.attribute.create({
//       data: {
//         key,
//         value: [],
//       },
//     });

//     return { ok: true };
//   } catch (error: any) {
//     if (error.code === "P2002") {
//       return { ok: false, error: "Attribute already exists" };
//     }

//     console.log(error);
//     return { ok: false, error: error.message };
//   }
// };

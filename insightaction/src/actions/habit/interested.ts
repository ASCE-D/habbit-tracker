import { prisma } from "../../utils/prismaDB";

export const addInterested = async (data: {
  features: string;
  email: string;
}) => {
  try {
    console.log(data);

    const result = await prisma.interested.create({
      data: {
        feature: data.features,
        email: data.email,
      },
    });
    console.log("result",result);
    return { success: true, data: result };
  } catch (error: any) {
    error.message || "Failed to update habit.";
  }
};

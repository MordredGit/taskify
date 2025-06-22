"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DeleteBoard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: ["Unauthorized"],
    };
  }

  const { id } = data;

  try {
    await db.board.delete({
      where: { id, orgId },
    });
  } catch (error) {
    console.error("Update failed because: ", error);
    return {
      error: ["Failed to Update"],
    };
  }

  // await new Promise((resolve) => setTimeout(resolve, 5000));
  revalidatePath(`/organization/${id}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);

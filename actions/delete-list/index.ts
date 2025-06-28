"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { List } from "@/lib/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { DeleteList } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: ["Unauthorized"],
    };
  }

  const { id, boardId } = data;
  let list: List;
  try {
    list = await db.list.delete({
      where: { id, boardId, board: { orgId } },
    });
  } catch (error) {
    console.error("Delete List failed because: ", error);
    return {
      error: ["Failed to Delete"],
    };
  }

  // await new Promise((resolve) => setTimeout(resolve, 5000));
  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const deleteList = createSafeAction(DeleteList, handler);

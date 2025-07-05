"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { addLog } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE, List } from "@prisma/client";
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

  addLog({
    entity: list,
    entityType: ENTITY_TYPE.LIST,
    action: ACTION.DELETE,
  });

  // await new Promise((resolve) => setTimeout(resolve, 5000));
  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const deleteList = createSafeAction(DeleteList, handler);

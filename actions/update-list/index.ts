"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { addLog } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { UpdateList } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: ["Unauthorized"],
    };
  }

  const { title, id, boardId } = data;
  let list;

  try {
    list = await db.list.update({
      where: { id, boardId, board: { orgId } },
      data: { title },
    });
  } catch (error) {
    console.error("Update failed because: ", error);
    return {
      error: ["Failed to Update"],
    };
  }

  addLog({
    entity: list,
    entityType: ENTITY_TYPE.LIST,
    action: ACTION.UPDATE,
  });

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const updateList = createSafeAction(UpdateList, handler);

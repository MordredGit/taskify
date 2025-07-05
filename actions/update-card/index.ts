"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { ACTION, ENTITY_TYPE } from "@/lib/generated/prisma";
import { addLog } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { UpdateCard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: ["Unauthorized"],
    };
  }

  const { id, boardId, ...values } = data;
  let card;

  try {
    card = await db.card.update({
      where: { id, list: { boardId, board: { orgId } } },
      data: { ...values },
    });
  } catch (error) {
    console.error("Update failed because: ", error);
    return {
      error: ["Failed to Update"],
    };
  }

  addLog({
    entity: card,
    entityType: ENTITY_TYPE.CARD,
    action: ACTION.UPDATE,
  });

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const updateCard = createSafeAction(UpdateCard, handler);

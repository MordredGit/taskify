"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { addLog } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { ACTION, Card, ENTITY_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { DeleteCard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: ["Unauthorized"],
    };
  }

  const { id, boardId } = data;
  let card: Card;
  try {
    card = await db.card.delete({
      where: { id, list: { boardId, board: { orgId } } },
    });
  } catch (error) {
    console.error("Delete card failed because: ", error);
    return {
      error: ["Failed to Delete"],
    };
  }

  addLog({
    entity: card,
    entityType: ENTITY_TYPE.CARD,
    action: ACTION.DELETE,
  });

  // await new Promise((resolve) => setTimeout(resolve, 5000));
  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const deleteCard = createSafeAction(DeleteCard, handler);

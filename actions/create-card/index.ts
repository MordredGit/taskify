"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { ACTION, ENTITY_TYPE } from "@/lib/generated/prisma";
import { addLog } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CreateCard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: ["Unauthorized"],
    };
  }

  const { title, boardId, listId } = data;
  let card;

  try {
    const list = db.list.findUnique({
      where: { id: listId, board: { orgId } },
    });
    if (!list) {
      return { error: ["List not found"] };
    }
    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const newOrder = lastCard ? lastCard.order + 1 : 1;
    card = await db.card.create({
      data: { title, description: "", listId, order: newOrder },
    });
  } catch (error) {
    console.error("Create failed because: ", error);
    return {
      error: ["Failed to create"],
    };
  }

  addLog({ entity: card, entityType: ENTITY_TYPE.CARD, action: ACTION.CREATE });
  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const createCard = createSafeAction(CreateCard, handler);

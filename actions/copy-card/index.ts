"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { ACTION, Card, ENTITY_TYPE } from "@/lib/generated/prisma";
import { addLog } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CopyCard } from "./schema";
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
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: { boardId, board: { orgId } },
      },
      include: { list: true },
    });
    if (!cardToCopy) {
      return { error: ["Card Not Found"] };
    }

    const lastCard = await db.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const newOrder = lastCard ? lastCard.order + 1 : 1;
    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        order: newOrder,
        listId: cardToCopy.listId,
      },
      include: {
        list: true,
      },
    });
  } catch (error) {
    console.error("Copy Card failed because: ", error);
    return {
      error: ["Failed to Copy"],
    };
  }

  addLog({ entity: card, entityType: ENTITY_TYPE.CARD, action: ACTION.CREATE });
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);

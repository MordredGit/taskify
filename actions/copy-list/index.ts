"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { List } from "@/lib/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CopyList } from "./schema";
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
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: { orgId },
      },
      include: { cards: true },
    });
    if (!listToCopy) {
      return { error: ["List Not Found"] };
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "asc" },
      select: { order: true },
    });
    const newOrder = lastList ? lastList.order + 1 : 1;
    list = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} - Copy`,
        order: newOrder,
        cards: {
          createMany: {
            data: listToCopy.cards.map((card) => ({
              title: card.title,
              description: card.description,
              order: card.order,
            })),
          },
        },
      },
      include: {
        cards: true,
      },
    });
  } catch (error) {
    console.error("Copy List failed because: ", error);
    return {
      error: ["Failed to Copy"],
    };
  }

  // await new Promise((resolve) => setTimeout(resolve, 5000));
  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);

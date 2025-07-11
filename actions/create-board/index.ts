"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { hasAvailableCount, incrementAvailableCount } from "@/lib/org-limits";
import { checkSubscription } from "@/lib/subscription";
import { addLog } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { CreateBoard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: ["Unauthorized"],
    };
  }

  const canCreate = await hasAvailableCount();
  const isPro = await checkSubscription();
  if (!canCreate && !isPro) {
    return {
      error: [
        "You have reached your limit of free boards. Please upgrade to create more.",
      ],
    };
  }

  const { title, image } = data;

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split("|");

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName
  ) {
    return {
      error: ["Missing fields. Failed to create board."],
    };
  }

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageFullUrl,
        imageLinkHTML,
        imageThumbUrl,
        imageUserName,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      error: ["Failed to create"],
    };
  }

  if (!isPro) {
    await incrementAvailableCount();
  }
  addLog({
    entity: board,
    entityType: ENTITY_TYPE.BOARD,
    action: ACTION.CREATE,
  });
  revalidatePath(`/board/${board.id}`);

  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);

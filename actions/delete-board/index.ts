"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { ACTION, ENTITY_TYPE } from "@/lib/generated/prisma";
import { decrementAvailableCount } from "@/lib/org-limits";
import { checkSubscription } from "@/lib/subscription";
import { addLog } from "@/lib/utils";
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

  const isPro = await checkSubscription();
  const { id } = data;
  let board;

  try {
    board = await db.board.delete({
      where: { id, orgId },
    });
  } catch (error) {
    console.error("Delete Board failed because: ", error);
    return {
      error: ["Failed to Delete"],
    };
  }

  if (!isPro) {
    await decrementAvailableCount();
  }
  addLog({
    entity: board,
    entityType: ENTITY_TYPE.BOARD,
    action: ACTION.DELETE,
  });
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  revalidatePath(`/organization/${id}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);

"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { UpdateBoard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: ["Unauthorized"],
    };
  }

  const { title, id } = data;
  let board;

  try {
    board = await db.board.update({
      where: { id, orgId },
      data: { title },
    });
  } catch (error) {
    console.error("Update failed because: ", error);
    return {
      error: ["Failed to Update"],
    };
  }

  revalidatePath(`/board/${id}`);
  return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);

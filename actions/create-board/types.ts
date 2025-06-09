import { ActionState } from "@/lib/create-safe-action";
import { Board } from "@/lib/generated/prisma";
import { z } from "zod";
import { CreateBoard } from "./schema";

export type InputType = z.infer<typeof CreateBoard>;
export type ReturnType = ActionState<InputType, Board>;

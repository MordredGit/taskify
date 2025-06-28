import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@/lib/generated/prisma";
import { z } from "zod";
import { CreateCard } from "./schema";

export type InputType = z.infer<typeof CreateCard>;
export type ReturnType = ActionState<InputType, Card>;

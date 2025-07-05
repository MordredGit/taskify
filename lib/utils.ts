import { ACTION, Board, Card, ENTITY_TYPE, List } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createAuditLog } from "./create-audit-log";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function addLog({
  entity,
  entityType,
  action,
}: {
  entity: Card | Board | List;
  entityType: ENTITY_TYPE;
  action: ACTION;
}) {
  try {
    if (entity) {
      await createAuditLog({
        entityId: entity.id,
        entityTitle: entity.title,
        entityType,
        action,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

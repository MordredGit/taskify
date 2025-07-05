import { Card, List } from "./lib/generated/prisma";

export type ListWithCards = List & { cards: Card[] };
export type CardWithList = Card & { list: List };

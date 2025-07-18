import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import startCase from "lodash.startcase";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/navbar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ boardId?: string }>;
}) {
  const { boardId } = await params;
  const { orgId } = await auth();
  if (!orgId) {
    return {
      title: "Board",
    };
  }

  const board = await db.board.findUnique({
    where: { id: boardId, orgId },
  });
  if (!board) {
    return {
      title: "Board",
    };
  }

  return {
    title: startCase(board.title || "Board"),
  };
}

const BoardIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ boardId?: string }>;
}) => {
  const { boardId } = await params;
  const { orgId } = await auth();
  if (!orgId) {
    redirect("/select-org");
  }

  const board = await db.board.findUnique({
    where: { id: boardId, orgId },
  });
  if (!board) {
    notFound();
  }

  return (
    <div
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
      className="relative h-full bg-no-repeat bg-cover bg-center"
    >
      <BoardNavbar board={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default BoardIdLayout;

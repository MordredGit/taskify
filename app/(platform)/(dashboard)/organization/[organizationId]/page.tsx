import { db } from "@/lib/db";
import { FormDelete } from "./_components/form-delete";
import { Form } from "./form";

const OrganizationIdPage = async () => {
  const boards = await db.board.findMany();
  return (
    <div className="flex flex-col space-y-4">
      <Form />{" "}
      <div className="space-y-2">
        {boards.map((board) => (
          <div key={board.title}>
            Board Title: {board.title} <FormDelete />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationIdPage;

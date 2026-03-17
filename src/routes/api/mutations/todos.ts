import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";
import { todoInsertSchema } from "@/db/zod-schemas";

export const Route = createFileRoute("/api/mutations/todos")({
	component: () => null,
	server: {
		handlers: {
			POST: async ({ request }) => {
				const raw = parseDates(await request.json());
				const body = todoInsertSchema.parse(raw);
				let txid!: number;
				const result = await db.transaction(async (tx) => {
					txid = await generateTxId(tx);
					const [todo] = await tx.insert(todos).values(body).returning();
					return todo;
				});
				return Response.json({ todo: result, txid });
			},
		},
	},
});

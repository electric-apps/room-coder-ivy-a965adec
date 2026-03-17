import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";

export const Route = createFileRoute("/api/mutations/todos/$id")({
	component: () => null,
	server: {
		handlers: {
			PATCH: async ({ request, params }) => {
				const { id } = params;
				const body = parseDates(await request.json());
				// Remove immutable fields
				const {
					id: _id,
					created_at: _ca,
					...updateData
				} = body as Record<string, unknown>;
				let txid!: number;
				const result = await db.transaction(async (tx) => {
					txid = await generateTxId(tx);
					const [todo] = await tx
						.update(todos)
						.set({ ...updateData, updated_at: new Date() })
						.where(eq(todos.id, id))
						.returning();
					return todo;
				});
				return Response.json({ todo: result, txid });
			},
			DELETE: async ({ params }) => {
				const { id } = params;
				let txid!: number;
				await db.transaction(async (tx) => {
					txid = await generateTxId(tx);
					await tx.delete(todos).where(eq(todos.id, id));
				});
				return Response.json({ txid });
			},
		},
	},
});

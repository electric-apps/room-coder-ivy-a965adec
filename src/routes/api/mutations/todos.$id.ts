import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";

const todoUpdateSchema = z.object({
	title: z.string().optional(),
	completed: z.boolean().optional(),
});

export const Route = createFileRoute("/api/mutations/todos/$id")({
	component: () => null,
	server: {
		handlers: {
			PATCH: async ({ request, params }) => {
				const { id } = params;
				const raw = parseDates(await request.json());
				const updateData = todoUpdateSchema.parse(raw);
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
				if (!result) {
					return new Response(JSON.stringify({ error: "Not found" }), {
						status: 404,
						headers: { "Content-Type": "application/json" },
					});
				}
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

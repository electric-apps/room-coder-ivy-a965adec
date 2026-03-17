import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { todoSelectSchema } from "@/db/zod-schemas";

export const todosCollection = createCollection(
	electricCollectionOptions({
		id: "todos",
		schema: todoSelectSchema,
		getKey: (item) => item.id,
		shapeOptions: {
			url: "/api/todos",
			parser: {
				timestamptz: (value: string) => new Date(value),
			},
		},
		onInsert: async ({ transaction }) => {
			const todo = transaction.mutations[0].modified;
			const res = await fetch("/api/mutations/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(todo),
			});
			if (!res.ok) throw new Error(`Insert failed: ${res.status}`);
			const data = await res.json();
			return { txid: data.txid };
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0];
			const res = await fetch(`/api/mutations/todos/${modified.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(modified),
			});
			if (!res.ok) throw new Error(`Update failed: ${res.status}`);
			const data = await res.json();
			return { txid: data.txid };
		},
		onDelete: async ({ transaction }) => {
			const id = transaction.mutations[0].key;
			const res = await fetch(`/api/mutations/todos/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
			const data = await res.json();
			return { txid: data.txid };
		},
	}),
);

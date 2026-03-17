import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { todos } from "./schema";

const timestampSchema = z.union([z.date(), z.string()]);

export const todoSelectSchema = createSelectSchema(todos, {
	created_at: timestampSchema,
	updated_at: timestampSchema,
});

export const todoInsertSchema = createInsertSchema(todos, {
	created_at: timestampSchema.optional(),
	updated_at: timestampSchema.optional(),
});

export type Todo = typeof todoSelectSchema._type;
export type NewTodo = typeof todoInsertSchema._type;

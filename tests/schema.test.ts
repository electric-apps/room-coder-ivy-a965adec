import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { todos } from "@/db/schema"
import { generateValidRow, generateRowWithout } from "./helpers/schema-test-utils"

describe("todos schema", () => {
	it("validates a valid todo row", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects a todo missing title", () => {
		const row = generateRowWithout(todoSelectSchema, "title")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("rejects a todo missing id", () => {
		const row = generateRowWithout(todoSelectSchema, "id")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("validates insert schema with optional timestamps", () => {
		const row = {
			id: crypto.randomUUID(),
			title: "Buy groceries",
			completed: false,
		}
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("accepts date objects for timestamps", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("accepts ISO strings for timestamps (JSON round-trip)", () => {
		const row = generateValidRow(todoSelectSchema)
		const serialized = JSON.parse(JSON.stringify(row))
		const result = todoSelectSchema.safeParse(serialized)
		expect(result.success).toBe(true)
	})
})

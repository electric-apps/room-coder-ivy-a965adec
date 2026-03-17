import {
	Box,
	Button,
	Card,
	Checkbox,
	Container,
	Flex,
	Heading,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCheck, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { todosCollection } from "@/db/collections/todos";

export const Route = createFileRoute("/")({
	ssr: false,
	loader: async () => {
		await todosCollection.preload();
		return null;
	},
	component: TodoPage,
});

function TodoPage() {
	const { data: todos, isLoading } = useLiveQuery(
		(q) =>
			q
				.from({ todo: todosCollection })
				.orderBy(({ todo }) => todo.created_at, "asc"),
		[],
	);

	const [input, setInput] = useState("");
	const [isAdding, setIsAdding] = useState(false);

	const pending = todos?.filter((t) => !t.completed) ?? [];
	const done = todos?.filter((t) => t.completed) ?? [];

	const handleAdd = async (e: React.FormEvent) => {
		e.preventDefault();
		const title = input.trim();
		if (!title) return;
		setIsAdding(true);
		setInput("");
		try {
			todosCollection.insert({
				id: crypto.randomUUID(),
				title,
				completed: false,
				created_at: new Date(),
				updated_at: new Date(),
			});
		} finally {
			setIsAdding(false);
		}
	};

	const handleToggle = (id: string, completed: boolean) => {
		todosCollection.update(id, (draft) => {
			draft.completed = !completed;
			draft.updated_at = new Date();
		});
	};

	const handleDelete = (id: string) => {
		todosCollection.delete(id);
	};

	const handleClearDone = () => {
		for (const t of done) {
			todosCollection.delete(t.id);
		}
	};

	if (isLoading) {
		return (
			<Container size="2" py="9">
				<Flex align="center" justify="center" style={{ minHeight: "60vh" }}>
					<Text color="gray" size="2">
						Loading…
					</Text>
				</Flex>
			</Container>
		);
	}

	return (
		<Container size="2" py="8" px="4">
			<Flex direction="column" gap="6">
				{/* Header */}
				<Flex direction="column" gap="1">
					<Heading
						size="8"
						style={{
							fontFamily: "var(--font-fraunces, var(--default-font-family))",
							letterSpacing: "-0.02em",
						}}
					>
						My Todos
					</Heading>
					<Text color="gray" size="2">
						{pending.length} remaining · {done.length} completed
					</Text>
				</Flex>

				{/* Add form */}
				<form onSubmit={handleAdd}>
					<Flex gap="2">
						<Box flexGrow="1">
							<TextField.Root
								size="3"
								placeholder="Add a new task…"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								disabled={isAdding}
								autoFocus
							/>
						</Box>
						<Button size="3" type="submit" disabled={!input.trim() || isAdding}>
							<Plus size={16} />
							Add
						</Button>
					</Flex>
				</form>

				{/* Todo list */}
				{todos?.length === 0 ? (
					<Card>
						<Flex direction="column" align="center" gap="3" py="6">
							<CheckCheck size={32} color="var(--gray-9)" />
							<Text color="gray" size="2">
								No tasks yet. Add one above!
							</Text>
						</Flex>
					</Card>
				) : (
					<Flex direction="column" gap="4">
						{/* Pending tasks */}
						{pending.length > 0 && (
							<Flex direction="column" gap="2">
								{pending.map((todo) => (
									<Card key={todo.id} variant="surface">
										<Flex align="center" gap="3" px="1">
											<Checkbox
												size="2"
												checked={todo.completed}
												onCheckedChange={() =>
													handleToggle(todo.id, todo.completed)
												}
											/>
											<Text size="3" style={{ flex: 1 }}>
												{todo.title}
											</Text>
											<Button
												variant="ghost"
												color="gray"
												size="1"
												onClick={() => handleDelete(todo.id)}
											>
												<Trash2 size={14} />
											</Button>
										</Flex>
									</Card>
								))}
							</Flex>
						)}

						{/* Completed tasks */}
						{done.length > 0 && (
							<Flex direction="column" gap="2">
								<Flex align="center" justify="between">
									<Text
										size="1"
										color="gray"
										weight="medium"
										style={{
											textTransform: "uppercase",
											letterSpacing: "0.05em",
										}}
									>
										Completed
									</Text>
									<Button
										variant="ghost"
										color="gray"
										size="1"
										onClick={handleClearDone}
									>
										Clear all
									</Button>
								</Flex>
								{done.map((todo) => (
									<Card key={todo.id} variant="surface">
										<Flex align="center" gap="3" px="1">
											<Checkbox
												size="2"
												checked={todo.completed}
												onCheckedChange={() =>
													handleToggle(todo.id, todo.completed)
												}
											/>
											<Text
												size="3"
												color="gray"
												style={{ flex: 1, textDecoration: "line-through" }}
											>
												{todo.title}
											</Text>
											<Button
												variant="ghost"
												color="gray"
												size="1"
												onClick={() => handleDelete(todo.id)}
											>
												<Trash2 size={14} />
											</Button>
										</Flex>
									</Card>
								))}
							</Flex>
						)}
					</Flex>
				)}
			</Flex>
		</Container>
	);
}

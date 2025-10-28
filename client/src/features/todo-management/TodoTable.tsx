import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/shared/DataTable";
import { Todo } from "@/lib/validators";
import { EditTodoDialog } from "./EditTodoDialog";
import { DeleteTodoDialog } from "./DeleteTodoDialog";
import { useCompleteTodo, useGetAllTodos } from "@/api/todos";

export function TodoTable() {
  const { data: todos, isLoading, isError } = useGetAllTodos();
  const completeTodoMutation = useCompleteTodo();

  const handleToggleComplete = (todoId: string, currentStatus: string) => {
    // As per OpenAPI spec, there's only a /complete-todo endpoint.
    // It is assumed this endpoint marks a todo as complete.
    // There is no /uncomplete-todo or a way to set isCompleted to 'false' via API.
    // So, this checkbox will only trigger `completeTodo` if the todo is not yet completed.
    if (currentStatus === 'false') {
      completeTodoMutation.mutate({ id: todoId });
    }
    // If it's already 'true', the checkbox is just displayed as checked and is effectively disabled from further interaction.
  };

  const columns = [
    {
      accessorKey: "isCompleted",
      header: "Completed",
      cell: (row: Todo) => (
        <Checkbox
          checked={row.isCompleted === 'true'}
          onCheckedChange={() => handleToggleComplete(row.id, row.isCompleted)}
          aria-label="Toggle completion status"
          disabled={row.isCompleted === 'true' || completeTodoMutation.isPending}
        />
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (row: Todo) => (
        <span className={row.isCompleted === 'true' ? "line-through text-muted-foreground" : ""}>
          {row.description}
        </span>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: Todo) => (
        <div className="flex items-center space-x-2">
          <EditTodoDialog todo={row} />
          <DeleteTodoDialog todo={row} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={todos || []}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="No todos found. Start by creating one!"
    />
  );
}
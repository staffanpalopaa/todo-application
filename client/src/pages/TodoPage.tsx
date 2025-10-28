import { CreateTodoDialog } from "@/features/todo-management/CreateTodoDialog";
import { TodoTable } from "@/features/todo-management/TodoTable";
import { Separator } from "@/components/ui/separator";

const TodoPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Todo List</h1>
        <CreateTodoDialog />
      </div>
      <Separator className="mb-6" />
      <TodoTable />
    </div>
  );
};

export default TodoPage;
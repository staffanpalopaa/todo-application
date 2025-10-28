import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Todo,
  CreateTodoPayload,
  UpdateTodoPayload,
  CompleteTodoPayload,
  DeleteTodoPayload,
} from "@/lib/validators";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Helper for showing toasts
const showToast = (toast: ReturnType<typeof useToast>['toast'], title: string, description?: string) => {
  toast({
    title,
    description,
  });
};

export const useGetAllTodos = () => {
  const { toast } = useToast();
  return useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: () => api.get<Todo[]>("/get-all-todos"),
    onError: (error) => {
      showToast(toast, "Error fetching todos", error.message);
    },
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<Todo, Error, CreateTodoPayload>({
    mutationFn: (newTodo) => api.post<Todo>("/create-todo", newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      showToast(toast, "Success!", "Todo created successfully.");
    },
    onError: (error) => {
      showToast(toast, "Error creating todo", error.message);
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<Todo, Error, UpdateTodoPayload>({
    mutationFn: (updatedTodo) => api.post<Todo>("/update-todo", updatedTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      showToast(toast, "Success!", "Todo updated successfully.");
    },
    onError: (error) => {
      showToast(toast, "Error updating todo", error.message);
    },
  });
};

export const useCompleteTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<Todo, Error, CompleteTodoPayload>({
    mutationFn: (completeTodoData) =>
      api.post<Todo>("/complete-todo", completeTodoData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      const status = data.isCompleted === 'true' ? 'completed' : 'updated';
      showToast(toast, "Success!", `Todo marked as ${status}.`);
    },
    onError: (error) => {
      showToast(toast, "Error completing todo", error.message);
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<Todo, Error, DeleteTodoPayload>({
    mutationFn: (deleteTodoData) =>
      api.post<Todo>("/delete-todo", deleteTodoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      showToast(toast, "Success!", "Todo deleted successfully.");
    },
    onError: (error) => {
      showToast(toast, "Error deleting todo", error.message);
    },
  });
};
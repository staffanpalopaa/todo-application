import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pen } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Todo, UpdateTodoPayload, updateTodoRequestSchema } from "@/lib/validators";
import { useUpdateTodo } from "@/api/todos";

interface EditTodoDialogProps {
  todo: Todo;
}

export function EditTodoDialog({ todo }: EditTodoDialogProps) {
  const [open, setOpen] = useState(false);
  const updateTodoMutation = useUpdateTodo();

  const form = useForm<UpdateTodoPayload>({
    resolver: zodResolver(updateTodoRequestSchema),
    defaultValues: {
      id: todo.id,
      description: todo.description,
    },
  });

  useEffect(() => {
    if (todo) {
      form.reset({ id: todo.id, description: todo.description });
    }
  }, [todo, form]);

  const onSubmit = (values: UpdateTodoPayload) => {
    updateTodoMutation.mutate(values, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>
            Make changes to your todo item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Buy groceries" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={updateTodoMutation.isPending}>
              {updateTodoMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
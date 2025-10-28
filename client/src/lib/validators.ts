import { z } from "zod";

// --- API Schemas based on OpenAPI ---

export const todoSchema = z.object({
  id: z.string().min(1, "ID is required"),
  description: z.string().min(1, "Description is required"),
  isCompleted: z.string().transform((val) => val === 'true' ? 'true' : 'false'), // Ensure it's 'true' or 'false'
});

export const createTodoRequestSchema = z.object({
  description: z.string().min(1, "Description is required"),
});

export const updateTodoRequestSchema = z.object({
  id: z.string().min(1, "ID is required"),
  description: z.string().min(1, "Description is required"),
});

export const completeTodoRequestSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export const deleteTodoRequestSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// --- Types for Frontend Usage ---
export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoPayload = z.infer<typeof createTodoRequestSchema>;
export type UpdateTodoPayload = z.infer<typeof updateTodoRequestSchema>;
export type CompleteTodoPayload = z.infer<typeof completeTodoRequestSchema>;
export type DeleteTodoPayload = z.infer<typeof deleteTodoRequestSchema>;
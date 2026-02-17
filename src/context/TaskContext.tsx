import React, { createContext, useContext, type ReactNode } from "react";
import { type Task } from "../types/task";
import { usePersistedReducer } from "../hooks/usePersistedState";

// ─── Action Types ────────────────────────────────────────────────
type TaskAction =
  | { type: "ADD_TASK"; payload: { title: string } }
  | { type: "TOGGLE_TASK"; payload: { id: string } }
  | { type: "DELETE_TASK"; payload: { id: string } }
  | { type: "UPDATE_TASK"; payload: { id: string; title: string } };

// ─── Reducer ─────────────────────────────────────────────────────
function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "ADD_TASK":
      return [
        ...state,
        {
          id: Date.now().toString(),
          title: action.payload.title,
          completed: false,
        },
      ];

    case "TOGGLE_TASK":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: !task.completed }
          : task
      );

    case "DELETE_TASK":
      return state.filter((task) => task.id !== action.payload.id);

    case "UPDATE_TASK":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, title: action.payload.title }
          : task
      );

    default:
      return state;
  }
}

// ─── Context Shape ───────────────────────────────────────────────
const STORAGE_KEY = "@tasks";

interface TaskContextValue {
  tasks: Task[];
  hydrated: boolean;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, title: string) => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch, hydrated] = usePersistedReducer(taskReducer, [], STORAGE_KEY);

  const addTask = (title: string) =>
    dispatch({ type: "ADD_TASK", payload: { title } });

  const toggleTask = (id: string) =>
    dispatch({ type: "TOGGLE_TASK", payload: { id } });

  const deleteTask = (id: string) =>
    dispatch({ type: "DELETE_TASK", payload: { id } });

  const updateTask = (id: string, title: string) =>
    dispatch({ type: "UPDATE_TASK", payload: { id, title } });

  return (
    <TaskContext.Provider
      value={{ tasks, hydrated, addTask, toggleTask, deleteTask, updateTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// ─── Custom Hook ─────────────────────────────────────────────────
export function useTasks(): TaskContextValue {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a <TaskProvider>");
  }
  return context;
}

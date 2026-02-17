import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
  TaskDetail: { taskId: string };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;
export type AddTaskScreenProps = NativeStackScreenProps<RootStackParamList, "AddTask">;
export type TaskDetailScreenProps = NativeStackScreenProps<RootStackParamList, "TaskDetail">;

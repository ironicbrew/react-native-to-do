import { StatusBar } from "expo-status-bar";
import { TaskProvider } from "./src/context/TaskContext";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <TaskProvider>
      <AppNavigator />
      <StatusBar style="dark" />
    </TaskProvider>
  );
}

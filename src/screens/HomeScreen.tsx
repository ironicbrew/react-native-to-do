import { useMemo } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTasks } from "../context/TaskContext";
import { TaskItem } from "../components/TaskItem";
import { EmptyState } from "../components/EmptyState";
import { colors } from "../constants/colors";
import type { HomeScreenProps } from "../navigation/types";
import type { Task } from "../types/task";

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { tasks, hydrated, toggleTask } = useTasks();

  const pendingTasks = useMemo(
    () => tasks.filter((t) => !t.completed),
    [tasks]
  );

  const completedTasks = useMemo(
    () => tasks.filter((t) => t.completed),
    [tasks]
  );

  if (!hydrated) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={() => toggleTask(item.id)}
      onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
    />
  );

  const sections = [
    ...(pendingTasks.length > 0
      ? [{ title: "To Do", data: pendingTasks }]
      : []),
    ...(completedTasks.length > 0
      ? [{ title: "Done", data: completedTasks }]
      : []),
  ];

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(section) => section.title}
          renderItem={({ item: section }) => (
            <View>
              <Text style={styles.sectionHeader}>{section.title}</Text>
              {section.data.map((task) => (
                <View key={task.id}>{renderItem({ item: task })}</View>
              ))}
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => navigation.navigate("AddTask")}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  fabPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.95 }],
  },
  fabText: {
    fontSize: 28,
    color: colors.textInverse,
    fontWeight: "300",
    marginTop: -1,
  },
});

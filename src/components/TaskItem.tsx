import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import type { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onPress: () => void;
}

export function TaskItem({ task, onToggle, onPress }: TaskItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      {/* Checkbox */}
      <Pressable
        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        onPress={onToggle}
        hitSlop={8}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>

      {/* Title */}
      <Text
        style={[styles.title, task.completed && styles.titleCompleted]}
        numberOfLines={1}
      >
        {task.title}
      </Text>

      {/* Chevron */}
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: "700",
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: colors.textTertiary,
  },
  chevron: {
    fontSize: 22,
    color: colors.textTertiary,
    marginLeft: 8,
  },
});

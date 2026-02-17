import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTasks } from "../context/TaskContext";
import { colors } from "../constants/colors";
import type { TaskDetailScreenProps } from "../navigation/types";

export function TaskDetailScreen({ route, navigation }: TaskDetailScreenProps) {
  const { taskId } = route.params;
  const { tasks, toggleTask, updateTask, deleteTask } = useTasks();
  const task = tasks.find((t) => t.id === taskId);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.title ?? "");

  if (!task) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText}>Task not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    const trimmed = editTitle.trim();
    if (!trimmed) {
      Alert.alert("Oops", "Task title cannot be empty.");
      return;
    }
    updateTask(task.id, trimmed);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert("Delete Task", `Delete "${task.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Status badge */}
      <View style={[styles.badge, task.completed && styles.badgeDone]}>
        <Text style={[styles.badgeText, task.completed && styles.badgeTextDone]}>
          {task.completed ? "Completed" : "Pending"}
        </Text>
      </View>

      {/* Title */}
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={editTitle}
          onChangeText={setEditTitle}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSave}
          maxLength={200}
        />
      ) : (
        <Text style={[styles.title, task.completed && styles.titleDone]}>
          {task.title}
        </Text>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {isEditing ? (
          <>
            <ActionButton
              label="Save"
              color={colors.primary}
              onPress={handleSave}
            />
            <ActionButton
              label="Cancel"
              color={colors.textSecondary}
              onPress={() => {
                setEditTitle(task.title);
                setIsEditing(false);
              }}
            />
          </>
        ) : (
          <>
            <ActionButton
              label={task.completed ? "Mark Pending" : "Mark Done"}
              color={colors.primary}
              onPress={() => toggleTask(task.id)}
            />
            <ActionButton
              label="Edit"
              color={colors.accent}
              onPress={() => setIsEditing(true)}
            />
            <ActionButton
              label="Delete"
              color={colors.error}
              onPress={handleDelete}
            />
          </>
        )}
      </View>
    </View>
  );
}

// ─── Inline Action Button ─────────────────────────────────────────
function ActionButton({
  label,
  color,
  onPress,
}: {
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionBtn,
        { borderColor: color },
        pressed && { backgroundColor: color, opacity: 0.9 },
      ]}
      onPress={onPress}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.actionBtnText,
            { color: pressed ? colors.textInverse : color },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  notFoundText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.warning + "30",
    marginBottom: 20,
  },
  badgeDone: {
    backgroundColor: colors.success + "30",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.warning,
  },
  badgeTextDone: {
    color: colors.success,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 32,
    lineHeight: 32,
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: colors.textTertiary,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 32,
  },
  actions: {
    gap: 12,
  },
  actionBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
});

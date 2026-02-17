import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTasks } from "../context/TaskContext";
import { colors } from "../constants/colors";
import type { AddTaskScreenProps } from "../navigation/types";

export function AddTaskScreen({ navigation }: AddTaskScreenProps) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      Alert.alert("Oops", "Please enter a task title.");
      return;
    }
    addTask(trimmed);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.form}>
        <Text style={styles.label}>What do you need to do?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Buy groceries"
          placeholderTextColor={colors.textTertiary}
          value={title}
          onChangeText={setTitle}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSave}
          maxLength={200}
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            !title.trim() && styles.buttonDisabled,
            pressed && title.trim() ? styles.buttonPressed : undefined,
          ]}
          onPress={handleSave}
          disabled={!title.trim()}
        >
          <Text style={styles.buttonText}>Add Task</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: "600",
  },
});

import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <View className="flex-row items-end gap-2 px-4 py-3 border-t border-surface-border bg-dark-300">
      <TextInput
        className="flex-1 bg-surface-card border border-surface-border rounded-2xl px-4 py-3 text-sm text-text-primary max-h-24"
        placeholder="Mensagem..."
        placeholderTextColor="#6B6B73"
        value={text}
        onChangeText={setText}
        multiline
        editable={!disabled}
      />
      <Pressable
        onPress={handleSend}
        disabled={!text.trim() || disabled}
        className={`w-11 h-11 rounded-xl items-center justify-center ${
          text.trim() ? "bg-violet-400 active:bg-violet-500" : "bg-surface-border"
        }`}
      >
        <Text className={`text-lg ${text.trim() ? "text-dark-400" : "text-text-muted"}`}>↑</Text>
      </Pressable>
    </View>
  );
}

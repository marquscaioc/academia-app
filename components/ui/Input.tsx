import { useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? "border-danger-500"
    : focused
      ? "border-violet-500"
      : "border-surface-border";

  return (
    <View>
      {label ? (
        <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
          {label}
        </Text>
      ) : null}
      <TextInput
        className={`border-2 ${borderColor} rounded-2xl px-5 py-4 text-base text-text-primary bg-surface-card`}
        placeholderTextColor="#6E6580"
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error ? (
        <Text className="text-xs text-danger-500 mt-1.5 ml-1">{error}</Text>
      ) : helperText ? (
        <Text className="text-xs text-text-muted mt-1.5 ml-1">{helperText}</Text>
      ) : null}
    </View>
  );
}

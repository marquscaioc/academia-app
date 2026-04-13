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
      ? "border-primary-500"
      : "border-gray-300";

  return (
    <View>
      {label ? (
        <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">
          {label}
        </Text>
      ) : null}
      <TextInput
        className={`border ${borderColor} rounded-xl px-4 py-3.5 text-base text-gray-900 bg-gray-50`}
        placeholderTextColor="#9ca3af"
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
        <Text className="text-xs text-danger-500 mt-1 ml-1">{error}</Text>
      ) : helperText ? (
        <Text className="text-xs text-gray-400 mt-1 ml-1">{helperText}</Text>
      ) : null}
    </View>
  );
}

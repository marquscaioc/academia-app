import { useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { font } from "../../lib/design/tokens";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  const ring = error
    ? "border-danger-500/70"
    : focused
      ? "border-violet-400/80"
      : "border-surface-border";

  return (
    <View>
      {label ? (
        <Text
          className="text-[11px] text-text-muted mb-2 ml-0.5 uppercase"
          style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        className={`border ${ring} rounded-2xl px-4 py-3.5 text-[15px] text-text-primary bg-surface-card/80`}
        style={{ fontFamily: font.regular }}
        placeholderTextColor="#6E6382"
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
        <Text className="text-xs text-danger-500 mt-1.5 ml-0.5" style={{ fontFamily: font.medium }}>
          {error}
        </Text>
      ) : helperText ? (
        <Text className="text-xs text-text-muted mt-1.5 ml-0.5" style={{ fontFamily: font.regular }}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

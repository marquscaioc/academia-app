import { Pressable, View } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "default" | "elevated" | "outlined";
  className?: string;
}

export function Card({ children, onPress, variant = "default", className = "" }: CardProps) {
  const variantStyles = {
    default: "bg-surface-card rounded-2xl p-5",
    elevated: "bg-surface-elevated rounded-2xl p-5",
    outlined: "bg-surface-card border border-surface-border rounded-2xl p-5",
  };

  const style = `${variantStyles[variant]} ${className}`;

  if (onPress) {
    return (
      <Pressable onPress={onPress} className={`${style} active:bg-surface-hover`}>
        {children}
      </Pressable>
    );
  }

  return <View className={style}>{children}</View>;
}

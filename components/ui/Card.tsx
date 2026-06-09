import { Pressable, View } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "default" | "elevated" | "outlined";
  className?: string;
}

// Editorial Amethyst: hairline-defined surfaces, generous radius, quiet depth.
const variantStyles = {
  default: "bg-surface-card border border-surface-border/70 rounded-3xl p-5",
  elevated: "bg-surface-elevated border border-surface-border rounded-3xl p-5",
  outlined: "bg-transparent border border-surface-border rounded-3xl p-5",
};

export function Card({ children, onPress, variant = "default", className = "" }: CardProps) {
  const style = `${variantStyles[variant]} ${className}`;

  if (onPress) {
    return (
      <Pressable onPress={onPress} className={`${style} active:bg-surface-hover active:border-violet-500/40`}>
        {children}
      </Pressable>
    );
  }

  return <View className={style}>{children}</View>;
}

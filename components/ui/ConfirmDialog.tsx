import { Modal, Pressable, Text, View } from "react-native";
import { font } from "../../lib/design/tokens";
import { Button } from "./Button";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Cross-platform confirmation (Alert.alert does not render on react-native-web).
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View className="flex-1 items-center justify-center px-6">
        {/* Backdrop is a sibling (not a wrapper) so screen readers don't see the dialog inside a button. */}
        <Pressable
          onPress={loading ? undefined : onCancel}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          className="absolute inset-0 bg-black/70"
        />
        <View
          accessibilityRole="alert"
          accessibilityViewIsModal
          aria-modal
          aria-label={title}
          className="w-full max-w-[420px] bg-surface-elevated border border-surface-border rounded-3xl p-6"
        >
          <Text className="text-text-primary text-lg mb-2" style={{ fontFamily: font.semibold }}>
            {title}
          </Text>
          {message ? (
            <Text className="text-text-secondary text-sm leading-5 mb-6" style={{ fontFamily: font.regular }}>
              {message}
            </Text>
          ) : (
            <View className="h-4" />
          )}
          <View className="gap-3">
            <Button
              title={confirmLabel}
              onPress={onConfirm}
              variant={destructive ? "danger" : "primary"}
              loading={loading}
            />
            <Button title={cancelLabel} onPress={onCancel} variant="ghost" disabled={loading} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

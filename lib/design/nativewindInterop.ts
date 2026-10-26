// NativeWind only maps `className` → `style` for components it knows about. Reanimated's animated
// components are not registered by default, so `className` on <Animated.View> (margins, flex-row, gaps…)
// was silently dropped, gluing sections together and breaking row layouts. Imported once from app/_layout.tsx.
import Animated from "react-native-reanimated";
import { cssInterop } from "nativewind";

cssInterop(Animated.View, { className: "style" });
cssInterop(Animated.Text, { className: "style" });
cssInterop(Animated.ScrollView, { className: "style", contentContainerClassName: "contentContainerStyle" });

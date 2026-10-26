import { Pressable, Text, View } from "react-native";
import { useState } from "react";

interface WorkoutCalendarProps {
  trainedDates: Set<string>;
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function WorkoutCalendar({ trainedDates }: WorkoutCalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());

  const monthNames = [
    "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const trainedCount = Array.from({ length: daysInMonth }, (_, i) =>
    trainedDates.has(formatDateKey(year, month, i + 1)) ? 1 : 0,
  ).reduce<number>((a, b) => a + b, 0);

  return (
    <View className="bg-surface-card border border-surface-border rounded-2xl p-5">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={prevMonth} className="px-3 py-1">
          <Text className="text-text-muted font-bold">←</Text>
        </Pressable>
        <View className="items-center">
          <Text className="text-sm font-black text-text-primary">
            {monthNames[month]} {year}
          </Text>
          <Text className="text-[10px] text-violet-400 font-bold mt-0.5">
            {trainedCount} treino{trainedCount !== 1 ? "s" : ""}
          </Text>
        </View>
        <Pressable onPress={nextMonth} className="px-3 py-1">
          <Text className="text-text-muted font-bold">→</Text>
        </Pressable>
      </View>

      {/* Weekday headers */}
      <View className="flex-row mb-2">
        {WEEKDAYS.map((d, i) => (
          <View key={i} className="flex-1 items-center">
            <Text className="text-[10px] text-text-muted font-bold">{d}</Text>
          </View>
        ))}
      </View>

      {/* Days grid */}
      <View className="flex-row flex-wrap">
        {Array.from({ length: firstDay }).map((_, i) => (
          <View key={`empty-${i}`} className="w-[14.28%] aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateKey = formatDateKey(year, month, day);
          const isTrained = trainedDates.has(dateKey);
          const isToday = dateKey === today;

          return (
            <View key={day} className="w-[14.28%] aspect-square items-center justify-center p-0.5">
              <View
                className={`w-9 h-9 rounded-xl items-center justify-center ${
                  isTrained
                    ? "bg-violet-500"
                    : isToday
                      ? "border-2 border-violet-500/40"
                      : ""
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isTrained ? "text-white" : isToday ? "text-violet-400" : "text-text-secondary"
                  }`}
                >
                  {day}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

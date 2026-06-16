import React, { useState, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppIcon } from "../ui";
import { font, palette } from "../../lib/design/tokens";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  flex?: number;
}

export interface AdminTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  pageSize?: number;
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onCreate?: () => void;
  createLabel?: string;
  emptyMessage?: string;
}

type SortDir = "asc" | "desc";

export function AdminTable<T extends object>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = "Buscar...",
  searchFilter,
  pageSize = 10,
  loading = false,
  onEdit,
  onDelete,
  onCreate,
  createLabel = "Item",
  emptyMessage = "Nenhum item encontrado.",
}: AdminTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!query.trim() || !searchFilter) return data;
    return data.filter((item) => searchFilter(item, query.toLowerCase()));
  }, [data, query, searchFilter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];
      const as = av == null ? "" : String(av).toLowerCase();
      const bs = bv == null ? "" : String(bv).toLowerCase();
      if (as < bs) return sortDir === "asc" ? -1 : 1;
      if (as > bs) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  function handleSearch(text: string) {
    setQuery(text);
    setPage(0);
  }

  const showActions = !!(onEdit || onDelete);
  const actionsWidth = onEdit && onDelete ? 140 : 72;

  return (
    <View className="flex-1">
      {/* Toolbar */}
      <View className="flex-row items-center gap-3 mb-4">
        {/* Search */}
        <View className="flex-1 flex-row items-center gap-2 bg-surface-card border border-surface-border rounded-xl px-3 h-10">
          <AppIcon name="search" size={15} color={palette.textMuted} strokeWidth={2} />
          <TextInput
            value={query}
            onChangeText={handleSearch}
            placeholder={searchPlaceholder}
            placeholderTextColor={palette.textMuted}
            className="flex-1 text-text-primary text-sm"
            style={{ fontFamily: font.regular, outlineWidth: 0 } as object}
          />
          {query.length > 0 && (
            <Pressable onPress={() => handleSearch("")}>
              <AppIcon name="close" size={14} color={palette.textMuted} strokeWidth={2.5} />
            </Pressable>
          )}
        </View>

        {/* Create button */}
        {onCreate && (
          <Pressable onPress={onCreate}>
            <LinearGradient
              colors={["#781BB6", "#C636E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <AppIcon name="plus" size={14} color="#fff" strokeWidth={2.5} />
              <Text style={{ fontFamily: font.semibold, color: "#fff", fontSize: 13 }}>
                Criar {createLabel}
              </Text>
            </LinearGradient>
          </Pressable>
        )}
      </View>

      {/* Table */}
      <View className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ minWidth: "100%" }}>
            {/* Header */}
            <View className="flex-row bg-dark-200 border-b border-surface-border px-4 py-3">
              {columns.map((col) => (
                <Pressable
                  key={col.key}
                  style={{ flex: col.flex ?? 1, minWidth: 80 }}
                  onPress={col.sortable ? () => handleSort(col.key) : undefined}
                  className="flex-row items-center gap-1 pr-2"
                >
                  <Text
                    className="text-[11px] text-text-muted uppercase"
                    style={{ fontFamily: font.semibold, letterSpacing: 0.8 }}
                  >
                    {col.label}
                  </Text>
                  {col.sortable && (
                    <AppIcon
                      name="chevron-down"
                      size={11}
                      color={sortKey === col.key ? palette.violet400 : palette.textMuted}
                      strokeWidth={2.5}
                    />
                  )}
                </Pressable>
              ))}
              {showActions && (
                <View style={{ width: actionsWidth }} className="items-end">
                  <Text
                    className="text-[11px] text-text-muted uppercase"
                    style={{ fontFamily: font.semibold, letterSpacing: 0.8 }}
                  >
                    Ações
                  </Text>
                </View>
              )}
            </View>

            {/* Body */}
            {loading ? (
              <View className="py-16 items-center justify-center">
                <ActivityIndicator color={palette.violet400} size="small" />
              </View>
            ) : pageItems.length === 0 ? (
              <View className="py-16 items-center justify-center gap-3">
                <AppIcon name="list" size={32} color={palette.textMuted} strokeWidth={1.5} />
                <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>
                  {emptyMessage}
                </Text>
              </View>
            ) : (
              pageItems.map((item, index) => {
                const isOdd = index % 2 === 1;
                return (
                  <View
                    key={keyExtractor(item)}
                    className={`flex-row items-center px-4 py-3 border-b border-surface-border/50 ${isOdd ? "bg-white/[0.02]" : ""}`}
                  >
                    {columns.map((col) => (
                      <View key={col.key} style={{ flex: col.flex ?? 1, minWidth: 80 }} className="pr-2">
                        {col.render ? (
                          col.render(item)
                        ) : (
                          <Text
                            className="text-sm text-text-primary"
                            style={{ fontFamily: font.regular }}
                            numberOfLines={1}
                          >
                            {String((item as Record<string, unknown>)[col.key] ?? "")}
                          </Text>
                        )}
                      </View>
                    ))}
                    {showActions && (
                      <View
                        style={{ width: actionsWidth }}
                        className="flex-row items-center justify-end gap-2"
                      >
                        {onEdit && (
                          <Pressable
                            onPress={() => onEdit(item)}
                            className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20"
                          >
                            <AppIcon name="pencil" size={12} color={palette.violet400} strokeWidth={2.5} />
                            <Text
                              className="text-violet-400 text-[11px]"
                              style={{ fontFamily: font.semibold }}
                            >
                              Editar
                            </Text>
                          </Pressable>
                        )}
                        {onDelete && (
                          <Pressable
                            onPress={() => onDelete(item)}
                            className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg bg-danger-500/10 border border-danger-500/20"
                          >
                            <AppIcon name="trash" size={12} color={palette.danger} strokeWidth={2.5} />
                            <Text
                              className="text-danger-500 text-[11px]"
                              style={{ fontFamily: font.semibold }}
                            >
                              Excluir
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>

        {/* Pagination */}
        {!loading && sorted.length > 0 && (
          <View className="flex-row items-center justify-between px-4 py-3 border-t border-surface-border bg-dark-200/60">
            <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
              {sorted.length} {sorted.length === 1 ? "item" : "itens"}
            </Text>
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                className={`px-3 py-1.5 rounded-lg border ${
                  safePage === 0
                    ? "border-surface-border/40 opacity-40"
                    : "border-surface-border bg-surface-card active:bg-surface-hover"
                }`}
              >
                <Text className="text-xs text-text-secondary" style={{ fontFamily: font.medium }}>
                  Anterior
                </Text>
              </Pressable>
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                Página {safePage + 1} de {totalPages}
              </Text>
              <Pressable
                onPress={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={safePage >= totalPages - 1}
                className={`px-3 py-1.5 rounded-lg border ${
                  safePage >= totalPages - 1
                    ? "border-surface-border/40 opacity-40"
                    : "border-surface-border bg-surface-card active:bg-surface-hover"
                }`}
              >
                <Text className="text-xs text-text-secondary" style={{ fontFamily: font.medium }}>
                  Próximo
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

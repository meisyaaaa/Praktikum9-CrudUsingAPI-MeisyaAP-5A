import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import DiaryCard from "../../src/components/DiaryCard";
import { fetchDiaries, toggleLike } from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import type { DiaryEntry } from "../../src/services/diaryApi";

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { entries, searchResults, loading, error, likingIds } = useAppSelector(
    (state) => state.diary
  );

  const [search, setSearch] = useState("");
  const searchRef = useRef("");
  const firstRun = useRef(true);

  const keyword = search.trim();
  const data = keyword ? searchResults : entries;

  // Muat ulang tiap Home difokuskan (setelah tambah/edit/hapus)
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchDiaries(searchRef.current || undefined));
    }, [dispatch])
  );

  // Pencarian dengan debounce 400ms -> GET /api/diaries?search=kata
  useEffect(() => {
    searchRef.current = keyword;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const timer = setTimeout(() => {
      dispatch(fetchDiaries(keyword || undefined));
    }, 400);
    return () => clearTimeout(timer);
  }, [keyword, dispatch]);

  const handleToggleLike = async (item: DiaryEntry) => {
    try {
      await dispatch(toggleLike({ id: item.id, liked: !item.liked })).unwrap();
    } catch (e) {
      Alert.alert("Error", (e as { message?: string }).message || "Gagal mengubah favorit");
    }
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Mengambil diary...</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={() => dispatch(fetchDiaries(keyword || undefined))}>
            <Text style={styles.retry}>Coba Lagi</Text>
          </Pressable>
        </View>
      );
    }
    return (
      <Text style={styles.empty}>
        {keyword ? `Tidak ada hasil untuk "${keyword}".` : "Belum ada diary."}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.heading}>Buku Harian</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Cari diary..."
        autoCorrect={false}
        autoCapitalize="none"
        style={styles.search}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={() => dispatch(fetchDiaries(keyword || undefined))}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <DiaryCard
            item={item}
            liking={likingIds.includes(item.id)}
            onToggleLike={() => handleToggleLike(item)}
            onPress={() =>
              router.push({ pathname: "/detail/[id]", params: { id: String(item.id) } })
            }
          />
        )}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: "#F8FAFC" },
  heading: { fontSize: 26, fontWeight: "700", marginTop: 8, marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  center: { alignItems: "center", justifyContent: "center", gap: 12, marginTop: 40 },
  error: { color: "#EF4444", textAlign: "center" },
  retry: { color: "#2563EB", fontWeight: "700" },
  empty: { textAlign: "center", marginTop: 40, color: "#6B7280" },
});
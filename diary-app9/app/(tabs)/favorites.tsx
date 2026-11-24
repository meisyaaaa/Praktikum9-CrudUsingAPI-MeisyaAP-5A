import { useCallback } from "react";
import { Alert, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import DiaryCard from "../../src/components/DiaryCard";
import { fetchDiaries, toggleLike } from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import type { DiaryEntry } from "../../src/services/diaryApi";

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.diary.entries);
  const likingIds = useAppSelector((state) => state.diary.likingIds);

  // Hanya diary dengan liked = true
  const favorites = entries.filter((item) => Boolean(item.liked));

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchDiaries(undefined));
    }, [dispatch])
  );

  const handleToggleLike = async (item: DiaryEntry) => {
    try {
      await dispatch(toggleLike({ id: item.id, liked: !item.liked })).unwrap();
    } catch (e) {
      Alert.alert("Error", (e as { message?: string }).message || "Gagal mengubah favorit");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.heading}>Diary Favorit</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
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
        ListEmptyComponent={<Text style={styles.empty}>Belum ada diary favorit.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: "#F8FAFC" },
  heading: { fontSize: 26, fontWeight: "700", marginTop: 8, marginBottom: 12 },
  empty: { textAlign: "center", marginTop: 40, color: "#6B7280" },
});
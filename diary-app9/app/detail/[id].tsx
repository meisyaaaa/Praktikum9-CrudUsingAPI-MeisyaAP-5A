import { Alert, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { removeDiary } from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";

export default function DetailScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  const deleting = useAppSelector((state) => state.diary.deleting);
  const entry = useAppSelector((state) =>
    state.diary.entries.find((item) => item.id === Number(id))
  );

  if (!entry) {
    return <Text style={{ padding: 16 }}>Diary tidak ditemukan.</Text>;
  }

  const confirmDelete = () => {
    if (deleting) return;

    Alert.alert("Hapus Diary", "Data akan dihapus dari MySQL.", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(removeDiary(entry.id)).unwrap();
            router.replace("/");
          } catch (error) {
            Alert.alert("Error", (error as { message?: string }).message || "Gagal menghapus diary");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.mood}>{entry.mood}</Text>
      <Text style={styles.title}>{entry.title}</Text>
      <Text style={styles.date}>Tanggal diary: {entry.diary_date}</Text>
      <Text style={styles.date}>Dibuat pada: {entry.created_at ?? "-"}</Text>
      <Text style={styles.body}>{entry.body}</Text>

      <Pressable
        onPress={() =>
          router.push({ pathname: "/edit/[id]", params: { id: String(entry.id) } })
        }
        disabled={deleting}
        style={[styles.edit, deleting && styles.disabled]}
      >
        <Text style={styles.white}>Edit Diary</Text>
      </Pressable>

      <Pressable
        onPress={confirmDelete}
        disabled={deleting}
        style={[styles.delete, deleting && styles.disabled]}
      >
        <Text style={styles.white}>{deleting ? "Menghapus..." : "Hapus Diary"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  mood: { fontSize: 60 },
  title: { fontSize: 26, fontWeight: "700" },
  date: { color: "#6B7280" },
  body: { fontSize: 16, lineHeight: 24 },
  edit: { padding: 14, alignItems: "center", borderRadius: 14, backgroundColor: "#2563EB" },
  delete: { padding: 14, alignItems: "center", borderRadius: 14, backgroundColor: "#EF4444" },
  disabled: { opacity: 0.5 },
  white: { color: "#fff", fontWeight: "700" },
});
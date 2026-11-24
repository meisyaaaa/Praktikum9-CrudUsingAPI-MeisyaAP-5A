import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { addDiary } from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";

const DEFAULT_MOOD = "\uD83D\uDE42";
const MIN_TITLE = 3;

export default function CreateScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const saving = useAppSelector((state) => state.diary.saving);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState("");

  const save = async () => {
    if (saving) return;

    if (title.trim().length < MIN_TITLE) {
      Alert.alert("Validasi", `Judul minimal ${MIN_TITLE} karakter`);
      return;
    }
    if (!body.trim()) {
      Alert.alert("Validasi", "Isi diary wajib diisi");
      return;
    }

    try {
      await dispatch(
        addDiary({
          title: title.trim(),
          diary_date: new Date().toISOString().slice(0, 10),
          body: body.trim(),
          mood: mood.trim() || DEFAULT_MOOD,
        })
      ).unwrap();

      setTitle("");
      setBody("");
      setMood("");
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", (error as { message?: string }).message || "Diary gagal disimpan");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.heading}>Tambah Diary</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Judul (minimal 3 karakter)"
        style={styles.input}
      />
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="Ceritakan harimu..."
        multiline
        style={[styles.input, styles.bodyInput]}
      />
      <TextInput
        value={mood}
        onChangeText={setMood}
        placeholder="Mood / emoji (opsional)"
        style={styles.input}
      />
      <Pressable
        onPress={save}
        disabled={saving}
        style={[styles.button, saving && styles.disabled]}
      >
        <Text style={styles.white}>{saving ? "Menyimpan..." : "Simpan"}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, gap: 12, backgroundColor: "#F8FAFC" },
  heading: { fontSize: 24, fontWeight: "700", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#fff",
  },
  bodyInput: { minHeight: 140, textAlignVertical: "top" },
  button: { padding: 14, alignItems: "center", borderRadius: 14, backgroundColor: "#2563EB" },
  disabled: { opacity: 0.5 },
  white: { color: "#fff", fontWeight: "700" },
});
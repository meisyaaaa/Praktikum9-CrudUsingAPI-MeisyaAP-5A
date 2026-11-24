import { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  useLocalSearchParams,
  useNavigation,
  usePreventRemove,
  useRouter,
} from "expo-router";
import { editDiary } from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";

const DEFAULT_MOOD = "\uD83D\uDE42";
const MIN_TITLE = 3;

export default function EditScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  const saving = useAppSelector((state) => state.diary.saving);
  const entry = useAppSelector((state) =>
    state.diary.entries.find((item) => item.id === Number(id))
  );

  const [title, setTitle] = useState(entry?.title || "");
  const [body, setBody] = useState(entry?.body || "");
  const [mood, setMood] = useState(entry?.mood || DEFAULT_MOOD);

  // true setelah berhasil simpan, agar tidak muncul konfirmasi lagi
  const savedRef = useRef(false);

  const isDirty =
    !!entry && (title !== entry.title || body !== entry.body || mood !== entry.mood);

  // Konfirmasi jika keluar dari form Edit yang belum disimpan
  // (header back, tombol back HP, dan gesture swipe)
  usePreventRemove(isDirty, ({ data }) => {
    if (savedRef.current) {
      navigation.dispatch(data.action);
      return;
    }

    Alert.alert(
      "Perubahan belum disimpan",
      "Jika keluar sekarang, perubahan akan hilang.",
      [
        { text: "Tetap di sini", style: "cancel" },
        {
          text: "Buang perubahan",
          style: "destructive",
          onPress: () => navigation.dispatch(data.action),
        },
      ]
    );
  });

  if (!entry) {
    return <Text style={{ padding: 16 }}>Diary tidak ditemukan.</Text>;
  }

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
        editDiary({
          id: entry.id,
          data: { title: title.trim(), body: body.trim(), mood: mood.trim() || DEFAULT_MOOD },
        })
      ).unwrap();

      savedRef.current = true;
      router.back();
    } catch (error) {
      Alert.alert("Error", (error as { message?: string }).message || "Gagal memperbarui diary");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Diary</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Judul (minimal 3 karakter)"
        style={styles.input}
      />
      <TextInput
        value={body}
        onChangeText={setBody}
        multiline
        style={[styles.input, styles.body]}
      />
      <TextInput value={mood} onChangeText={setMood} style={styles.input} />

      <Pressable
        onPress={save}
        disabled={saving}
        style={[styles.button, saving && styles.disabled]}
      >
        <Text style={styles.white}>{saving ? "Menyimpan..." : "Simpan Perubahan"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: "#F8FAFC" },
  heading: { fontSize: 24, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#fff",
  },
  body: { minHeight: 140, textAlignVertical: "top" },
  button: { padding: 14, alignItems: "center", borderRadius: 14, backgroundColor: "#2563EB" },
  disabled: { opacity: 0.5 },
  white: { color: "#fff", fontWeight: "700" },
});
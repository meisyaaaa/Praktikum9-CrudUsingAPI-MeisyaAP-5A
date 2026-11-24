import { Pressable, StyleSheet, Text, View } from "react-native";
import type { DiaryEntry } from "../services/diaryApi";
import { COLORS, RADIUS, SPACE, TYPO } from "../styles/tokens";

type DiaryCardProps = {
  item: DiaryEntry;
  onPress: () => void;
  onToggleLike?: () => void;
  liking?: boolean;
};

export default function DiaryCard({ item, onPress, onToggleLike, liking }: DiaryCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.mood}>{item.mood}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{item.diary_date}</Text>
        <Text numberOfLines={2} style={styles.preview}>
          {item.preview}
        </Text>
      </View>
      {onToggleLike ? (
        <Pressable
          onPress={onToggleLike}
          disabled={liking}
          hitSlop={10}
          style={[styles.heart, liking && styles.heartBusy]}
        >
          <Text style={styles.heartText}>
            {item.liked ? "\u2764\uFE0F" : "\uD83E\uDD0D"}
          </Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: SPACE.m,
    padding: SPACE.m + 2,
    marginBottom: SPACE.m,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
  },
  mood: { fontSize: 32 },
  content: { flex: 1 },
  title: { fontSize: TYPO.title, fontWeight: "700", color: COLORS.text },
  date: { fontSize: TYPO.caption, color: COLORS.muted, marginVertical: 4 },
  preview: { fontSize: TYPO.body, color: COLORS.text },
  heart: { justifyContent: "flex-start", paddingLeft: 4 },
  heartBusy: { opacity: 0.4 },
  heartText: { fontSize: 26 },
});
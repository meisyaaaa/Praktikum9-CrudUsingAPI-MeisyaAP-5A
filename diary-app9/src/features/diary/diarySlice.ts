import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  apiCreateDiary,
  apiDeleteDiary,
  apiGetDiaries,
  apiUpdateDiary,
} from "../../services/diaryApi";
import type { DiaryEntry, NewDiary } from "../../services/diaryApi";

type DiaryState = {
  entries: DiaryEntry[];
  searchResults: DiaryEntry[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
  saving: boolean;
  deleting: boolean;
  likingIds: number[];
};

const initialState: DiaryState = {
  entries: [],
  searchResults: [],
  searchQuery: "",
  loading: false,
  error: null,
  saving: false,
  deleting: false,
  likingIds: [],
};

export const fetchDiaries = createAsyncThunk<DiaryEntry[], string | undefined>(
  "diary/fetchDiaries",
  async (search) => await apiGetDiaries(search)
);

export const addDiary = createAsyncThunk<DiaryEntry, NewDiary>(
  "diary/addDiary",
  async (data) => await apiCreateDiary(data)
);

export const editDiary = createAsyncThunk<
  DiaryEntry,
  { id: number; data: Partial<DiaryEntry> }
>("diary/editDiary", async ({ id, data }) => await apiUpdateDiary(id, data));

// Favorite: PUT liked ke MySQL
export const toggleLike = createAsyncThunk<
  DiaryEntry,
  { id: number; liked: boolean }
>("diary/toggleLike", async ({ id, liked }) =>
  await apiUpdateDiary(id, { liked: liked ? 1 : 0 })
);

export const removeDiary = createAsyncThunk<number, number>(
  "diary/removeDiary",
  async (id) => {
    await apiDeleteDiary(id);
    return id;
  }
);

function replaceEntry(state: DiaryState, updated: DiaryEntry) {
  for (const list of [state.entries, state.searchResults]) {
    const index = list.findIndex((item) => item.id === updated.id);
    if (index >= 0) list[index] = updated;
  }
}

const diarySlice = createSlice({
  name: "diary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---- fetch / search ----
      .addCase(fetchDiaries.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.searchQuery = (action.meta.arg ?? "").trim();
      })
      .addCase(fetchDiaries.fulfilled, (state, action) => {
        const query = (action.meta.arg ?? "").trim();
        if (query !== state.searchQuery) return; // respons lama, abaikan
        state.loading = false;
        if (query) state.searchResults = action.payload;
        else state.entries = action.payload;
      })
      .addCase(fetchDiaries.rejected, (state, action) => {
        const query = (action.meta.arg ?? "").trim();
        if (query !== state.searchQuery) return;
        state.loading = false;
        state.error = action.error.message || "Gagal mengambil diary";
      })

      // ---- tambah ----
      .addCase(addDiary.pending, (state) => {
        state.saving = true;
      })
      .addCase(addDiary.fulfilled, (state, action) => {
        state.saving = false;
        state.entries.unshift(action.payload);
      })
      .addCase(addDiary.rejected, (state) => {
        state.saving = false;
      })

      // ---- edit ----
      .addCase(editDiary.pending, (state) => {
        state.saving = true;
      })
      .addCase(editDiary.fulfilled, (state, action) => {
        state.saving = false;
        replaceEntry(state, action.payload);
      })
      .addCase(editDiary.rejected, (state) => {
        state.saving = false;
      })

      // ---- favorite ----
      .addCase(toggleLike.pending, (state, action) => {
        state.likingIds.push(action.meta.arg.id);
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.likingIds = state.likingIds.filter((id) => id !== action.meta.arg.id);
        replaceEntry(state, action.payload);
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.likingIds = state.likingIds.filter((id) => id !== action.meta.arg.id);
      })

      // ---- hapus ----
      .addCase(removeDiary.pending, (state) => {
        state.deleting = true;
      })
      .addCase(removeDiary.fulfilled, (state, action) => {
        state.deleting = false;
        state.entries = state.entries.filter((item) => item.id !== action.payload);
        state.searchResults = state.searchResults.filter((item) => item.id !== action.payload);
      })
      .addCase(removeDiary.rejected, (state) => {
        state.deleting = false;
      });
  },
});

export default diarySlice.reducer;
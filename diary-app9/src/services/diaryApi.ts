export type DiaryEntry = {
  id: number;
  title: string;
  diary_date: string;
  preview: string;
  body: string;
  mood: string;
  liked: boolean | number;
  created_at?: string;
};

export type NewDiary = {
  title: string;
  diary_date: string;
  body: string;
  mood: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TIMEOUT_MS = 10000;

function getBaseUrl() {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL belum diatur di file .env");
  }
  return API_URL;
}

async function checkResponse(response: Response) {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Request gagal");
  }
  return response.json();
}

// Semua request lewat sini: ada timeout + pesan error jaringan yang jelas
async function request(path: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${getBaseUrl()}${path}`, {
      ...options,
      signal: controller.signal,
    });
    return await checkResponse(response);
  } catch (error: any) {
    if (error?.name === "AbortError") {
      throw new Error("Server tidak merespons (timeout). Periksa koneksi dan alamat API.");
    }
    if (error instanceof TypeError) {
      throw new Error(
        "Tidak dapat terhubung ke server. Pastikan HP & laptop satu Wi-Fi, backend menyala, dan EXPO_PUBLIC_API_URL benar."
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

const JSON_HEADERS = { "Content-Type": "application/json" };

export function apiGetDiaries(search?: string) {
  const query = search && search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
  return request(`/api/diaries${query}`);
}

export function apiCreateDiary(data: NewDiary) {
  return request("/api/diaries", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  });
}

export function apiUpdateDiary(id: number, data: Partial<DiaryEntry>) {
  return request(`/api/diaries/${id}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  });
}

export function apiDeleteDiary(id: number) {
  return request(`/api/diaries/${id}`, { method: "DELETE" });
}
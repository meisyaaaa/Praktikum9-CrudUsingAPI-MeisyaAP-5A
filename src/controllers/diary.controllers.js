import { db } from "../config/database.js";

const DEFAULT_MOOD = "\uD83D\uDE42";
const MIN_TITLE = 3;

function validTitle(title) {
  return typeof title === "string" && title.trim().length >= MIN_TITLE;
}

function toLiked(value) {
  return value === true || value === 1 || value === "1" || value === "true" ? 1 : 0;
}

// GET /api/diaries            -> semua diary
// GET /api/diaries?search=kata -> cari di title / body / mood
// GET /api/diaries?liked=1     -> hanya favorit
export async function getAllDiaries(req, res) {
  try {
    const search = String(req.query.search ?? "").trim();
    const liked = String(req.query.liked ?? "");

    const where = [];
    const params = [];

    if (search) {
      const escaped = search.replace(/[\\%_]/g, "\\$&");
      const like = `%${escaped}%`;
      where.push("(title LIKE ? OR body LIKE ? OR mood LIKE ?)");
      params.push(like, like, like);
    }

    if (liked === "1" || liked === "true") {
      where.push("liked = 1");
    }

    const sql =
      "SELECT * FROM diaries" +
      (where.length ? " WHERE " + where.join(" AND ") : "") +
      " ORDER BY created_at DESC";

    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data diary" });
  }
}

export async function getDiaryById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM diaries WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Diary tidak ditemukan" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil detail diary" });
  }
}

export async function createDiary(req, res) {
  try {
    const { title, diary_date, body, mood } = req.body;

    if (!title || !diary_date || !body) {
      return res.status(400).json({
        message: "title, diary_date, dan body wajib diisi",
      });
    }

    if (!validTitle(title)) {
      return res.status(400).json({
        message: `Judul minimal ${MIN_TITLE} karakter`,
      });
    }

    const cleanBody = String(body).trim();
    if (!cleanBody) {
      return res.status(400).json({ message: "Isi diary tidak boleh kosong" });
    }

    const preview = cleanBody.slice(0, 100);

    const [result] = await db.execute(
      `INSERT INTO diaries (title, diary_date, preview, body, mood)
       VALUES (?, ?, ?, ?, ?)`,
      [title.trim(), diary_date, preview, cleanBody, (mood && String(mood).trim()) || DEFAULT_MOOD]
    );

    const [rows] = await db.execute("SELECT * FROM diaries WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan diary" });
  }
}

// PUT /api/diaries/:id  -> edit data dan/atau ubah liked (favorite)
export async function updateDiary(req, res) {
  try {
    const { id } = req.params;

    const [oldRows] = await db.execute("SELECT * FROM diaries WHERE id = ?", [id]);

    if (oldRows.length === 0) {
      return res.status(404).json({ message: "Diary tidak ditemukan" });
    }

    const old = oldRows[0];

    const {
      title = old.title,
      diary_date = old.diary_date,
      body = old.body,
      mood = old.mood,
      liked = old.liked,
    } = req.body;

    if (!validTitle(title)) {
      return res.status(400).json({
        message: `Judul minimal ${MIN_TITLE} karakter`,
      });
    }

    if (typeof body !== "string" || !body.trim()) {
      return res.status(400).json({ message: "Isi diary tidak boleh kosong" });
    }

    const preview = body.trim().slice(0, 100);

    await db.execute(
      `UPDATE diaries
       SET title = ?, diary_date = ?, preview = ?, body = ?, mood = ?, liked = ?
       WHERE id = ?`,
      [title.trim(), diary_date, preview, body.trim(), mood, toLiked(liked), id]
    );

    const [rows] = await db.execute("SELECT * FROM diaries WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui diary" });
  }
}

export async function deleteDiary(req, res) {
  try {
    const { id } = req.params;
    const [result] = await db.execute("DELETE FROM diaries WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Diary tidak ditemukan" });
    }

    res.json({ message: "Diary berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus diary" });
  }
}
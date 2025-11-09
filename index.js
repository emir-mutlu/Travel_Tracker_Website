// index.js

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// ==== POSTGRES AYARLARI ====
// Burayı kendi postgres bilgine göre ayarladın zaten:
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "travel_tracker",
  password: "emir123",   // kendi şifren
  port: 5432,
});
await db.connect();

// ==== EJS & STATIC ====

// form body okumak için
app.use(bodyParser.urlencoded({ extended: true }));
// /public içindeki css/js'leri servis et
app.use(express.static("public"));

// __dirname için (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ==== GLOBAL STATE ====
let currentUserId = 1;

// ==== HELPER FONKSİYONLAR ====

async function getUsers() {
  const result = await db.query(
    "SELECT id, name, color FROM users ORDER BY id ASC;"
  );
  return result.rows;
}

async function getVisitedForUser(userId) {
  const result = await db.query(
    "SELECT country_code FROM visited_countries WHERE user_id = $1;",
    [userId]
  );
  return result.rows.map((row) => row.country_code);
}

async function getUserColor(userId) {
  const result = await db.query(
    "SELECT color FROM users WHERE id = $1;",
    [userId]
  );
  return result.rows[0]?.color || "#22c55e";
}

// ==== ROUTES ====

// Ana sayfa
app.get("/", async (req, res) => {
  try {
    const users = await getUsers();

    if (users.length === 0) {
      // hiç kullanıcı yoksa boş state
      return res.render("index", {
        users: [],
        countries: "",
        color: "#22c55e",
        total: 0,
        error: undefined,
        activeUserId: undefined,
      });
    }

    // currentUserId listede yoksa ilk kullanıcıyı seç
    if (!users.some((u) => u.id === currentUserId)) {
      currentUserId = users[0].id;
    }

    const codes = await getVisitedForUser(currentUserId);
    const color = await getUserColor(currentUserId);

    res.render("index", {
      users,
      countries: codes.join(","),  // EJS içindeki script için
      color,
      total: codes.length,
      error: undefined,
      activeUserId: currentUserId,
    });
  } catch (err) {
    console.error("GET / error:", err);
    res.status(500).send("Internal server error");
  }
});

// Profil değiştirme / Add profile
app.post("/user", async (req, res) => {
  try {
    // Add profile tıklandıysa
    if (req.body.add === "new") {
      return res.redirect("/new");
    }

    // Bir profil pill'ine tıklandıysa
    if (req.body.user) {
      currentUserId = Number(req.body.user);
    }

    res.redirect("/");
  } catch (err) {
    console.error("POST /user error:", err);
    res.status(500).send("Internal server error");
  }
});

// Yeni profil formu
app.get("/new", (req, res) => {
  // new.ejs'yi renderla
  res.render("new");
});

app.post("/new", async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name || !color) {
      return res.redirect("/new");
    }

    const result = await db.query(
      "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id;",
      [name, color]
    );

    const id = result.rows[0].id;
    currentUserId = id;

    res.redirect("/");
  } catch (err) {
    console.error("POST /new error:", err);
    res.status(500).send("Internal server error");
  }
});

// Ülke ekleme
app.post("/add", async (req, res) => {
  const { country } = req.body;

  try {
    if (!country || !country.trim()) {
      return res.redirect("/");
    }

    const search = country.trim().toLowerCase();

    // Ülkeyi countries tablosundan bul (ismi içeriyorsa yakala)
    const countryResult = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [search]
    );

    let code;

    if (countryResult.rows.length > 0) {
      code = countryResult.rows[0].country_code;
    } else {
      // bulunamazsa son çare: yazılanı iki harflik code gibi düşün
      code = country.trim().toUpperCase().slice(0, 2);
    }

    // visited_countries'a ekle
    await db.query(
      "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2);",
      [code, currentUserId]
    );

    res.redirect("/");
  } catch (err) {
    console.error("POST /add error:", err);

    try {
      const users = await getUsers();
      const codes = await getVisitedForUser(currentUserId);
      const color = await getUserColor(currentUserId);

      res.status(500).render("index", {
        users,
        countries: codes.join(","),
        color,
        total: codes.length,
        error: "Something went wrong",
        activeUserId: currentUserId,
      });
    } catch (e2) {
      console.error("FATAL render error:", e2);
      res.status(500).send("Fatal error");
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

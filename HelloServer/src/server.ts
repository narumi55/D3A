import express from "express";
import cors from "cors";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

const app = express();
const PORT = 3000;

// CORS と JSON ボディパーサーの設定
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT"], // PUT メソッドを追加
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// Firebase Admin SDK の初期化
const serviceAccount = require("../firebaseServiceAccount.json");

initializeApp({
  credential: cert(serviceAccount),
  databaseURL:
    "https://helloapp-8f0ac-default-rtdb.asia-southeast1.firebasedatabase.app/",
});
const db = getDatabase();
const auth = getAuth();

app.put("/api/user", async (req, res) => {
  try {
    // リクエストボディからデータを取得
    const { uid, username, age, gender, stylePreference } = req.body;

    console.log(`ユーザー ${uid} の更新リクエストを受信しました`);

    // 必須データのバリデーション
    if (!uid || !username || !age || !gender || !stylePreference) {
      return res.status(400).json({ error: "すべてのフィールドを入力してください。" });
    }

    const ageNumber = Number(age);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      return res.status(400).json({ error: "年齢は正の数値である必要があります。" });
    }

    // Firebase Realtime Database の更新処理
    const userRef = db.ref("users").child(uid);
    const snapshot = await userRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "ユーザーが見つかりません。" });
    }

    // 更新処理
    await userRef.update({
      username,
      age: ageNumber,
      gender,
      stylePreference,
      updatedAt: new Date().toISOString(), // ISO 8601 フォーマット
    });

    console.log(`ユーザー ${uid} の情報を正常に更新しました`);
    res.status(200).json({ message: "ユーザー情報を更新しました。" });
  } catch (error) {
    console.error("ユーザー情報の更新中にエラーが発生しました:", error);
    res.status(500).json({ error: "サーバー内部でエラーが発生しました。" });
  }
});


// その他の既存エンドポイント
app.post("/api/register", async (req, res) => {
  try {
    const { username, age, email, password, gender, stylePreference } = req.body;
    const userRecord = await auth.createUser({ email, password });

    const userRef = db.ref("users").child(userRecord.uid);
    await userRef.set({
      username,
      age,
      gender,
      stylePreference,
      createdAt: Date.now(),
    });

    res.status(201).json({
      message: "User registered successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.get("/api/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const userRef = db.ref("users").child(uid);
    const snapshot = await userRef.once("value");

    if (snapshot.exists()) {
      res.status(200).json(snapshot.val());
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

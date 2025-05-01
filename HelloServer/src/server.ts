import express from "express";
import cors from "cors";
import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

const app = express();
const PORT = 3000;

// CORS と JSON ボディパーサーの設定
app.use(cors({
  origin: '*', // 必要に応じて特定のドメインに制限
  methods: ['GET', 'POST'], // 許可するHTTPメソッド
  allowedHeaders: ['Content-Type'] // 許可するヘッダー
}));

app.use(express.json());

// Firebase Admin SDK の初期化
const serviceAccount = require("../firebaseServiceAccount.json");

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://helloapp-8f0ac-default-rtdb.asia-southeast1.firebasedatabase.app/",
});
const db = getDatabase();

// React Native からの登録データを受け取り、Firebase に保存するエンドポイント
app.post("/api/register", async (req, res) => {
  try {
    // リクエストボディからユーザー情報を取得
    const { username, age, email, password, gender, stylePreference } = req.body;

    // 'users' ノードの下に自動生成キーでデータを保存
    const ref = db.ref("users");
    const newUserRef = ref.push();
    await newUserRef.set({
      username,
      age,
      email,
      password,
      gender,
      stylePreference,
      createdAt: Date.now()
    });

    res.status(201).json({ message: "User registered successfully", id: newUserRef.key });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
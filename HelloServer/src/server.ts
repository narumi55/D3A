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
    origin: "*", // 必要に応じて特定のドメインに制限
    methods: ["GET", "POST"], // 許可するHTTPメソッド
    allowedHeaders: ["Content-Type"], // 許可するヘッダー
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

// React Native からの登録データを受け取り、AuthenticationとRealtime Databaseに保存
app.post("/api/register", async (req, res) => {
  try {
    // リクエストボディからユーザー情報を取得
    const { username, age, email, password, gender, stylePreference } = req.body;

    // Firebase Authentication にユーザーを作成
    const userRecord = await auth.createUser({
      email,
      password,
    });

    console.log("User created in Authentication:", userRecord.uid);

    // Firebase Realtime Database に追加情報を保存
    const userRef = db.ref("users").child(userRecord.uid);
    await userRef.set({
      username,
      age,
      gender,
      stylePreference,
      createdAt: Date.now(),
    });

    // `uid` を含むレスポンスを送信
    res.status(201).json({
      message: "User registered successfully",
      uid: userRecord.uid, // UID をクライアントに返す
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

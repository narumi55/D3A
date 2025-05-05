"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const database_1 = require("firebase-admin/database");
const app = (0, express_1.default)();
const PORT = 3000;
// CORS と JSON ボディパーサーの設定
app.use((0, cors_1.default)({
    origin: "*", // 必要に応じて特定のドメインに制限
    methods: ["GET", "POST"], // 許可するHTTPメソッド
    allowedHeaders: ["Content-Type"], // 許可するヘッダー
}));
app.use(express_1.default.json());
// Firebase Admin SDK の初期化
const serviceAccount = require("../firebaseServiceAccount.json");
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount),
    databaseURL: "https://helloapp-8f0ac-default-rtdb.asia-southeast1.firebasedatabase.app/",
});
const db = (0, database_1.getDatabase)();
const auth = (0, auth_1.getAuth)();
// React Native からの登録データを受け取り、AuthenticationとRealtime Databaseに保存
app.post("/api/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // リクエストボディからユーザー情報を取得
        const { username, age, email, password, gender, stylePreference } = req.body;
        // Firebase Authentication にユーザーを作成
        const userRecord = yield auth.createUser({
            email,
            password,
        });
        console.log("User created in Authentication:", userRecord.uid);
        // Firebase Realtime Database に追加情報を保存
        const userRef = db.ref("users").child(userRecord.uid);
        yield userRef.set({
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
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
}));
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

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
    origin: "*",
    methods: ["GET", "POST", "PUT"], // PUT メソッドを追加
    allowedHeaders: ["Content-Type"],
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

app.post("/api/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, age, email, password, gender, stylePreference } = req.body;
        const userRecord = yield auth.createUser({ email, password });
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
app.get("/api/user/:uid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        const userRef = db.ref("users").child(uid);
        const snapshot = yield userRef.once("value");
        if (snapshot.exists()) {
            res.status(200).json(snapshot.val());
        }
        else {
            res.status(404).json({ error: "User not found" });
        }
    }
    catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
}));
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

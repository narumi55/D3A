import { getDatabase, ref, update } from "firebase/database";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ユーザーデータの型定義
export interface UserData {
  uid: string; // ユーザーのUID
  username: string; // ユーザー名
  age: string; // 年齢
  gender: string; // 性別
  stylePreference: string; // スタイルの好み
}

/**
 * Realtime Database内のユーザーデータを更新する関数
 * @param {UserData} userData - 更新するユーザーデータ
 * @returns {Promise<string>} - 成功メッセージ
 */
export const editUserData = async (userData: UserData): Promise<string> => {
  try {
    console.log("Realtime Database更新処理開始");

    // ドキュメント参照の作成
    const userRef = ref(db, `users/${userData.uid}`);
    console.log("ユーザーデータ参照作成:", userRef.toString());

    // Realtime Databaseの更新処理前に内容をログに出す
    console.log("更新データ:", {
      username: userData.username,
      age: userData.age,
      gender: userData.gender,
      stylePreference: userData.stylePreference,
    });

    // update関数を使ったデータの更新
    await update(userRef, {
      username: userData.username,
      age: userData.age,
      gender: userData.gender,
      stylePreference: userData.stylePreference,
    });

    console.log("Realtime Database更新成功:", userRef.toString());

    return "ユーザー情報が正常に更新されました。";
  } catch (error) {
    console.error("Realtime Database更新エラー発生");

    if (error instanceof Error) {
      console.error("エラーメッセージ:", error.message);
      console.error("エラーオブジェクト詳細:", error);
    } else {
      console.error("不明なエラーオブジェクト:", error);
    }

    // Firebase SDKのエラー情報があればログ出力
    if (typeof error === "object" && error !== null) {
      if ("code" in error) console.error("Firebaseエラーコード:", (error as any).code);
      if ("details" in error) console.error("エラー詳細:", (error as any).details);
      if ("stack" in error) console.error("スタックトレース:", (error as any).stack);
    }

    throw new Error("ユーザー情報の更新中にエラーが発生しました。詳細はログを確認してください。");
  }
};

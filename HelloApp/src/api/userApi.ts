import axios from "axios";
import { saveUserUid } from "../utils/storage";

// サーバーのエンドポイントURL
const API_URL = "http://localhost:3000/api/register"; 

// ユーザー登録関数
export const registerUser = async (userData: {
  username: string;
  age: string;
  email: string;
  password: string;
  gender: string;
  stylePreference: string;
}) => {
  try {
    // サーバーにユーザーデータを送信
    const response = await axios.post(API_URL, userData);

    // `uid` を含むサーバーからの応答データを返す
    const { uid, message } = response.data;

    // UID を AsyncStorage に保存
    await saveUserUid(uid);

    console.log("User registered with UID:", uid);
    return { uid, message };
  } catch (error) {
    // エラーハンドリング
    console.error("Error registering user:", error);
    throw error;
  }
};


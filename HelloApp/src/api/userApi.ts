import axios from "axios";

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
    
    // サーバーからの応答データを返す
    return response.data;
  } catch (error) {
    // エラーハンドリング
    console.error("Error registering user:", error);
    throw error;
  }
};


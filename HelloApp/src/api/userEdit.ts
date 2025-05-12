import axios from "axios";
const API_URL = "http://localhost:3000/api/user"; 

export const editUserData = async (
  userData: {
    uid: string,
    username: string;
    age: number;
    gender: string;
    stylePreference: string;
  }
) => {
  try {
    const response = await axios.put(`${API_URL}`, {
      uid: userData.uid,
      username: userData.username,
      age: userData.age,
      gender: userData.gender,
      stylePreference: userData.stylePreference,
    });
    
    // レスポンスデータを返す
    return response.data;
  } catch (error) {
    console.error("編集リクエストエラー:", error);
    throw new Error("サーバー通信中にエラーが発生しました。");
  }
};

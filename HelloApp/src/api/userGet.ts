export const fetchUserData = async (uid: string): Promise<any> => {
    if (!uid || typeof uid !== "string") {
      console.error("UID が無効です:", uid);
      throw new Error("無効な UID が渡されました");
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/user/${uid}`);
      if (response.ok) {
        return await response.json();
      } else {
        console.error("ユーザー情報の取得に失敗しました");
        return null;
      }
    } catch (error) {
      console.error("サーバー通信中にエラーが発生しました:", error);
      throw error;
    }
  };
  
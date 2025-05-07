import AsyncStorage from '@react-native-async-storage/async-storage';

// UID を保存する関数
export const saveUserUid = async (uid: string) => {
  try {
    await AsyncStorage.setItem('userUid', uid);
    console.log("UID saved to AsyncStorage:", uid);
  } catch (error) {
    console.error("Error saving UID to AsyncStorage:", error);
    throw error;
  }
};

// UID を取得する関数
export const getUserUid = async (): Promise<string | null> => {
  try {
    const uid = await AsyncStorage.getItem('userUid');
    if (uid !== null) {
      console.log("Retrieved UID from AsyncStorage:", uid);
      return uid;
    } else {
      console.log("No UID found in AsyncStorage");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving UID from AsyncStorage:", error);
    throw error;
  }
};

// UID を削除する関数（必要に応じて利用）
export const deleteUserUid = async () => {
  try {
    await AsyncStorage.removeItem('userUid');
    console.log("UID removed from AsyncStorage");
  } catch (error) {
    console.error("Error removing UID from AsyncStorage:", error);
    throw error;
  }
};

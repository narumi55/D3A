import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { fetchUserData } from "../src/api/userGet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AccountModal from "./(tabs)/AccountModal"; // 別のモーダル用コンポーネント
import ProfileModal from "./(tabs)/ProfileModal"; // 新しく遷移するモーダル用コンポーネント

const App = () => {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null); // UID を管理
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const uid = await AsyncStorage.getItem("userUid"); // UID を AsyncStorage から取得
        setUserUid(uid); // UID をステートに保存
        if (uid) {
          console.log("取得した UID:", uid);

          // 分離した API を使用してユーザー情報を取得
          const userData = await fetchUserData(uid);
          setUsername(userData ? userData.username : null);
        } else {
          console.log("UID が見つかりません");
          setUsername(null);
        }
      } catch (error) {
        console.error("データ取得中にエラーが発生しました:", error);
      }
    };

    fetchUsername();
  }, []);


  const toggleAccountModal = () => {
    setIsAccountModalOpen((prev) => !prev);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          title={username ? `ユーザー: ${username}` : "アカウント登録"}
          onPress={username ? openProfileModal : toggleAccountModal}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>D3A</Text>

      {/* Start Button */}
      <Button
        title="はじめる"
        onPress={() => router.push("./(tabs)/home")}
      />

      {/* Account Modal */}
      <AccountModal visible={isAccountModalOpen} toggleModal={toggleAccountModal} />

      {/* Profile Modal */}
      <ProfileModal visible={isProfileModalOpen} closeModal={closeProfileModal} uid={userUid} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default App;
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { getUserUid } from "../src/utils/storage"; // UID を取得する関数
import AccountModal from "./(tabs)/AccountModal";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userUid, setUserUid] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserUid = async () => {
      try {
        // AsyncStorage から UID を取得
        const uid = await getUserUid();
        if (uid) {
          console.log("取得した UID:", uid);
          setUserUid(uid);
        } else {
          console.log("ユーザー UID が見つかりません。");
          setUserUid(null);
        }
      } catch (error) {
        console.error("UID の取得中にエラーが発生しました:", error);
      }
    };

    fetchUserUid();
  }, []);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          title={userUid ? `UID: ${userUid}` : "アカウント登録"}
          onPress={toggleModal}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>D3A</Text>

      {/* Start Button */}
      <Button
        title="はじめる"
        onPress={() => router.push("./(tabs)/home")}
      />

      {/* Modal */}
      <AccountModal visible={isModalOpen} toggleModal={toggleModal} />
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

import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import AccountModal from "./(tabs)/AccountModal";

// Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyDudCiLk-5snt7bXPUCKTGfNW0FR6DIPPc",
  authDomain: "helloapp-8f0ac.firebaseapp.com",
  databaseURL: "https://helloapp-8f0ac-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "helloapp-8f0ac",
  storageBucket: "helloapp-8f0ac.firebasestorage.app",
  messagingSenderId: "4644371365",
  appId: "1:4644371365:web:89d1e7d4e7685cc566064c",
  measurementId: "G-VD45YP8P63"
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // ログイン状態を監視
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // ユーザー情報をステートに設定
    });

    return () => unsubscribe(); // クリーンアップ
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          title={user ? user.displayName || "アカウント" : "アカウント登録"}
          onPress={toggleModal}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>D3A</Text>

      {/* Start Button */}
      <Button title="はじめる" onPress={() => router.push("./(tabs)/home")} />

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

import React, { useEffect, useState } from "react";
import { Modal, View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import { fetchUserData } from "../../src/api/userGet"; // fetchUserData をインポート

interface ProfileModalProps {
  visible: boolean;
  closeModal: () => void;
  uid: string | null; // UID をプロップとして受け取る
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, closeModal, uid }) => {
  const [profileData, setProfileData] = useState({
    username: null,
    age: null,
    gender: null,
    stylePreference: null,
  });
  const [loading, setLoading] = useState(true); // ローディング状態を管理
  const [error, setError] = useState<string | null>(null); // エラー状態を管理

  // useEffect でユーザー情報を取得
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!uid) {
        setError("UIDが無効です");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchUserData(uid); // fetchUserData を呼び出してデータ取得
        if (data) {
          setProfileData(data); // 取得したデータをステートに保存
        } else {
          setError("ユーザー情報の取得に失敗しました");
        }
      } catch (err) {
        setError("サーバー通信中にエラーが発生しました");
      } finally {
        setLoading(false); // ローディングを終了
      }
    };

    if (visible) {
      fetchProfileData(); // モーダルが表示されたらデータを取得
    }
  }, [visible, uid]); // `visible` と `uid` が変更されたときに再実行

  if (loading) {
    return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>プロフィール情報を読み込んでいます...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>プロフィール</Text>

          {error ? (
            <Text style={styles.profileText}>{error}</Text>
          ) : (
            <>
              <Text style={styles.profileText}>ユーザー名: {profileData.username || "未登録"}</Text>
              <Text style={styles.profileText}>年齢: {profileData.age || "未登録"}</Text>
              <Text style={styles.profileText}>性別: {profileData.gender || "未登録"}</Text>
              <Text style={styles.profileText}>
                スタイルの好み: {profileData.stylePreference || "未登録"}
              </Text>
            </>
          )}

          <Button title="閉じる" onPress={closeModal} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default ProfileModal;

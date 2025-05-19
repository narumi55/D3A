import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // ドロップダウン用
import AsyncStorage from "@react-native-async-storage/async-storage";
import { editUserData } from "../src/api/userEdit";
import { fetchUserData } from "../src/api/userGet";
import { useRouter } from "expo-router";

const EditAccount: React.FC = () => {
  const [uid, setUid] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("男性");
  const [stylePreference, setStylePreference] = useState("ベーシック");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUidAndUserData = async () => {
      try {
        const storedUid = await AsyncStorage.getItem("userUid");
        if (!storedUid) {
          Alert.alert("エラー", "ユーザーIDが見つかりません。");
          return;
        }

        setUid(storedUid);

        // UID を使ってユーザー情報を取得
        const data = await fetchUserData(storedUid);
        if (data) {
          setUsername(data.username || "");
          setAge(data.age ? String(data.age) : "");
          setGender(data.gender || "男性");
          setStylePreference(data.stylePreference || "ベーシック");
        }
      } catch (err) {
        Alert.alert("エラー", "ユーザー情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    loadUidAndUserData();
  }, []);

  const handleSave = async () => {
    if (!uid) {
      Alert.alert("エラー", "ユーザーIDが取得できていません。");
      return;
    }

    if (!username || !age) {
      Alert.alert("入力エラー", "ユーザー名と年齢は必須です。");
      return;
    }

    const ageNumber = Number(age);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      Alert.alert("入力エラー", "年齢は正の数字を入力してください。");
      return;
    }

    try {
      await editUserData({
        uid,
        username,
        age, // 数値に変換
        gender,
        stylePreference,
      });

      router.push("/");
    } catch (error) {
      Alert.alert("エラー", "サーバー通信中にエラーが発生しました。");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ユーザー名:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="ユーザー名"
      />
      <Text style={styles.label}>年齢:</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="年齢"
        keyboardType="numeric"
      />
      <Text style={styles.label}>性別:</Text>
      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="男性" value="男性" />
        <Picker.Item label="女性" value="女性" />
        <Picker.Item label="その他" value="その他" />
      </Picker>
      <Text style={styles.label}>スタイルの好み:</Text>
      <Picker
        selectedValue={stylePreference}
        style={styles.picker}
        onValueChange={(itemValue) => setStylePreference(itemValue)}
      >
        <Picker.Item label="ベーシック" value="ベーシック" />
        <Picker.Item label="カジュアル" value="カジュアル" />
        <Picker.Item label="フォーマル" value="フォーマル" />
      </Picker>
      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>保存</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditAccount;
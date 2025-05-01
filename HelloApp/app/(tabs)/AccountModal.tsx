import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { registerUser } from "../../src/api/userApi";
import { Picker } from "@react-native-picker/picker";

type AccountModalProps = {
  visible: boolean;
  toggleModal: () => void;
};

const AccountModal: React.FC<AccountModalProps> = ({ visible, toggleModal }) => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("男性");
  const [stylePreference, setStylePreference] = useState("ベーシック");

  const handleRegister = async () => {
    console.log("ユーザー登録処理を開始");
  
    // 必須フィールドがすべて入力されているかチェック
    if (!username || !email || !password || !age) {
      console.log("入力されていないフィールドがあります。");
      alert("すべてのフィールドを入力してください。");
      return;
    }
  
    // 年齢のバリデーション
    if (isNaN(Number(age)) || Number(age) <= 0) {
      console.log("無効な年齢が入力されました:", age);
      alert("年齢は正しい数字を入力してください。");
      return;
    }
  
    // メールアドレスのバリデーション
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      console.log("無効なメールアドレスが入力されました:", email);
      alert("正しいメールアドレスを入力してください。");
      return;
    }
  
    // ユーザー情報のログ
    const userData = { username, age, email, password, gender, stylePreference };
    console.log("送信するユーザー情報:", userData);
  
    try {
      // ユーザー情報をサーバーに送信
      const response = await registerUser(userData);
      console.log("登録成功:", response);
  
      // 登録成功メッセージを表示
      alert("登録が成功しました！");
      toggleModal();
    } catch (error) {
      console.error("登録に失敗しました:", error);
      alert("登録に失敗しました。もう一度お試しください。");
    }
  };
  

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>&times;</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>アカウント登録</Text>

          {/* Input Fields */}
          <TextInput
            style={styles.input}
            placeholder="ユーザー名"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="年齢"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
          <TextInput
            style={styles.input}
            placeholder="メールアドレス"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="パスワード"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Gender Picker */}
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

          {/* Style Preference Picker */}
          <Text style={styles.label}>好みのスタイル:</Text>
          <Picker
            selectedValue={stylePreference}
            style={styles.picker}
            onValueChange={(itemValue) => setStylePreference(itemValue)}
          >
            <Picker.Item label="ベーシック" value="ベーシック" />
            <Picker.Item label="ストリート" value="ストリート" />
          </Picker>

          {/* Register Button */}
          <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
            <Text style={styles.registerButtonText}>登録</Text>
          </TouchableOpacity>
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
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#888",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    width: "100%",
    marginBottom: 10,
  },
  registerButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AccountModal;

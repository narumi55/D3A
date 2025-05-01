import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; 
import AccountModal from "./(tabs)/AccountModal";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button title="アカウント" onPress={toggleModal} />
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

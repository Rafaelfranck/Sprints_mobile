import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    if (!usuario || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (usuario !== "professor" || senha !== "1234") {
      Alert.alert("Erro", "Usuário ou senha inválidos!");
      return;
    }

    try {
      // 🔹 Armazena login no AsyncStorage
      await AsyncStorage.setItem("usuario", JSON.stringify({ usuario }));

      // 🔹 Redireciona para as Tabs
      navigation.replace("Tabs");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível realizar login.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={usuario}
        onChangeText={setUsuario}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { db } from "../services/firebase";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

export default function PerfilScreen() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [perfilRisco, setPerfilRisco] = useState("moderado");

  const docRef = doc(db, "clientes", "perfilAtual");

  // Carregar perfil salvo
  useEffect(() => {
    async function carregarPerfil() {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setNome(data.nome || "");
        setIdade(String(data.idade) || "");
        setPerfilRisco(data.perfilRisco || "moderado");
      }
    }
    carregarPerfil();
  }, []);

  // Salvar perfil
  async function salvarPerfil() {
    if (!nome || !idade) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    try {
      await setDoc(docRef, {
        nome,
        idade: Number(idade),
        perfilRisco,
        createdAt: Date.now(),
      });
      Alert.alert("Sucesso", "Perfil salvo com sucesso!");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível salvar o perfil.");
    }
  }

  // Excluir perfil
  async function excluirPerfil() {
    try {
      await deleteDoc(docRef);
      setNome("");
      setIdade("");
      setPerfilRisco("moderado");
      Alert.alert("Sucesso", "Perfil excluído.");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível excluir o perfil.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Idade</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua idade"
        keyboardType="numeric"
        value={idade}
        onChangeText={setIdade}
      />

      <Text style={styles.label}>Perfil de Risco</Text>
      <Picker
        selectedValue={perfilRisco}
        onValueChange={(itemValue) => setPerfilRisco(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Conservador" value="conservador" />
        <Picker.Item label="Moderado" value="moderado" />
        <Picker.Item label="Agressivo" value="agressivo" />
      </Picker>

      <Button title="Salvar Perfil" color="blue" onPress={salvarPerfil} />
      <Button title="Excluir Perfil" color="red" onPress={excluirPerfil} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontWeight: "bold", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

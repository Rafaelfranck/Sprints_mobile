import { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Switch,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../../App";
import { db } from "../services/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

type Props = BottomTabScreenProps<TabParamList, "Carteira">;

type Ativo = {
  id: string;
  nome: string;
  classe: string;
  risco: number;
  liquidez: string;
};

type Carteira = {
  id: string;
  nome: string;
  ativos: Ativo[];
  createdAt: number;
};

export default function CarteiraScreen({ navigation }: Props) {
  const [ativos, setAtivos] = useState<Ativo[]>([]);
  const [selecionados, setSelecionados] = useState<{ [key: string]: boolean }>({});
  const [nomeCarteira, setNomeCarteira] = useState("");
  const [carteiras, setCarteiras] = useState<Carteira[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null); // 🔹 se for null → create, se tiver valor → update

  // 🔹 Carregar ativos
  useEffect(() => {
    async function carregarAtivos() {
      const snapshot = await getDocs(collection(db, "Ativos"));
      if (!snapshot.empty) {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Ativo[];
        setAtivos(data);
      }
    }
    carregarAtivos();
  }, []);

  // 🔹 Carregar carteiras
  async function carregarCarteiras() {
    const snapshot = await getDocs(collection(db, "Carteiras"));
    if (!snapshot.empty) {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Carteira[];
      setCarteiras(data);
    } else {
      setCarteiras([]);
    }
  }

  useEffect(() => {
    carregarCarteiras();
  }, []);

  function toggleAtivo(id: string) {
    setSelecionados((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  // 🔹 Salvar ou Atualizar carteira
  async function salvarCarteira() {
    const ativosEscolhidos = ativos.filter((a) => selecionados[a.id]);
    if (!nomeCarteira.trim()) {
      Alert.alert("Validação", "Digite um nome para a carteira.");
      return;
    }
    if (ativosEscolhidos.length === 0) {
      Alert.alert("Validação", "Selecione ao menos um ativo.");
      return;
    }

    try {
      if (editandoId) {
        // 🔹 Atualizar
        const ref = doc(db, "Carteiras", editandoId);
        await updateDoc(ref, {
          nome: nomeCarteira.trim(),
          ativos: ativosEscolhidos,
        });
        Alert.alert("Sucesso", "Carteira atualizada!");
      } else {
        // 🔹 Criar nova
        await addDoc(collection(db, "Carteiras"), {
          nome: nomeCarteira.trim(),
          ativos: ativosEscolhidos,
          createdAt: Date.now(),
        });
        Alert.alert("Sucesso", "Carteira salva no Firestore!");
      }

      // Resetar formulário
      setNomeCarteira("");
      setSelecionados({});
      setEditandoId(null);

      carregarCarteiras(); // Atualiza lista
    } catch (error) {
      console.error("Erro ao salvar/atualizar carteira:", error);
      Alert.alert("Erro", "Não foi possível salvar a carteira.");
    }
  }

  // 🔹 Excluir carteira
  async function excluirCarteira(id: string) {
    try {
      await deleteDoc(doc(db, "Carteiras", id));
      Alert.alert("Sucesso", "Carteira excluída!");
      carregarCarteiras();
    } catch (error) {
      console.error("Erro ao excluir carteira:", error);
      Alert.alert("Erro", "Não foi possível excluir a carteira.");
    }
  }

  // 🔹 Editar carteira
  function editarCarteira(carteira: Carteira) {
    setNomeCarteira(carteira.nome);
    setSelecionados(
      carteira.ativos.reduce((acc, ativo) => {
        acc[ativo.id] = true;
        return acc;
      }, {} as { [key: string]: boolean })
    );
    setEditandoId(carteira.id);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>
        {editandoId ? "Editar carteira" : "Monte sua carteira"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da carteira"
        value={nomeCarteira}
        onChangeText={setNomeCarteira}
      />

      <FlatList
        data={ativos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Switch
              value={!!selecionados[item.id]}
              onValueChange={() => toggleAtivo(item.id)}
            />
          </View>
        )}
      />

      <Button
        title={editandoId ? "Atualizar Carteira" : "Salvar Carteira"}
        onPress={salvarCarteira}
      />

      <Text style={styles.subtitulo}>Carteiras salvas</Text>
      <FlatList
        data={carteiras}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.carteiraCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.detalhe}>
                Ativos: {item.ativos.map((a) => a.nome).join(", ")}
              </Text>
            </View>

            <View style={styles.acoes}>
              <TouchableOpacity
                style={styles.botaoEditar}
                onPress={() => editarCarteira(item)}
              >
                <Text style={styles.textoBotao}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={() => excluirCarteira(item.id)}
              >
                <Text style={styles.textoBotao}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  subtitulo: { fontSize: 18, fontWeight: "bold", marginTop: 25 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  nome: { fontSize: 16 },
  detalhe: { fontSize: 14, color: "#555" },
  carteiraCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  acoes: {
    flexDirection: "row",
    gap: 8,
  },
  botaoEditar: {
    backgroundColor: "orange",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 70,
    alignItems: "center",
    marginRight: 6,
  },
  botaoExcluir: {
    backgroundColor: "red",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 70,
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

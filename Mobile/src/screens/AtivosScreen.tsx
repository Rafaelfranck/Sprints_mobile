import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TabParamList, RootStackParamList } from "../../App";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import ativosLocal from "../data/ativos.json";

// 🔹 Props agora combinam Tab + Stack
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Ativos">,
  NativeStackScreenProps<RootStackParamList>
>;

type Ativo = {
  id: string;
  nome: string;
  classe: string;
  risco: number;
  liquidez: string;
};

export default function AtivosScreen({ navigation }: Props) {
  const [ativos, setAtivos] = useState<Ativo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarAtivos() {
      try {
        const snapshot = await getDocs(collection(db, "Ativos"));
        if (!snapshot.empty) {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Ativo[];
          setAtivos(data);
        } else {
          setAtivos(ativosLocal as Ativo[]);
        }
      } catch (error) {
        console.error("Erro ao buscar ativos:", error);
        setAtivos(ativosLocal as Ativo[]);
      } finally {
        setLoading(false);
      }
    }

    carregarAtivos();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando ativos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={ativos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
    <Text style={styles.titulo}>{item.nome}</Text>
    <Text>Classe: {item.classe}</Text>
    <Text>Risco: {item.risco}</Text>
    <Text>Liquidez: {item.liquidez}</Text>
  </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  titulo: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
});

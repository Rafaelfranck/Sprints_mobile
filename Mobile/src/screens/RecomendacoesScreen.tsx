import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../../App";
import { db } from "../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";

type Props = BottomTabScreenProps<TabParamList, "Recomendacoes">;

type Cliente = {
  nome: string;
  idade: number;
  perfilRisco: "conservador" | "moderado" | "agressivo";
};

export default function RecomendacoesScreen({ navigation }: Props) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "clientes", "perfilAtual");

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setCliente(snap.data() as Cliente);
        } else {
          setCliente(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("onSnapshot error:", err);
        setCliente(null);
        setLoading(false);
      }
    );

    return unsub; // limpa listener ao desmontar
  }, []);

  function gerarRecomendacao(perfil: Cliente["perfilRisco"]) {
    switch (perfil) {
      case "conservador":
        return "Carteira recomendada: 80% Renda Fixa, 20% Fundos Imobiliários.";
      case "moderado":
        return "Carteira recomendada: 50% Renda Fixa, 30% Fundos Imobiliários, 20% Ações.";
      case "agressivo":
        return "Carteira recomendada: 20% Renda Fixa, 30% Fundos Imobiliários, 50% Ações.";
      default:
        return "Defina seu perfil para receber recomendações.";
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando recomendações...</Text>
      </SafeAreaView>
    );
  }

  if (!cliente) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titulo}>Nenhum perfil encontrado.</Text>
        <Text>Salve seu perfil na aba Perfil para receber recomendações.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.titulo}>Recomendações de Carteira</Text>
        <Text style={styles.perfil}>Perfil: {cliente.perfilRisco}</Text>
        <Text style={styles.recomendacao}>
          {gerarRecomendacao(cliente.perfilRisco)}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  perfil: { fontSize: 16, marginBottom: 10 },
  recomendacao: { fontSize: 16, fontWeight: "500", color: "#333" },
});

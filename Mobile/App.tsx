import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeScreen from "./src/screens/HomeScreen";
import PerfilScreen from "./src/screens/PerfilScreen";
import AtivosScreen from "./src/screens/AtivosScreen";
import CarteiraScreen from "./src/screens/CarteiraScreen";
import RecomendacoesScreen from "./src/screens/RecomendacoesScreen";

// 🔹 Tipos
export type Ativo = {
  id: string;
  nome: string;
  classe: string;
  risco: number;
  liquidez: string;
};

export type RootStackParamList = {
  Home: undefined;
  Tabs: undefined;
};

export type TabParamList = {
  Perfil: undefined;
  Ativos: undefined;
  Carteira: undefined;
  Recomendacoes: undefined;
};

// 🔹 Criando navegadores
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// 🔹 Botão de Logout (reutilizável)
function LogoutButton({ navigation }: any) {
  return (
    <TouchableOpacity
      style={{ marginRight: 15 }}
      onPress={async () => {
        await AsyncStorage.removeItem("usuario");
        navigation.getParent()?.navigate("Home"); // Volta para login
      }}
    >
      <Ionicons name="log-out-outline" size={24} color="red" />
    </TouchableOpacity>
  );
}

// 🔹 Tabs (abas inferiores)
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Perfil") iconName = "person";
          if (route.name === "Ativos") iconName = "briefcase";
          if (route.name === "Carteira") iconName = "pie-chart";
          if (route.name === "Recomendacoes") iconName = "star";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Perfil",
          headerRight: () => <LogoutButton navigation={navigation} />,
        })}
      />
      <Tab.Screen
        name="Ativos"
        component={AtivosScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Ativos",
          headerRight: () => <LogoutButton navigation={navigation} />,
        })}
      />
      <Tab.Screen
        name="Carteira"
        component={CarteiraScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Carteira",
          headerRight: () => <LogoutButton navigation={navigation} />,
        })}
      />
      <Tab.Screen
        name="Recomendacoes"
        component={RecomendacoesScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Recomendações",
          headerRight: () => <LogoutButton navigation={navigation} />,
        })}
      />
    </Tab.Navigator>
  );
}

// 🔹 Navegação principal (Stack)
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Tela inicial = Login */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        {/* Tabs depois do login */}
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

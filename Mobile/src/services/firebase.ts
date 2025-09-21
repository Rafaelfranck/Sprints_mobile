import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔑 Configuração do Firebase gerada no Console
const firebaseConfig = {
  apiKey: "AIzaSyAbFyoRMtAu06LB39fVO2Fi7a6NdaxLIpw",
  authDomain: "assessor-virtual-c0f6c.firebaseapp.com",
  projectId: "assessor-virtual-c0f6c",
  storageBucket: "assessor-virtual-c0f6c.appspot.com",
  messagingSenderId: "683031957027",
  appId: "1:683031957027:web:abbfcfd443ec08911f2b96",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o Firestore
export const db = getFirestore(app);

#  Assessor Virtual – Mobile Development and IoT  

##  Integrantes  
Rafael Franck (RM550875), Gabriela Trevisan (RM99500), Eduardo Araujo (RM99758) e Leonardo Bonini (RM551716)  

##  Funcionalidades  
 Tela de Login (HomeScreen)  
- Login com credenciais fixas (usuário: professor | senha: 1234)  
- Persistência de sessão com AsyncStorage  
- Botão Sair para encerrar sessão  

 Perfil  
- Cadastro de perfil do usuário (nome, idade, perfil de risco)  
- Integração completa com Firebase (CRUD)  
- Atualização em tempo real  

 Ativos  
- Listagem de ativos disponíveis (Tesouro, CDB, Ações, FIIs, etc.)  
- Dados salvos e carregados do Firestore  
- Renderização com FlatList  

 Carteira  
- Criação de carteiras personalizadas com múltiplos ativos  
- Persistência no Firebase  
- Listagem de carteiras salvas  

 Recomendações  
- Geração de recomendações automáticas de alocação de ativos  
- Baseadas no perfil de risco do usuário: Conservador, Moderado, Agressivo  

##  Tecnologias Utilizadas  
React Native (Expo), TypeScript, React Navigation (TabNavigator + StackNavigator), Firebase Firestore, AsyncStorage, SafeAreaView (react-native-safe-area-context)  

##  Credenciais de Login  
Usuário: professor  
Senha: 1234  

##  Como Rodar o Projeto  
1. Clone este repositório: 
bash
git clone <link-do-repo>
cd <pasta-do-projeto>

2. Instale as dependências:
npm install

3. Configure o Firebase no arquivo:
src/services/firebase.ts

4. Execute o app:
npx expo start
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface Filme {
  id?: string;
  nome: string;
  ano: string;
  idadeIndicativa: string;
  genero: string;
  diretor: string;
}

const FILMES_INICIAIS: Omit<Filme, 'id'>[] = [
  {
    nome: "O Padrinho (The Godfather)",
    ano: "1972",
    idadeIndicativa: "16",
    genero: "Crime / Drama",
    diretor: "Francis Ford Coppola"
  },
  {
    nome: "A Viagem de Chihiro",
    ano: "2001",
    idadeIndicativa: "Livre",
    genero: "Animação / Fantasia",
    diretor: "Hayao Miyazaki"
  },
  {
    nome: "Pulp Fiction: Tempo de Violência",
    ano: "1994",
    idadeIndicativa: "18",
    genero: "Crime / Thriller",
    diretor: "Quentin Tarantino"
  },
  {
    nome: "Parasita",
    ano: "2019",
    idadeIndicativa: "16",
    genero: "Drama / Suspense",
    diretor: "Bong Joon-ho"
  },
  {
    nome: "Interestelar",
    ano: "2014",
    idadeIndicativa: "10",
    genero: "Ficção Científica",
    diretor: "Christopher Nolan"
  }
];

export default function App() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busca, setBusca] = useState<string>('');
  const [modalVisivel, setModalVisivel] = useState<boolean>(false);

  const [nome, setNome] = useState('');
  const [ano, setAno] = useState('');
  const [idadeIndicativa, setIdadeIndicativa] = useState('');
  const [genero, setGenero] = useState('');
  const [diretor, setDiretor] = useState('');

  const filmesRef = collection(db, 'filmes');

  const carregarFilmes = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(filmesRef);
      
      if (snapshot.empty) {
        for (const item of FILMES_INICIAIS) {
          await addDoc(filmesRef, item);
        }
        carregarFilmes();
        return;
      }

      const listaFilmes: Filme[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Filme[];

      setFilmes(listaFilmes);
    } catch (error) {
      console.error("Erro ao carregar filmes:", error);
      Alert.alert("Erro", "Não foi possível carregar o catálogo de filmes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarFilmes();
  }, []);

  const handleCadastrar = async () => {
    if (!nome.trim() || !ano.trim() || !idadeIndicativa.trim() || !genero.trim() || !diretor.trim()) {
      Alert.alert("Campos incompletos", "Por favor, preencha todos os campos do filme.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(filmesRef, {
        nome: nome.trim(),
        ano: ano.trim(),
        idadeIndicativa: idadeIndicativa.trim(),
        genero: genero.trim(),
        diretor: diretor.trim()
      });

      setNome('');
      setAno('');
      setIdadeIndicativa('');
      setGenero('');
      setDiretor('');
      setModalVisivel(false);

      Alert.alert("Sucesso!", "Filme cadastrado no catálogo.");
      carregarFilmes();
    } catch (error) {
      console.error("Erro ao cadastrar filme:", error);
      Alert.alert("Erro", "Falha ao cadastrar o filme.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = (id: string, titulo: string) => {
    Alert.alert(
      "Excluir Filme",
      `Tem certeza que deseja remover "${titulo}" do catálogo?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteDoc(doc(db, 'filmes', id));
              Alert.alert("Removido", "O filme foi excluído com sucesso.");
              carregarFilmes();
            } catch (error) {
              console.error("Erro ao excluir filme:", error);
              Alert.alert("Erro", "Não foi possível excluir o filme.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const filmesFiltrados = filmes.filter(filme => 
    filme.nome.toLowerCase().includes(busca.toLowerCase()) ||
    filme.genero.toLowerCase().includes(busca.toLowerCase()) ||
    filme.diretor.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerLogo}>🎬</Text>
          <Text style={styles.headerTitle}>CineTop</Text>
        </View>
        <TouchableOpacity 
          style={styles.btnNovoFilme}
          onPress={() => setModalVisivel(true)}
        >
          <Text style={styles.btnNovoFilmeTexto}>+ Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar por título, gênero ou diretor..."
          placeholderTextColor="#64748b"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e11d48" />
          <Text style={styles.loadingText}>Conectando ao Firebase...</Text>
        </View>
      ) : (
        <FlatList
          data={filmesFiltrados}
          keyExtractor={(item) => item.id || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  <Text style={styles.cardDirector}>Direção: {item.diretor}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => item.id && handleExcluir(item.id, item.nome)}
                  style={styles.btnExcluir}
                >
                  <Text style={styles.btnExcluirTexto}>🗑️</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tagContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>📅 {item.ano} | 🔞 {item.idadeIndicativa} | 🍿 {item.genero}</Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum filme encontrado.</Text>
            </View>
          }
        />
      )}

      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Cadastrar Novo Filme</Text>
                <TouchableOpacity onPress={() => setModalVisivel(false)}>
                  <Text style={styles.btnClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Título do Filme</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: O Poderoso Chefão"
                placeholderTextColor="#64748b"
                value={nome}
                onChangeText={setNome}
              />

              <Text style={styles.label}>Diretor</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Francis Ford Coppola"
                placeholderTextColor="#64748b"
                value={diretor}
                onChangeText={setDiretor}
              />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>Ano de Lançamento</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 1972"
                    placeholderTextColor="#64748b"
                    keyboardType="numeric"
                    value={ano}
                    onChangeText={setAno}
                  />
                </View>

                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.label}>Idade Indicativa</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 16"
                    placeholderTextColor="#64748b"
                    value={idadeIndicativa}
                    onChangeText={setIdadeIndicativa}
                  />
                </View>
              </View>

              <Text style={styles.label}>Gênero</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Crime / Drama"
                placeholderTextColor="#64748b"
                value={genero}
                onChangeText={setGenero}
              />

              <TouchableOpacity style={styles.btnSalvar} onPress={handleCadastrar}>
                <Text style={styles.btnSalvarTexto}>Salvar Filme</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    fontSize: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  btnNovoFilme: {
    backgroundColor: '#e11d48',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnNovoFilmeTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 46,
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 10,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardDirector: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  btnExcluir: {
    padding: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 6,
  },
  btnExcluirTexto: {
    fontSize: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#090d16',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeText: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  btnClose: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 10,
    color: '#cbd5e1',
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: '#334155',
  },
  row: {
    flexDirection: 'row',
  },
  btnSalvar: {
    backgroundColor: '#e11d48',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  btnSalvarTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
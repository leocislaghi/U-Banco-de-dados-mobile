# 🎬 CineTop - Catálogo de Filmes Aclamados

Este projeto é um aplicativo mobile desenvolvido em **React Native com TypeScript (`.tsx`)**, voltado para a consulta, cadastro e exclusão de filmes considerados os melhores de todos os tempos. O aplicativo conta com persistência de dados em tempo real utilizando o **Firebase Cloud Firestore** e possui uma interface moderna otimizada em **Modo Escuro (Dark Mode)**.

## 🚀 Como foi feito

O aplicativo foi estruturado pensando em performance, tipagem estática segura e uma experiência de usuário fluida:
* **Frontend & UI:** Desenvolvido de forma nativa com componentes do React Native e estilizado via `StyleSheet`, garantindo compatibilidade total e visual imersivo estilo streaming.
* **Tipagem e Segurança:** Utilização de interfaces e tipagens em TypeScript (`.tsx`) para gerenciar a estrutura dos dados dos filmes e evitar erros de compilação.
* **Banco de Dados (Backend as a Service):** Integração direta com o **Firebase Firestore** para operações completas de CRUD (Create, Read, Delete), permitindo que os filmes cadastrados ou excluídos sejam sincronizados instantaneamente na nuvem.
* **Experiência do Usuário (UX):** Conta com listagem dinâmica, barra de pesquisa em tempo real (filtrando por título, gênero ou diretor), estados de carregamento e modais com fundo opaco para o cadastro de novos clássicos do cinema.
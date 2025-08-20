# Sistema de Matrícula - Flask + MySQL

Um sistema completo de gestão de matrículas desenvolvido com Python Flask, oferecendo uma interface web moderna e intuitiva para gerenciar alunos e cursos.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Características](#características)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Instalação e Configuração](#instalação-e-configuração)
6. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
7. [Como Usar](#como-usar)
8. [API Endpoints](#api-endpoints)
9. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
10. [Capturas de Tela](#capturas-de-tela)
11. [Desenvolvimento](#desenvolvimento)
12. [Contribuição](#contribuição)
13. [Licença](#licença)

## 🎯 Visão Geral

O Sistema de Matrícula é uma aplicação web full-stack que permite o gerenciamento completo de alunos e cursos em uma instituição educacional. O sistema oferece funcionalidades para cadastrar, editar, visualizar e excluir registros de alunos, além de gerenciar informações sobre cursos disponíveis.

### Principais Funcionalidades

- **Gestão de Alunos**: Cadastro, edição, visualização e exclusão de alunos
- **Gestão de Cursos**: Visualização de cursos disponíveis com informações detalhadas
- **Interface Responsiva**: Design moderno que funciona em desktop e dispositivos móveis
- **Validação de Dados**: Validação tanto no frontend quanto no backend
- **Notificações**: Sistema de notificações toast para feedback do usuário
- **Estatísticas**: Dashboard com estatísticas em tempo real
- **API RESTful**: Endpoints bem estruturados seguindo padrões REST

## ✨ Características

### Frontend
- Interface moderna com design responsivo
- Navegação por abas intuitiva
- Formulários com validação em tempo real
- Modal para edição de registros
- Sistema de notificações toast
- Loading states para melhor UX
- Animações e transições suaves

### Backend
- API RESTful com Flask
- Modelos de dados com SQLAlchemy
- Validação de dados robusta
- Tratamento de erros abrangente
- Suporte a CORS para integração frontend
- Estrutura modular e escalável

### Banco de Dados
- Suporte a MySQL e SQLite
- Relacionamentos entre tabelas
- Integridade referencial
- Migrações automáticas

## 🛠 Tecnologias Utilizadas

### Backend
- **Python 3.11+**
- **Flask** - Framework web minimalista
- **Flask-SQLAlchemy** - ORM para banco de dados
- **Flask-CORS** - Suporte a Cross-Origin Resource Sharing
- **PyMySQL** - Driver MySQL para Python

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com Flexbox e Grid
- **JavaScript (ES6+)** - Funcionalidades interativas
- **Font Awesome** - Ícones vetoriais

### Banco de Dados
- **MySQL** - Banco principal (produção)
- **SQLite** - Banco para desenvolvimento e testes

## 📁 Estrutura do Projeto

```
sistema_matricula/
├── venv/                          # Ambiente virtual Python
├── src/                           # Código fonte da aplicação
│   ├── models/                    # Modelos de dados
│   │   ├── user.py               # Modelo base e configuração DB
│   │   └── matricula.py          # Modelos Curso e Aluno
│   ├── routes/                    # Rotas da API
│   │   ├── user.py               # Rotas de usuário (template)
│   │   └── matricula.py          # Rotas de matrícula
│   ├── static/                    # Arquivos estáticos
│   │   ├── index.html            # Interface principal
│   │   ├── styles.css            # Estilos CSS
│   │   └── script.js             # JavaScript da aplicação
│   ├── database/                  # Banco de dados SQLite
│   │   └── app.db                # Arquivo do banco SQLite
│   ├── main.py                   # Aplicação principal Flask
│   └── populate_db.py            # Script para popular BD
├── requirements.txt               # Dependências Python
└── README.md                     # Documentação do projeto
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Python 3.11 ou superior
- MySQL 8.0+ (opcional, para produção)
- Git

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd sistema_matricula
```

2. **Ative o ambiente virtual**
```bash
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

3. **Instale as dependências**
```bash
pip install -r requirements.txt
```

4. **Configure o banco de dados**

Para desenvolvimento (SQLite - padrão):
```bash
python src/populate_db.py
```

Para produção (MySQL):
```python
# Edite src/main.py e altere a linha:
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://usuario:senha@localhost/gestao_alunos'
```

5. **Execute a aplicação**
```bash
python src/main.py
```

6. **Acesse a aplicação**
```
http://localhost:5000
```

## 🗄 Configuração do Banco de Dados

### MySQL (Produção)

1. **Crie o banco de dados**
```sql
CREATE DATABASE gestao_alunos;
USE gestao_alunos;

CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_curso VARCHAR(100) NOT NULL,
    duracao INT NOT NULL
);

CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    curso_id INT,
    data_matricula DATE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

INSERT INTO cursos (nome_curso, duracao) VALUES
('Gestão de TI', 24),
('Desenvolvimento de Sistemas', 18);
```

2. **Configure a conexão**
```python
# Em src/main.py
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://usuario:senha@localhost/gestao_alunos'
```

### SQLite (Desenvolvimento)

O SQLite é configurado automaticamente. O arquivo do banco será criado em `src/database/app.db`.

## 📖 Como Usar

### Interface Web

1. **Acesse** `http://localhost:5000`
2. **Navegue** pelas abas: Alunos, Cursos, Nova Matrícula
3. **Cadastre** novos alunos na aba "Nova Matrícula"
4. **Visualize** alunos matriculados na aba "Alunos"
5. **Edite** ou **exclua** alunos usando os botões de ação
6. **Consulte** cursos disponíveis na aba "Cursos"

### Funcionalidades Detalhadas

#### Cadastro de Aluno
1. Clique na aba "Nova Matrícula"
2. Preencha nome completo, email e selecione um curso
3. Clique em "Matricular Aluno"
4. O sistema validará os dados e criará o registro

#### Edição de Aluno
1. Na aba "Alunos", clique no botão "Editar"
2. Modifique os dados no modal que abrir
3. Clique em "Salvar" para confirmar as alterações

#### Exclusão de Aluno
1. Na aba "Alunos", clique no botão "Excluir"
2. Confirme a exclusão no diálogo que aparecer

## 🔌 API Endpoints

### Cursos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/cursos` | Lista todos os cursos |
| POST | `/api/cursos` | Cria um novo curso |
| GET | `/api/cursos/<id>` | Obtém um curso específico |

### Alunos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/alunos` | Lista todos os alunos |
| POST | `/api/alunos` | Matricula um novo aluno |
| GET | `/api/alunos/<id>` | Obtém um aluno específico |
| PUT | `/api/alunos/<id>` | Atualiza dados de um aluno |
| DELETE | `/api/alunos/<id>` | Exclui um aluno |

### Estatísticas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/estatisticas` | Obtém estatísticas do sistema |

### Exemplos de Uso da API

#### Criar um novo aluno
```bash
curl -X POST http://localhost:5000/api/alunos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "curso_id": 1
  }'
```

#### Listar todos os alunos
```bash
curl http://localhost:5000/api/alunos
```

#### Atualizar um aluno
```bash
curl -X PUT http://localhost:5000/api/alunos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva Santos",
    "email": "maria.santos@email.com",
    "curso_id": 2
  }'
```

## 🗃 Estrutura do Banco de Dados

### Tabela: cursos
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT (PK) | Identificador único do curso |
| nome_curso | VARCHAR(100) | Nome do curso |
| duracao | INT | Duração em meses |

### Tabela: alunos
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT (PK) | Identificador único do aluno |
| nome | VARCHAR(100) | Nome completo do aluno |
| email | VARCHAR(100) | Email único do aluno |
| curso_id | INT (FK) | Referência ao curso |
| data_matricula | DATE | Data da matrícula |

### Relacionamentos
- Um curso pode ter vários alunos (1:N)
- Um aluno pertence a um curso (N:1)

## 🔧 Desenvolvimento

### Estrutura de Arquivos

#### Modelos (`src/models/`)
- `user.py`: Configuração base do SQLAlchemy
- `matricula.py`: Modelos Curso e Aluno com relacionamentos

#### Rotas (`src/routes/`)
- `matricula.py`: Endpoints da API para gestão de matrículas
- `user.py`: Template de rotas para usuários

#### Frontend (`src/static/`)
- `index.html`: Interface principal com navegação por abas
- `styles.css`: Estilos responsivos com design moderno
- `script.js`: Funcionalidades JavaScript e integração com API

### Padrões de Código

#### Backend
- Uso de Blueprints para organização de rotas
- Modelos com métodos `to_dict()` para serialização
- Tratamento de erros com códigos HTTP apropriados
- Validação de dados de entrada

#### Frontend
- Separação de responsabilidades (HTML, CSS, JS)
- Uso de async/await para chamadas à API
- Sistema de notificações para feedback do usuário
- Design responsivo com mobile-first

### Adicionando Novas Funcionalidades

#### Novo Modelo
1. Crie o modelo em `src/models/`
2. Importe no `main.py`
3. Execute `db.create_all()` para criar tabelas

#### Nova Rota
1. Adicione a rota em `src/routes/`
2. Registre o Blueprint no `main.py`
3. Teste os endpoints

#### Nova Interface
1. Adicione HTML em `index.html`
2. Estilize em `styles.css`
3. Implemente funcionalidade em `script.js`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no GitHub.

---

**Desenvolvido com ❤️ usando Flask e tecnologias modernas**



## 🐳 Suporte a Docker

O projeto inclui configurações para Docker, permitindo que você execute a aplicação e o banco de dados em contêineres, facilitando o desenvolvimento e a implantação.

### Pré-requisitos para Docker
- **Docker Desktop** (para Windows/macOS) ou **Docker Engine** (para Linux)
- **Docker Compose** (geralmente incluído no Docker Desktop)

### Como usar Docker

1. **Construir e iniciar os contêineres (desenvolvimento)**
```bash
docker-compose up --build
```

2. **Acessar a aplicação**
   Após os contêineres estarem em execução, a aplicação Flask estará disponível em `http://localhost:5000`.

3. **Parar os contêineres**
```bash
docker-compose down
```

### Observações
- O `docker-compose.yml` configura um serviço `web` (sua aplicação Flask) e um serviço `db` (banco de dados MySQL).
- O banco de dados MySQL será inicializado com o esquema e os dados iniciais definidos em `database_setup.sql`.
- Para produção, considere usar um `docker-compose.prod.yml` com configurações otimizadas (ex: Gunicorn, volumes persistentes para logs, etc.).



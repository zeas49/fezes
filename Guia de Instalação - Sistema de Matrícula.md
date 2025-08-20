# Guia de Instalação - Sistema de Matrícula

Este guia fornece instruções detalhadas para instalar e configurar o Sistema de Matrícula em diferentes ambientes.

## 📋 Requisitos do Sistema

### Requisitos Mínimos
- **Sistema Operacional**: Windows 10+, macOS 10.14+, ou Linux (Ubuntu 18.04+)
- **Python**: 3.11 ou superior
- **RAM**: 2GB mínimo, 4GB recomendado
- **Espaço em Disco**: 500MB para a aplicação e dependências
- **Navegador**: Chrome 90+, Firefox 88+, Safari 14+, ou Edge 90+

### Requisitos para Produção
- **MySQL**: 8.0 ou superior
- **RAM**: 8GB recomendado
- **CPU**: 2 cores mínimo
- **Espaço em Disco**: 2GB para logs e banco de dados

## 🔧 Instalação Passo a Passo

### 1. Preparação do Ambiente

#### Windows
```powershell
# Instalar Python (se não estiver instalado)
# Baixe de https://python.org/downloads/

# Verificar instalação
python --version
pip --version

# Instalar MySQL (opcional, para produção)
# Baixe de https://dev.mysql.com/downloads/mysql/
```

#### macOS
```bash
# Instalar Homebrew (se não estiver instalado)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Python
brew install python@3.11

# Instalar MySQL (opcional)
brew install mysql
```

#### Linux (Ubuntu/Debian)
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Python e pip
sudo apt install python3.11 python3.11-venv python3-pip -y

# Instalar MySQL (opcional)
sudo apt install mysql-server -y
```

### 2. Download e Configuração do Projeto

```bash
# Clonar o repositório (substitua pela URL real)
git clone https://github.com/seu-usuario/sistema-matricula.git
cd sistema-matricula

# Verificar se o ambiente virtual já existe
ls -la venv/

# Se não existir, criar ambiente virtual
python3.11 -m venv venv

# Ativar ambiente virtual
# Linux/macOS:
source venv/bin/activate

# Windows:
venv\Scripts\activate

# Verificar ativação (deve mostrar (venv) no prompt)
which python  # Linux/macOS
where python   # Windows
```

### 3. Instalação de Dependências

```bash
# Instalar dependências
pip install --upgrade pip
pip install -r requirements.txt

# Verificar instalação
pip list
```

### 4. Configuração do Banco de Dados

#### Opção A: SQLite (Desenvolvimento - Recomendado para Início)
```bash
# Popular banco com dados iniciais
python src/populate_db.py
```

#### Opção B: MySQL (Produção)

1. **Configurar MySQL**
```sql
-- Conectar ao MySQL como root
mysql -u root -p

-- Criar banco de dados
CREATE DATABASE gestao_alunos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário específico (recomendado)
CREATE USER 'matricula_user'@'localhost' IDENTIFIED BY 'senha_segura_123';
GRANT ALL PRIVILEGES ON gestao_alunos.* TO 'matricula_user'@'localhost';
FLUSH PRIVILEGES;

-- Verificar criação
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'matricula_user';
```

2. **Configurar aplicação para MySQL**
```python
# Editar src/main.py
# Localizar a linha:
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"

# Substituir por:
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://matricula_user:senha_segura_123@localhost/gestao_alunos'
```

3. **Criar tabelas e popular dados**
```bash
python src/populate_db.py
```

### 5. Teste da Instalação

```bash
# Iniciar aplicação
python src/main.py

# A aplicação deve mostrar:
# * Running on http://127.0.0.1:5000
# * Running on http://0.0.0.0:5000
```

Abra seu navegador e acesse: `http://localhost:5000`

### 6. Verificação da Instalação

#### Checklist de Verificação
- [ ] Página inicial carrega sem erros
- [ ] Aba "Cursos" mostra 2 cursos (Gestão de TI e Desenvolvimento de Sistemas)
- [ ] Aba "Alunos" mostra tabela vazia inicialmente
- [ ] Formulário "Nova Matrícula" permite cadastrar aluno
- [ ] Estatísticas no topo mostram contadores corretos
- [ ] Não há erros no console do navegador (F12)

#### Teste Funcional Básico
1. Vá para "Nova Matrícula"
2. Preencha: Nome: "Teste Silva", Email: "teste@email.com", Curso: "Gestão de TI"
3. Clique "Matricular Aluno"
4. Verifique se aparece notificação de sucesso
5. Vá para aba "Alunos" e verifique se o aluno aparece na tabela
6. Teste edição clicando em "Editar"
7. Teste exclusão clicando em "Excluir"

## 🚀 Configuração para Produção

### 1. Variáveis de Ambiente
```bash
# Criar arquivo .env
cat > .env << EOF
FLASK_ENV=production
SECRET_KEY=sua_chave_secreta_muito_segura_aqui
DATABASE_URL=mysql://matricula_user:senha_segura_123@localhost/gestao_alunos
EOF
```

### 2. Configuração do Servidor Web

#### Usando Gunicorn
```bash
# Instalar Gunicorn
pip install gunicorn

# Executar aplicação
gunicorn --bind 0.0.0.0:5000 --workers 4 src.main:app
```

#### Usando Nginx (Proxy Reverso)
```nginx
# /etc/nginx/sites-available/sistema-matricula
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static {
        alias /caminho/para/sistema-matricula/src/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Configuração de SSL (HTTPS)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com
```

### 4. Backup do Banco de Dados
```bash
# Criar script de backup
cat > backup_db.sh << EOF
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u matricula_user -p gestao_alunos > backup_\$DATE.sql
EOF

chmod +x backup_db.sh

# Configurar cron para backup diário
crontab -e
# Adicionar linha:
# 0 2 * * * /caminho/para/backup_db.sh
```

## 🔍 Solução de Problemas

### Problemas Comuns

#### Erro: "ModuleNotFoundError"
```bash
# Verificar se ambiente virtual está ativo
which python
# Deve mostrar caminho com 'venv'

# Reativar ambiente virtual
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Reinstalar dependências
pip install -r requirements.txt
```

#### Erro: "Access denied for user"
```bash
# Verificar credenciais MySQL
mysql -u matricula_user -p

# Recriar usuário se necessário
mysql -u root -p
DROP USER 'matricula_user'@'localhost';
CREATE USER 'matricula_user'@'localhost' IDENTIFIED BY 'nova_senha';
GRANT ALL PRIVILEGES ON gestao_alunos.* TO 'matricula_user'@'localhost';
```

#### Erro: "Port 5000 already in use"
```bash
# Encontrar processo usando porta 5000
lsof -i :5000  # Linux/macOS
netstat -ano | findstr :5000  # Windows

# Matar processo
kill -9 PID  # Linux/macOS
taskkill /PID PID /F  # Windows

# Ou usar porta diferente
python src/main.py --port 5001
```

#### Página não carrega estilos
```bash
# Verificar se arquivos estáticos existem
ls -la src/static/

# Verificar permissões
chmod 644 src/static/*

# Limpar cache do navegador (Ctrl+F5)
```

### Logs e Debugging

#### Habilitar logs detalhados
```python
# Em src/main.py, adicionar:
import logging
logging.basicConfig(level=logging.DEBUG)
```

#### Verificar logs do MySQL
```bash
# Ubuntu/Debian
sudo tail -f /var/log/mysql/error.log

# CentOS/RHEL
sudo tail -f /var/log/mysqld.log
```

### Performance

#### Otimizações recomendadas
```python
# Em src/main.py
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_size': 10,
    'pool_recycle': 120,
    'pool_pre_ping': True
}
```

## 📞 Suporte

### Antes de Solicitar Ajuda
1. Verifique se seguiu todos os passos
2. Consulte a seção "Solução de Problemas"
3. Verifique logs de erro
4. Teste em ambiente limpo

### Como Reportar Problemas
1. Descreva o problema detalhadamente
2. Inclua mensagens de erro completas
3. Informe sistema operacional e versão do Python
4. Descreva passos para reproduzir o problema

### Informações do Sistema
```bash
# Coletar informações para suporte
echo "=== INFORMAÇÕES DO SISTEMA ==="
uname -a
python --version
pip --version
echo "=== DEPENDÊNCIAS INSTALADAS ==="
pip list
echo "=== ESTRUTURA DO PROJETO ==="
find . -name "*.py" | head -20
```

---

**Instalação concluída com sucesso? Acesse o [README.md](README.md) para instruções de uso!**



## 🐳 Executando com Docker

Para uma experiência de desenvolvimento e implantação mais consistente, você pode usar o Docker para rodar a aplicação e o banco de dados em contêineres.

### Pré-requisitos
- **Docker Desktop** (para Windows e macOS) ou **Docker Engine** (para Linux)
- **Docker Compose** (geralmente incluído na instalação do Docker Desktop)

### Passos para Executar com Docker

1. **Navegue até o diretório raiz do projeto:**
   Certifique-se de estar no mesmo diretório onde o `docker-compose.yml` está localizado.
   ```bash
   cd /caminho/para/seu/sistema-matricula
   ```

2. **Construa e inicie os contêineres:**
   Este comando irá construir a imagem Docker da sua aplicação Flask e iniciar os serviços definidos no `docker-compose.yml`, incluindo o banco de dados MySQL.
   ```bash
   docker-compose up --build
   ```
   - A primeira execução pode demorar um pouco, pois o Docker precisa baixar as imagens base e construir a imagem da sua aplicação.
   - O script `database_setup.sql` será executado automaticamente no contêiner do MySQL para criar o banco de dados e as tabelas, além de popular os cursos iniciais.

3. **Acesse a aplicação:**
   Após os contêineres estarem em execução (você verá logs de inicialização no terminal), a aplicação Flask estará acessível no seu navegador:
   ```
   http://localhost:5000
   ```

4. **Para parar os contêineres:**
   Quando você terminar de usar a aplicação, pode parar e remover os contêineres com o seguinte comando:
   ```bash
   docker-compose down
   ```

### Estrutura do `docker-compose.yml`

O arquivo `docker-compose.yml` define dois serviços:

- **`web`**: Representa a sua aplicação Flask.
  - `build`: Instruções para construir a imagem Docker a partir do `Dockerfile` no diretório atual.
  - `ports`: Mapeia a porta 5000 do contêiner para a porta 5000 da sua máquina local, permitindo o acesso via navegador.
  - `volumes`: Monta o diretório do projeto (`.`) dentro do contêiner (`/app`), o que permite que as alterações no código sejam refletidas sem a necessidade de reconstruir a imagem (útil para desenvolvimento).
  - `environment`: Define variáveis de ambiente, incluindo a string de conexão com o banco de dados MySQL que está rodando no serviço `db`.
  - `depends_on`: Garante que o serviço `db` seja iniciado antes do serviço `web`.

- **`db`**: Representa o banco de dados MySQL.
  - `image`: Usa a imagem oficial do MySQL 8.0.
  - `command`: Define opções de inicialização para o MySQL.
  - `environment`: Configura as variáveis de ambiente para o MySQL, como a senha do root e o nome do banco de dados.
  - `volumes`: 
    - `db_data:/var/lib/mysql`: Cria um volume persistente para os dados do MySQL, garantindo que seus dados não sejam perdidos quando o contêiner for parado ou removido.
    - `./database_setup.sql:/docker-entrypoint-initdb.d/database_setup.sql`: Copia o script SQL de configuração do banco de dados para um diretório especial no contêiner MySQL. Qualquer arquivo `.sql` colocado neste diretório será executado automaticamente na primeira inicialização do contêiner.
  - `ports`: Mapeia a porta 3306 do contêiner para a porta 3306 da sua máquina local, permitindo que você acesse o banco de dados diretamente (por exemplo, com um cliente MySQL).

### Dicas para Produção com Docker

Para um ambiente de produção, considere as seguintes melhorias:

- **Gunicorn**: Altere o `CMD` no `Dockerfile` para usar Gunicorn (ou outro WSGI server) em vez do servidor de desenvolvimento do Flask, que não é recomendado para produção.
- **Volumes Persistentes**: Garanta que todos os dados importantes (como logs e uploads) estejam em volumes persistentes.
- **Variáveis de Ambiente Seguras**: Não coloque senhas diretamente no `docker-compose.yml`. Use variáveis de ambiente do sistema ou segredos do Docker.
- **Redes**: Configure redes Docker de forma mais granular para isolar serviços.
- **Docker Compose para Produção**: Crie um arquivo `docker-compose.prod.yml` separado com configurações otimizadas para produção (ex: sem montagem de volume de código, mais réplicas, etc.).

```yaml
# Exemplo de docker-compose.prod.yml (apenas para referência)
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:5000"
    environment:
      FLASK_ENV: production
      SQLALCHEMY_DATABASE_URI: mysql+pymysql://matricula_user:sua_senha_segura@db/gestao_alunos
    depends_on:
      - db
    networks:
      - app-network
    restart: always
    # CMD ["gunicorn", "--bind", "0.0.0.0:5000", "src.main:app"]

  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: sua_senha_root_segura
      MYSQL_DATABASE: gestao_alunos
      MYSQL_USER: matricula_user
      MYSQL_PASSWORD: sua_senha_segura
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - app-network

volumes:
  db_data:

networks:
  app-network:
    driver: bridge
```

Com o Docker, você pode facilmente empacotar e executar sua aplicação em qualquer ambiente que suporte Docker, garantindo consistência e reprodutibilidade.


1# Use a imagem oficial do Python como base
FROM python:3.11-slim-buster

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o arquivo de dependências e instalar
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que o Flask vai rodar
EXPOSE 5000

# Definir variáveis de ambiente para o Flask
ENV FLASK_APP=src/main.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

# Comando para rodar a aplicação usando Gunicorn (recomendado para produção)
# Instale gunicorn no requirements.txt se for usar esta linha
# CMD ["gunicorn", "--bind", "0.0.0.0:5000", "src.main:app"]

# Comando para rodar a aplicação usando o servidor de desenvolvimento do Flask
CMD ["python", "-m", "flask", "run"]


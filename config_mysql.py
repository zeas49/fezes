"""
Arquivo de configuração para conexão com MySQL
Copie este arquivo e ajuste as configurações conforme seu ambiente
"""

import os

class Config:
    """Configuração base da aplicação"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'sua_chave_secreta_muito_segura_aqui'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
class DevelopmentConfig(Config):
    """Configuração para ambiente de desenvolvimento"""
    DEBUG = True
    # SQLite para desenvolvimento
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(os.path.dirname(__file__), 'src', 'database', 'app.db')

class ProductionConfig(Config):
    """Configuração para ambiente de produção"""
    DEBUG = False
    # MySQL para produção
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'mysql://matricula_user:senha_segura_123@localhost/gestao_alunos'
    
    # Configurações otimizadas para produção
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'pool_recycle': 120,
        'pool_pre_ping': True,
        'connect_args': {
            'charset': 'utf8mb4',
            'autocommit': True
        }
    }

class TestingConfig(Config):
    """Configuração para testes"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

# Dicionário de configurações
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

# Exemplo de uso no main.py:
"""
from config_mysql import config

# Obter ambiente atual
config_name = os.environ.get('FLASK_ENV', 'development')

# Aplicar configuração
app.config.from_object(config[config_name])
"""


-- =====================================================
-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS MYSQL
-- Sistema de Matrícula - Gestão de Alunos
-- =====================================================

-- 1. CRIAR BANCO DE DADOS
-- Execute como usuário root do MySQL
CREATE DATABASE IF NOT EXISTS gestao_alunos 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. CRIAR USUÁRIO ESPECÍFICO PARA A APLICAÇÃO
-- Substitua 'senha_segura_123' por uma senha forte
CREATE USER IF NOT EXISTS 'matricula_user'@'localhost' 
IDENTIFIED BY 'senha_segura_123';

-- 3. CONCEDER PRIVILÉGIOS
GRANT ALL PRIVILEGES ON gestao_alunos.* TO 'matricula_user'@'localhost';
FLUSH PRIVILEGES;

-- 4. USAR O BANCO DE DADOS
USE gestao_alunos;

-- 5. CRIAR TABELA DE CURSOS
CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_curso VARCHAR(100) NOT NULL,
    duracao INT NOT NULL COMMENT 'Duração em meses',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nome_curso (nome_curso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. CRIAR TABELA DE ALUNOS
CREATE TABLE IF NOT EXISTS alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    curso_id INT,
    data_matricula DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_email (email),
    INDEX idx_curso_id (curso_id),
    INDEX idx_data_matricula (data_matricula)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. INSERIR DADOS INICIAIS DOS CURSOS
INSERT IGNORE INTO cursos (nome_curso, duracao) VALUES
('Gestão de TI', 24),
('Desenvolvimento de Sistemas', 18),
('Análise de Dados', 12),
('Segurança da Informação', 20),
('Redes de Computadores', 16);

-- 8. INSERIR ALGUNS ALUNOS DE EXEMPLO (OPCIONAL)
-- Descomente as linhas abaixo se quiser dados de exemplo
/*
INSERT IGNORE INTO alunos (nome, email, curso_id, data_matricula) VALUES
('Ana Silva Santos', 'ana.silva@email.com', 1, '2025-01-15'),
('Carlos Eduardo Lima', 'carlos.lima@email.com', 2, '2025-01-20'),
('Maria Fernanda Costa', 'maria.costa@email.com', 1, '2025-02-01'),
('João Pedro Oliveira', 'joao.oliveira@email.com', 3, '2025-02-10'),
('Beatriz Almeida', 'beatriz.almeida@email.com', 2, '2025-02-15');
*/

-- 9. VERIFICAR CRIAÇÃO DAS TABELAS
SHOW TABLES;

-- 10. VERIFICAR ESTRUTURA DAS TABELAS
DESCRIBE cursos;
DESCRIBE alunos;

-- 11. VERIFICAR DADOS INSERIDOS
SELECT * FROM cursos;
SELECT COUNT(*) as total_cursos FROM cursos;

-- 12. VERIFICAR USUÁRIO CRIADO
SELECT User, Host FROM mysql.user WHERE User = 'matricula_user';

-- 13. VERIFICAR PRIVILÉGIOS
SHOW GRANTS FOR 'matricula_user'@'localhost';

-- =====================================================
-- COMANDOS ÚTEIS PARA ADMINISTRAÇÃO
-- =====================================================

-- Backup do banco de dados
-- mysqldump -u matricula_user -p gestao_alunos > backup_gestao_alunos.sql

-- Restaurar backup
-- mysql -u matricula_user -p gestao_alunos < backup_gestao_alunos.sql

-- Conectar ao banco como usuário da aplicação
-- mysql -u matricula_user -p gestao_alunos

-- Verificar status das tabelas
-- SELECT 
--     TABLE_NAME,
--     TABLE_ROWS,
--     DATA_LENGTH,
--     INDEX_LENGTH,
--     CREATE_TIME,
--     UPDATE_TIME
-- FROM information_schema.TABLES 
-- WHERE TABLE_SCHEMA = 'gestao_alunos';

-- Consulta para estatísticas
-- SELECT 
--     c.nome_curso,
--     COUNT(a.id) as total_alunos,
--     c.duracao
-- FROM cursos c
-- LEFT JOIN alunos a ON c.id = a.curso_id
-- GROUP BY c.id, c.nome_curso, c.duracao
-- ORDER BY total_alunos DESC;

-- =====================================================
-- CONFIGURAÇÕES DE SEGURANÇA RECOMENDADAS
-- =====================================================

-- 1. Alterar senha do usuário (execute periodicamente)
-- ALTER USER 'matricula_user'@'localhost' IDENTIFIED BY 'nova_senha_ainda_mais_segura';

-- 2. Limitar conexões simultâneas
-- ALTER USER 'matricula_user'@'localhost' WITH MAX_CONNECTIONS_PER_HOUR 100;

-- 3. Configurar SSL (recomendado para produção)
-- ALTER USER 'matricula_user'@'localhost' REQUIRE SSL;

-- =====================================================
-- LIMPEZA (USE COM CUIDADO!)
-- =====================================================

-- Para remover tudo e começar do zero:
-- DROP DATABASE IF EXISTS gestao_alunos;
-- DROP USER IF EXISTS 'matricula_user'@'localhost';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================


"""
Script para popular o banco de dados com dados iniciais
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.main import app
from src.models.user import db
from src.models.matricula import Curso, Aluno

def populate_database():
    """Popula o banco de dados com os cursos iniciais"""
    with app.app_context():
        # Criar as tabelas se não existirem
        db.create_all()
        
        # Verificar se já existem cursos
        if Curso.query.count() > 0:
            print("Banco de dados já possui cursos. Pulando população inicial.")
            return
        
        # Inserir cursos iniciais
        cursos_iniciais = [
            {'nome_curso': 'Gestão de TI', 'duracao': 24},
            {'nome_curso': 'Desenvolvimento de Sistemas', 'duracao': 18}
        ]
        
        for curso_data in cursos_iniciais:
            curso = Curso(
                nome_curso=curso_data['nome_curso'],
                duracao=curso_data['duracao']
            )
            db.session.add(curso)
        
        try:
            db.session.commit()
            print("Cursos iniciais inseridos com sucesso!")
            
            # Listar cursos inseridos
            cursos = Curso.query.all()
            print("\nCursos disponíveis:")
            for curso in cursos:
                print(f"- ID: {curso.id}, Nome: {curso.nome_curso}, Duração: {curso.duracao} meses")
                
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao inserir cursos: {e}")

if __name__ == '__main__':
    populate_database()


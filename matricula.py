from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Curso(db.Model):
    __tablename__ = 'cursos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome_curso = db.Column(db.String(100), nullable=False)
    duracao = db.Column(db.Integer, nullable=False)  # duração em meses
    
    # Relacionamento com alunos
    alunos = db.relationship('Aluno', backref='curso', lazy=True)
    
    def __repr__(self):
        return f'<Curso {self.nome_curso}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome_curso': self.nome_curso,
            'duracao': self.duracao
        }

class Aluno(db.Model):
    __tablename__ = 'alunos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    curso_id = db.Column(db.Integer, db.ForeignKey('cursos.id'), nullable=True)
    data_matricula = db.Column(db.Date, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Aluno {self.nome}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'curso_id': self.curso_id,
            'curso_nome': self.curso.nome_curso if self.curso else None,
            'data_matricula': self.data_matricula.isoformat() if self.data_matricula else None
        }


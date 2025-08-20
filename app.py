from flask import Flask, render_template, request, redirect
import sqlite3

app = Flask(__name__)

# Cria o banco se não existir
def init_db():
    conn = sqlite3.connect('dados.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        nome = request.form['nome']
        email = request.form['email']

        conn = sqlite3.connect('dados.db')
        c = conn.cursor()
        c.execute("INSERT INTO usuarios (nome, email) VALUES (?, ?)", (nome, email))
        conn.commit()
        conn.close()
        return redirect('/')

    # Mostrar dados já salvos
    conn = sqlite3.connect('dados.db')
    c = conn.cursor()
    c.execute("SELECT * FROM usuarios")
    usuarios = c.fetchall()
    conn.close()

    return render_template('index.html', usuarios=usuarios)

if __name__ == '__main__':
    app.run(debug=True)

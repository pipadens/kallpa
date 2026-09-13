import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_NAME = 'proyectos.db'

# 1. Función para inicializar la Base de Datos y crear la tabla si no existe
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS registro_proyectos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            proyecto TEXT NOT NULL,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Inicializamos la base de datos al arrancar el servidor
init_db()

# 2. Ruta para recibir y guardar datos (POST)
@app.route('/api/guardar', methods=['POST'])
def guardar_datos():
    datos = request.get_json()
    nombre = datos.get('nombre')
    proyecto = datos.get('proyecto')

    if not nombre or not proyecto:
        return jsonify({"status": "error", "mensaje": "Faltan datos requeridos"}), 400

    # Insertar en SQLite
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO registro_proyectos (nombre, proyecto) VALUES (?, ?)',
            (nombre, proyecto)
        )
        conn.commit()
        id_registrado = cursor.lastrowid
        conn.close()

        return jsonify({
            "status": "ok",
            "mensaje": f"¡Proyecto guardado en la Base de Datos con ID {id_registrado}!",
            "detalles": f"'{proyecto}' registrado por {nombre}."
        }), 201

    except Exception as e:
        return jsonify({"status": "error", "mensaje": str(e)}), 500

# 3. Ruta opcional para consultar todo lo guardado (GET)
@app.route('/api/proyectos', methods=['GET'])
def listar_proyectos():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT id, nombre, proyecto, fecha FROM registro_proyectos')
    filas = cursor.fetchall()
    conn.close()

    # Convertimos las filas recibidas en una lista de diccionarios JSON
    lista_proyectos = []
    for fila in filas:
        lista_proyectos.append({
            "id": fila[0],
            "nombre": fila[1],
            "proyecto": fila[2],
            "fecha": fila[3]
        })

    return jsonify(lista_proyectos), 200

if __name__== '__main__':
    app.run(port=5000, debug=True)
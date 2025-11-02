from flask import Flask, request, jsonify
import sqlite3
import json
import os

app = Flask(__name__)

DB_FILE = "database.db"

# --- Database setup ---
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            age INTEGER,
            email TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# --- Route to upload JSON file ---
@app.route('/upload-json', methods=['POST'])
def upload_json():
    # Expect a JSON file upload (form-data)
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    data = json.load(file)

    # Ensure it's a list of dicts
    if not isinstance(data, list):
        data = [data]

    # Insert into database
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    for item in data:
        name = item.get('name')
        age = item.get('age')
        email = item.get('email')

        cursor.execute(
            "INSERT INTO users (name, age, email) VALUES (?, ?, ?)",
            (name, age, email)
        )

    conn.commit()
    conn.close()

    return jsonify({"message": f"{len(data)} records inserted successfully!"})

# --- Route to fetch all records ---
@app.route('/users', methods=['GET'])
def get_users():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    conn.close()

    users = [
        {"id": row[0], "name": row[1], "age": row[2], "email": row[3]}
        for row in rows
    ]
    return jsonify(users)

if __name__ == "__main__":
    app.run(debug=True)

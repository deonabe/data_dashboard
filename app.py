import psycopg2
from flask import Flask, jsonify, send_from_directory

app = Flask(__name__)
conn = psycopg2.connect(
    dbname="analytics", user="myuser", password="password1234", host="localhost"
)


@app.route("/")
def home():
    return send_from_directory(".", "index.html")


@app.route("/styles.css")
def styles():
    return send_from_directory(".", "styles.css")


@app.route("/scripts.js")
def script():
    return send_from_directory(".", "scripts.js")


@app.route("/api/data", methods=["GET"])
def get_data():
    cur = conn.cursor()
    cur.execute("SELECT * FROM data_points")
    data_points = cur.fetchall()
    cur.close()
    return jsonify(data_points)


if __name__ == "__main__":
    app.run(debug=True)

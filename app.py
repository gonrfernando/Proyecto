import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return(render_template('home.html'))

@app.route("/Tablas")
def tablas():
    return(render_template('tablas.html'))

@app.route('/Generar-Tablas', methods=['POST'])
def generar_tablas():
    return jsonify({'message': 'Generar Tablas endpoint'})

@app.route('/renglon-critico', methods=['POST'])
def renglon_critico():
    data = request.get_json()
    hypotheses = data.get('hypotheses', [])
    conclusion = data.get('conclusion', '')
    
    variables = set()
    
    for hypothesis in hypotheses:
        variables.update(extraer_variables(hypothesis))
    
    return 

@app.route('/metodo-tautologia', methods=['POST'])
def metodo_tautologia():
    data = request.get_json()
    hypotheses = data.get('hypotheses', [])
    conclusion = data.get('conclusion', '')
    
    variables = set()
    for hypothesis in hypotheses:
        variables.update(extraer_variables(hypothesis))
    
    
    return 

def extraer_variables(expresion):
    variables = set()
    for char in expresion:
        if char.isalpha():
            variables.add(char)
    return variables
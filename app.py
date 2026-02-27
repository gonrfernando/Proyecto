import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, session

app = Flask(__name__)   
app.secret_key = "Fanta de Limon"

@app.route("/")
def home():
    return(render_template('home.html'))

@app.route("/Tablas")
def tablas():
    return(render_template('tablas.html'))

@app.route('/Generar-Tablas', methods=['POST'])
def generar_tablas():
    return jsonify({'message': 'Generar Tablas endpoint'})

@app.route('/resultado')
def resultado():
    encabezados = session.get('encabezados', [])
    tabla = session.get('tabla', [])
    return(render_template('resultado.html', encabezados=encabezados, tabla=tabla))


@app.route('/renglon-critico', methods=['POST'])
def renglon_critico():
    data = request.get_json()
    hypotheses = data.get('hypotheses', [])
    conclusion = data.get('conclusion', '')
    tabla = []
    
    variables = set()
    
    for i in range(len(hypotheses)):
        variables.update(extraer_variables(hypotheses[i]))
        
    variables = list(variables)
    variables.sort()
        
    encabezados = []
    for var in variables:
        encabezados.append(var)
    for i in range(len(hypotheses)):
        encabezados.append(hypotheses[i])
        hypotheses[i] = hypotheses[i].replace("v","or")
        hypotheses[i] = hypotheses[i].replace("^","and")
        hypotheses[i] = hypotheses[i].replace("~","not ")
        hypotheses[i] = hypotheses[i].replace("->","<=")
    encabezados.append(conclusion)

    n = len(variables)
    nfilas = 2 ** n

    for i in range (nfilas):
        fila = []
        bin = format(i,'016b')
        bin = bin[-n:]
        
        valores = dict()
        for j in range(n):
            valores[variables[j]] = int(bin[j])
            fila.append(bin[j])
            
        for j in range(len(hypotheses)):
            h = hypotheses[j]
            result = eval(h, {}, valores)
            print(f"Evaluando: {h} con {valores} = {result}")
            fila.append(result)
        
        fila.append(eval(conclusion, {}, valores))
        
        tabla.insert(0, fila)
        
    session['encabezados'] = encabezados
    session['tabla'] = tabla
    
    return jsonify({"status": "ok"}), 200

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
        if char.isalpha() and char not in ['v', '^', '~', '>', '-']:
            variables.add(char)
    return variables
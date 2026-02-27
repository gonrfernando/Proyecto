import os
import re
from flask import Flask, render_template, request, jsonify, redirect, url_for, session

app = Flask(__name__)   
#Necesitamos una llave secreta para usar sesiones
app.secret_key = "Fanta de Limon"

@app.route("/") #Mostramos home.html cuando el link es "/" o vacio
def home():
    return(render_template('home.html'))


@app.route("/Tablas") #Mostramos tablas.html cuando el link es "/Tablas"
def tablas():
    return(render_template('tablas.html')) 


@app.route('/resultado') #Mostramos resultado.html cuando el link es "/resultado". Esta ruta se llama desde el main.js despues de hacer la tabla de verdad, para mostrarla
def resultado():
    # Va por las variables a la sesion (el navegador)
    encabezados = session.get('encabezados', [])
    tabla = session.get('tabla', [])
    metodo = session.get('metodo')
    renglones_criticos = session.get('renglones_criticos', [])
    renglones_falla = session.get('renglones_falla', [])
    argumento_valido = session.get('argumento_valido', True)
    
    #Manda a mostrar el resultado.html y le pasa los encabezados y la tabla como variables al html
    return(render_template('resultado.html', encabezados=encabezados, tabla=tabla, metodo=metodo, renglones_criticos=renglones_criticos, renglones_falla=renglones_falla, argumento_valido=argumento_valido)) 


@app.route('/renglon-critico', methods=['POST']) #se manda a llamar desde main.js cuando se usa el boton de renglon critico
def renglon_critico():
    #Recibimos los datos json que mando el html
    data = request.get_json()
    arreglo_hipotesis = data.get('hypotheses', [])
    conclusion = data.get('conclusion', '')
    
    #Generamos la tabla. Le mandamos las hipotesis, la conclusion y que es con renglon critico
    encabezados, tabla, argumento_valido, renglones_criticos, renglones_falla = generar_tabla_verdad(arreglo_hipotesis, conclusion, "renglon_critico")
    
    #Guardamos "en el navegador" los encabezados y la tabla
    session['encabezados'] = encabezados
    session['tabla'] = tabla
    session['renglones_criticos'] = renglones_criticos
    session['renglones_falla'] = renglones_falla
    session['argumento_valido'] = argumento_valido
    session['metodo'] = "renglon_critico"
    
    return jsonify({"status": "ok"}), 200 #regresamos al main.js que todo ok

@app.route('/metodo-tautologia', methods=['POST']) #se manda a llamar desde main.js cuando se usa el boton de tautologia
def metodo_tautologia():
    #Recibimos los datos json que mando el html
    data = request.get_json()
    arreglo_hipotesis = data.get('hypotheses', [])
    conclusion = data.get('conclusion', '')
    
    #Generamos la tabla. Le mandamos las hipotesis, la conclusion y que es con tautologia
    encabezados, tabla, argumento_valido, renglones_criticos, renglones_falla = generar_tabla_verdad(arreglo_hipotesis, conclusion, "tautologia")
    
    #Guardamos "en el navegador" los encabezados y la tabla
    session['encabezados'] = encabezados
    session['tabla'] = tabla
    session['argumento_valido'] = argumento_valido
    session['renglones_criticos'] = []
    session['renglones_falla'] = []
    session['metodo'] = "tautologia"
    return jsonify({"status": "ok"}), 200 #regresamos al main.js que todo ok




def generar_tabla_verdad(arreglo_hipotesis, conclusion, metodo):
    variables = set()
    implicacion_general = ""
    
    #Extraemos las variables de las hipotesis
    for i in range(len(arreglo_hipotesis)):
        variables.update(extraer_variables(arreglo_hipotesis[i]))
    
    #las ponemos en una lista y las ordenamos
    variables = list(variables)
    variables.sort()
    
    #Los encabezados son los titulos de las columnas, como "p q r hipotesis1... concluson"
    encabezados = []
    
    #Agregamos las variables a los encabezados, porq son las primeras columnas
    for var in variables:
        encabezados.append(var)
        
    for i in range(len(arreglo_hipotesis)):
        encabezados.append(arreglo_hipotesis[i]) #Agregamos las hipotesis a los encabezados, porq son las siguientes columnas
        #Reemplazamos operadores para que eval los evalue chido
        arreglo_hipotesis[i] = arreglo_hipotesis[i].replace("v","or")
        arreglo_hipotesis[i] = arreglo_hipotesis[i].replace("^","and")
        arreglo_hipotesis[i] = arreglo_hipotesis[i].replace("~","not ")
        arreglo_hipotesis[i] = arreglo_hipotesis[i].replace("->","<=")   #SON LO MISMO :D checamos las tablas de verdad y implicacion es lo mismo que <= cuando usamos 0's y 1's
        
    encabezados.append(conclusion) #Agregamos la conclusion a los encabezados, porq es la ultima columna
    
    if metodo == "tautologia": #Si es tautologia, hay que hacer la implicacion gigante para la comprobación
        #Juntamos todas las hipotesis con ands
        for h in arreglo_hipotesis:
            if implicacion_general:
                implicacion_general += " and "
            implicacion_general += "(" + h + ")"  #ej "(h1) and (h2) and ... and (hn)"
        implicacion_general = "(" + implicacion_general + ") <= " + conclusion #ej "((h1) and (h2) and ... and (hn)) <= conclusion"
        encabezados.append("Conjunción de Hipotesis -> Conclusion") #Agregamos el encabezado de la ultima columna, que es la implicacion gigante

    n = len(variables)
    nfilas = 2 ** n #Calculamos cuantas filas van a ser
    tabla = []
    renglones_criticos = []
    renglones_falla = []
    argumento_valido = True

    for i in range (nfilas): #Ciclo for para generar cada fila
        fila = []
        binario = format(i,'016b') #Convertimos el numero de fila a binario
        binario = binario[-n:] #Volteamos el numero bin para que los 0's queden a la derecha
        
        #El numero binario representa los valores de las variables en esa fila
        #Fila 2 -> 110
        #si tenemos 3 variables, p y q, tomamos p como 1, q como 1 y r como 0
        
        resultados_hipotesis = [] 
        
        #Creamos un dicc de los valores de las variables en esa fila
        valores = dict()
        for j in range(n): 
            valores[variables[j]] = int(binario[j])  #si variables = ['p', 'q', 'r']  100 -> {'p': 1, 'q': 0, 'r': 0}
            fila.append(binario[j])
            #p q r
            #1 0 0
        for j in range(len(arreglo_hipotesis)):
            h = arreglo_hipotesis[j]
            resultado = eval(h, {}, valores) #Evaluamos la hipotesis usando los valroes de esa fila del dicc
            resultados_hipotesis.append(resultado)
            fila.append(resultado)
            #p q r  p v q   
            #1 0 0    1
        resultado_conclusion = eval(conclusion, {}, valores)
        fila.append(resultado_conclusion) #Evaluamos la conclusion usando los valroes de esa fila del dicc
        #p q r  p v q   q   
        #1 0 0    1     0
        if metodo == "tautologia":
            check_tautologia = eval(implicacion_general, {}, valores) #Evaluamos la implicacion gigante usando los valroes de esa fila del dicc
            fila.append(check_tautologia) #Agregamos el resultado de la implicacion gigante a la fila
            if not check_tautologia:
                argumento_valido = False #Si la implicacion gigante no es verdadera en alguna fila, el argumento no es valido
        
        
        if metodo == "renglon_critico" and all(resultados_hipotesis): #Si es renglon critico, hay que checar si todas las hipotesis son verdaderas en esa fila
            renglones_criticos.append(nfilas-i-1) #si es renglon critico, guardamos el numero de renglon, pero como la tabla se va a mostrar al reves, guardamos nfilas-i-1
            if not resultado_conclusion: 
                argumento_valido = False #Si es renglon critico y la conclusion no es verdadera en alguna fila, el argumento no es valido
                renglones_falla.append(nfilas-i-1) #Es un renglon critico que fallo, asi que lo guardamos
                print(f"Renglon de falla: {nfilas-i-1}")
        
        tabla.insert(0, fila) #Insertamos la fila que acabamos de hacer al inicio de la tabla, para que la fila "0" que tiene puros 0's o falsos quede hasta abajo
        
    return encabezados, tabla, argumento_valido, renglones_criticos, renglones_falla

def extraer_variables(expresion):
    variables = set()
    for char in expresion:
        if char.isalpha() and char not in ['v', '^', '~', '>', '-']: #Si el caracter es una letra y no es un operador logico, es una variable
            variables.add(char)
    return variables
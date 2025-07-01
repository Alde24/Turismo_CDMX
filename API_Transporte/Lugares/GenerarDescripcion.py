import sys
import openai

# Configura tu API Key de OpenAI
OPENAI_API_KEY = "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"
client = openai.OpenAI(api_key=OPENAI_API_KEY)  # Nueva forma de inicializar el cliente

def generar_redaccion(nombre, direccion):
    """Genera una descripción con ChatGPT basada en la información del lugar"""
    
    prompt = f"""Escribe una breve descripción atractiva sobre el siguiente lugar turístico:
    Nombre: {nombre}
    Dirección: {direccion}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "Eres un redactor turístico experto en la CDMX."},
                      {"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generando descripción: {str(e)}"

# Leer parámetros desde la línea de comandos
if len(sys.argv) != 3:
    print("Error: Parámetros insuficientes")
    sys.exit(1)

nombre = sys.argv[1]
direccion = sys.argv[2]

# Generar la descripción
redaccion = generar_redaccion(nombre, direccion)

# Imprimir la salida para que PHP la reciba
print(redaccion)
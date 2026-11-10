**Integrantes**

Liz Aneli Vargas Ortiz

**Instrucciones de ejecución**

Se necesita Node.js y conexión a Internet para consultar las APIs.

Abrir una terminal en la carpeta APIS y ejecutar node server.js. Después abrir http://127.0.0.1:5500 en el navegador. Para detener el servidor, presionar Ctrl+C. También se puede abrir index.html con la extensión Live Server de Visual Studio Code. No hace falta compilar ni instalar paquetes.

**¿Qué es un endpoint y cuál utilizaste para cada API?**

Un endpoint es la dirección de una API a la que enviamos una solicitud para obtener información. Utilicé estos endpoints con el método GET:

Citas: https://dummyjson.com/quotes/random

Perros: https://dog.ceo/api/breeds/image/random

Gatos: https://cataas.com/cat?json=true

Datos curiosos: https://uselessfacts.jsph.pl/api/v2/facts/random?language=en

Para mostrar el gato uso el identificador recibido en el JSON y formo la dirección https://cataas.com/cat/{id}.

**¿Qué diferencia existe entre recibir JSON y recibir directamente una imagen?**

El JSON contiene datos organizados en campos, como el texto de una cita, su autor o la dirección de una imagen. JavaScript puede leer esos campos. Una imagen contiene los datos del archivo gráfico y se muestra en una etiqueta img. Por eso no se debe usar response.json() cuando la respuesta es directamente una imagen.

**¿Qué función cumplen await y response.json()?**

await permite esperar el resultado de una operación asíncrona sin bloquear el resto de la página. response.json() lee el cuerpo de la respuesta y lo convierte en datos que JavaScript puede utilizar. También devuelve una promesa, por lo que uso await para esperar esa conversión.

**¿Por qué se debe verificar response.ok además de utilizar try/catch?**

Porque fetch no lanza un error automáticamente cuando el servidor responde con un código como 404 o 500. response.ok permite comprobar si la respuesta fue exitosa. Si es falso, lanzo un error para manejarlo en el catch, igual que los errores de conexión.

**¿Cómo lograste actualizar una sección sin recargar toda la página?**

Cada botón llama a una función que consulta su API con fetch. Cuando llega la respuesta, cambio el texto o la imagen de esa tarjeta mediante JavaScript. No recargo la página y las demás tarjetas conservan su contenido. Cada sección maneja su propio estado de carga y sus errores.


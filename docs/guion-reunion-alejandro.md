# Guion de campo — reunión con Alejandro Vásquez

> Preparación para la conversación con el jefe de Asistencia Técnica de Eserco. No es un guion para recitar: es un mapa de la conversación, un banco de respuestas preparadas y el manejo de las objeciones probables.

---

## 0. El objetivo real (una sola cosa)

**No** es que le guste el proyecto. **No** es explicar la arquitectura. **No** es lucirse.

> **Salir de la reunión con datos, o con un siguiente paso concreto, con nombre y fecha.**

Todo lo demás —la demo, la arquitectura, la IA— existe solo en la medida en que empuje hacia eso. Si a los 20 minutos la conversación va bien pero no hay siguiente paso definido, hay que dirigirla hacia allá.

---

## 1. Mapa del interlocutor

| | |
|---|---|
| **Su cargo real** | Responsable de que 42 buses salgan a operar todos los días |
| **Cómo se mide su trabajo** | Disponibilidad de flota, buses fuera de servicio, costo de mantención, cumplimiento de frecuencias ante el MTT |
| **Sus dolores probables** | Buses detenidos sin aviso, repuestos caros o lentos, no saber en qué estado real están las baterías, la incertidumbre de cuándo habrá que reemplazar packs (la inversión más pesada del ciclo de vida) |
| **Sus miedos con esta conversación** | Que le agreguen trabajo, que un externo critique su operación, exponer datos sensibles, perder el tiempo con alguien que no va a terminar el proyecto |
| **Su moneda** | Disponibilidad, costo por kilómetro, vida útil del activo, cumplimiento de garantía |
| **Lo que NO es** | Comprador de software, jefe de TI, entusiasta de arquitecturas de datos |

**Consecuencia práctica:** todo término técnico debe traducirse a su moneda. No "telemetría en tiempo real" sino "saber qué bus va a fallar antes de que se detenga en ruta".

---

## 2. El arco de la reunión

### Fase 1 · Apertura y encuadre (2 min)

Objetivo: bajar la guardia. Que quede claro de inmediato que no se le va a pedir plata, ni una decisión, ni trabajo.

> "Gracias por el tiempo, Alejandro. Te resumo en una frase para no quitarte la mañana: **no vengo a venderte nada ni a pedirte que te comprometas con nada**. Vengo a mostrarte algo que construí y a pedirte una opinión técnica — y si de ahí sale algo útil para ustedes, mejor."

Y de inmediato entregar el control:

> "¿Cuánto tiempo tienes? Me acomodo a lo que tengas."

### Fase 2 · Preguntar antes de presentar (8–10 min) — **la fase más importante**

La tentación es abrir el notebook y presentar. **Es el error más caro de la reunión.** Preguntar primero logra cuatro cosas a la vez: le da el control (baja la defensa), entrega información para adaptar el resto, demuestra respeto por su experiencia, y —lo más valioso— hace que **él enuncie el problema con sus propias palabras**, lo que vale diez veces más que si lo enuncias tú.

Preguntas, de lo general a lo específico:

1. "Cuéntame cómo ha sido la operación de los buses eléctricos hasta ahora. ¿Qué ha sido lo más complicado?"
2. "En el tema de las baterías puntualmente, ¿qué es lo que más te preocupa?"
3. "¿Cómo se dan cuenta hoy de que una batería anda mal? ¿Alcanzan a verlo antes o se enteran cuando el bus queda parado?"
4. "¿Les ha tocado algún bus detenido en ruta por tema de batería?"
5. "¿Y cuando llegue el momento de reemplazar los packs, cómo van a decidir cuál y cuándo?"
6. "¿Quién revisa hoy los datos que entregan los sistemas? ¿Alcanzan a mirarlos con calma?"

**Técnica:** después de cada pregunta, **callarse**. El silencio incomoda, pero es el que hace que la respuesta se vuelva concreta. La segunda mitad de una respuesta suele ser la valiosa.

**Anotar literalmente** las frases que use. Esas frases se reutilizan en las fases 3 y 6.

### Fase 3 · Espejo (1–2 min)

Devolverle lo que dijo, y recién ahí conectar:

> "Lo que me dices calza justo con lo que vengo a mostrarte. [Su frase textual] es exactamente el problema que intenté resolver."

Si él dijo algo como "nos enteramos cuando el bus ya está parado", ese es el puente perfecto.

### Fase 4 · Mostrar, no contar (5 min máximo)

Regla: **una pantalla, no diez.** La tentación de recorrer toda la app es fuerte y arruina el momento.

- **Pantalla única:** `/flota/MIC-104` — la salud (SoH) separada de la carga del día, la curva de degradación con el umbral de reemplazo y la proyección en meses.
- **Frase de acompañamiento:** "Esto que ves acá es lo que quiero calcular con datos de verdad: cuánto le queda a cada pack antes de llegar al límite."
- **Segunda pantalla solo si pregunta:** `/cargas` — el impacto de cada sesión de carga.
- **Decir el descargo antes de que lo pregunte:** "Estos datos son simulados, la app lo dice ahí arriba. Sirven para mostrar la idea, no describen tu flota."

### Fase 5 · El pedido mínimo (2 min)

> "Lo que necesito para que esto deje de ser una maqueta es una sola cosa: **planillas históricas de 5 a 10 buses**. Sin acceso a tus sistemas, sin instalar nada, sin datos de conductores. Te dejo un PDF de dos páginas con el detalle, por si le sirve a quien maneja las plataformas."

Y de inmediato, las dos preguntas técnicas del análisis:

> "Dos cosas que me ayudan a saber si esto es viable: ¿cómo se identifica qué bus cargó en cada sesión? ¿Y se ha reemplazado o intervenido el pack de alguna máquina?"

Estas preguntas cumplen doble función: son necesarias **y** demuestran que sabes de qué estás hablando.

### Fase 6 · Cierre con siguiente paso (2 min)

Nunca cerrar con "quedamos en contacto". Cerrar con algo concreto:

> "¿Te parece si lo dejamos así: tú ves con quien maneja las plataformas si se puede sacar la exportación, y yo te escribo el [día concreto] para saber cómo fue? Si no se puede, me lo dices sin problema y no insisto más."

**El "no" fácil** —darle salida explícita— reduce la resistencia y aumenta la probabilidad de que diga que sí.

---

## 3. Banco de preguntas probables y respuestas preparadas

Respuestas cortas. Las respuestas largas a preguntas simples generan desconfianza.

### Sobre ti y tus intenciones

**"¿Esto es para tu tesis / tu título?"**
> "En parte sí, es mi proyecto de título. Pero el prototipo ya está construido y funcionando, y lo que me interesa de verdad es que sirva para algo. Si el informe les es útil y mi proyecto termina ahí, para mí igual valió la pena."

**"¿Y qué ganas tú con esto?" / "¿Después me lo vas a querer vender?"**
> "Hoy no tengo nada que venderte y no es lo que busco en esta etapa. Gano dos cosas: validar si mi idea sirve de verdad, y datos reales para mi proyecto de título. Si más adelante esto llega a funcionar y ustedes quisieran seguir usándolo, se conversa en su momento con reglas claras. Pero el informe de esta prueba queda para ustedes sin condiciones, pase lo que pase después."

**"¿Estás solo o hay una empresa detrás?"**
> "Estoy solo. La app la desarrollé completa yo. Eso tiene una ventaja para ti: no hay un comercial detrás presionando, y lo que hablemos acá se decide acá."

**"Ya hemos tenido estudiantes o universidades que empiezan cosas y no terminan."** *(Objeción muy probable)*
> "Te entiendo, y es justo por eso que lo que te pido es tan poco. Si yo desaparezco mañana, ustedes no perdieron nada: un par de planillas. Y hay una diferencia con esos casos: yo no te estoy pidiendo que financies algo que voy a construir — el prototipo ya está hecho, desplegado y lo puedes ver funcionando ahora mismo. Lo único que falta son los datos."

### Sobre el valor

**"¿Y esto en qué me ayuda a mí concretamente?"**
> "En tres cosas, en orden de importancia para ti: saber qué pack se está degradando más rápido y por qué; poder presupuestar el reemplazo con meses de anticipación en vez de reaccionar; y ver qué prácticas de carga u operación están cobrando caro, para corregirlas mientras todavía se puede."

**"El proveedor ya me entrega el SOH. ¿Para qué quiero esto?"** *(La objeción central)*
> "Y ese dato es bueno, no compito con él. La diferencia es qué se hace con ese número. Hoy te dice **cómo está** la batería. Lo que no te dice es **por qué** se está degradando así, ni **cuándo** va a llegar al límite. Eso sale de cruzar la salud con las cargas y la operación — y ningún sistema lo hace solo porque cada uno ve la mitad de la película: el de telemetría ve la ruta, el de carga ve el enchufe."

**"¿Cómo sé que tu cálculo es correcto?"**
> "Es la pregunta correcta, y es la que yo también me hago. Por eso el informe va a incluir cómo se calculó cada número y con qué datos, para que lo pueda revisar cualquiera. **No te pido que confíes en el número: te pido que lo revises.** Y si mi cálculo y el del proveedor se contradicen, eso mismo ya es un hallazgo que vale la pena mirar."

**"¿Esto reemplaza los sistemas que tengo?"**
> "No, se suma. Uso los dos que ya tienes; soy una capa arriba que los cruza. Si mañana cambias de proveedor, lo que hicimos sigue sirviendo."

**"¿Y si tus números salen mal, o dicen algo que no es?"**
> "Puede pasar, y lo diría igual. Prefiero entregarte un informe que diga 'con estos datos no se puede concluir' antes que inventar una conclusión. De hecho, parte del valor del primer informe es descubrir qué falta en los datos para poder medir bien."

### Sobre los datos

**"¿Qué vas a hacer con los datos? ¿Los vas a compartir?"**
> "Los uso solo para este análisis, no los comparto con nadie y no los publico. Si en el proyecto de título necesito mostrar resultados, van anonimizados y sin identificar la empresa, o directamente les pido autorización antes. Y firmo un acuerdo de confidencialidad si lo prefieren."

**"Los datos son sensibles / no sé si puedo entregarlos."**
> "Lo entiendo perfectamente. Por eso te propongo partir con lo mínimo: 5 a 10 buses, sin nombres de conductores, y el período que a ustedes les acomode. Y si la política interna no permite sacar datos para afuera, hay otra opción: **yo instalo el análisis donde ustedes digan, en su infraestructura, y solo veo los resultados, no los datos crudos.** Los datos nunca salen de su lado."

**"Esos datos son del proveedor, no míos."**
> "Buen punto, y es justo una de las cosas que quería preguntarte: ¿el contrato les da acceso a los datos crudos o solo a los tableros? Si son del proveedor, quizás el camino es pedírselos formalmente a ellos, y ahí también te sirve saber qué se puede exigir."

**"¿Y si esto sale a la luz y nos deja mal parados?"**
> "El informe es tuyo, no mío: tú decides qué se hace con él. Yo no publico nada sin autorización. Y por experiencia, este tipo de análisis casi nunca dice 'lo están haciendo mal' — dice 'acá hay una oportunidad de ahorro'."

### Técnicas

**"¿Necesitas instalar algo en los buses?"**
> "No. Nada. No toco el vehículo ni me conecto a él. Solo leo datos que ya se están registrando."

**"¿Esto no afecta la garantía de las baterías?"**
> "No, porque no intervengo nada del bus. Y puede servir para el lado contrario: si algún día hay que hacer valer la garantía ante el fabricante, tener documentado cómo se operó y cómo se cargó cada batería es evidencia a tu favor. Es más fácil discutir con datos."

**"¿Cómo calculas la degradación?"**
> "La idea base es simple: cuando un bus carga, sé cuánta energía entró y cuánto subió el estado de carga. Con esas dos cosas se puede estimar la capacidad real que le queda al pack. Repitiendo ese cálculo en las cargas nocturnas de varios meses, sale la curva real de degradación. Y sobre esa curva se proyecta cuándo va a cruzar el umbral de reemplazo."

**"¿Y la inteligencia artificial dónde entra?"** *(si sale el tema)*
> "Menos de lo que se cree, y a propósito. El número de degradación lo calcula un modelo matemático que se puede auditar — no un modelo de lenguaje, porque acá se decide el reemplazo de un activo caro y el número tiene que ser reproducible. La IA sirve para otra cosa: que tú puedas preguntarle al sistema en español '¿qué bus se degradó más este mes?' sin tener que pedirle un reporte a nadie."

**"¿Esto funcionaría en tiempo real?"**
> "Técnicamente sí, pero te voy a ser honesto: para la degradación no aporta. Una batería se degrada 2 a 4% **al año** — enterarse cuatro horas antes no cambia ninguna decisión. Donde el tiempo real sí vale es en otra cosa: una celda que se calienta de más, un bus que va a quedar sin carga en ruta. Son dos problemas distintos y conviene resolverlos por separado."

*(Esta respuesta es de las que más criterio demuestran: renunciar a la tecnología llamativa porque el problema no la necesita.)*

### Comerciales y de futuro

**"¿Cuánto te demorarías en tener resultados?"**
> "Entre dos y cuatro semanas desde que tenga las planillas en la mano, para el primer informe."

**"¿Y esto cuánto costaría después?"**
> "Esta prueba no cuesta nada. Lo que venga después no lo tengo definido y prefiero no inventarlo ahora: primero veamos si los números sirven. Si no sirven, no hay nada que cobrar."

**"¿De quién es lo que desarrolles?"**
> "El software es mío. El informe y los resultados sobre sus datos son de ustedes. Y sus datos siguen siendo de ustedes siempre."

**"Tendría que consultarlo con gerencia / el directorio."**
> "Me parece lo correcto. ¿Te sirve si te dejo el PDF de dos páginas para que lo puedas mostrar? Está escrito para que se entienda solo, sin que tengas que explicarlo tú. Y si necesitas que arme algo más formal para esa instancia, lo hago."

**"No tengo tiempo para esto ahora."**
> "Lo entiendo. Por eso el pedido es una exportación, no un proyecto. Si me dices quién maneja las plataformas, yo coordino directo con esa persona y no te ocupo más tiempo. Y si en el camino no se puede, me avisas y listo."

---

## 4. Lenguaje: cómo se dice

### Traducir siempre a su idioma

| No decir | Decir |
|---|---|
| Telemetría IoT, ingesta de datos | Los datos que ya registran los buses |
| Estado de salud / SoH | Cuánta batería real le queda al pack (y recién ahí "lo que técnicamente se llama SoH") |
| Modelo de estimación, algoritmo | El cálculo |
| Dashboard, KPI | La pantalla, el número |
| Pipeline, arquitectura, streaming | (No mencionarlo salvo que él lo pregunte) |
| Degradación acelerada | La batería se está gastando más rápido de lo normal |

### Reglas de conducción

- **Preguntar en abierto, no en cerrado.** "¿Cómo se dan cuenta hoy?" en vez de "¿tienen alertas automáticas?".
- **Silencio después de preguntar.** No llenar el vacío.
- **Validar antes de responder una objeción.** Primero "te entiendo" o "es la pregunta correcta", después el argumento. Nunca partir defendiéndose.
- **Hablar de "ustedes" y "su flota"**, no de "mi proyecto" ni "mi app".
- **Números concretos, no adjetivos.** "5 a 10 buses, 2 a 4 semanas" en vez de "poquitos datos, rapidito".
- **Decir "no sé" cuando no se sabe.** Es lo que más credibilidad da en una reunión técnica.
- **Dar salida explícita** ("si no se puede, me avisas y no insisto"). Baja la presión y sube la probabilidad de sí.

### Frases prohibidas

- "Esto va a revolucionar…" / "es innovador" → vacío, suena a vendedor.
- "Ustedes están haciendo X mal" → aunque sea cierto, cierra la puerta.
- "Es súper simple" → minimiza su trabajo.
- "Con inteligencia artificial…" como argumento de venta → hoy suena a humo si no va acompañado de un cómo concreto.
- "Necesito que ustedes…" → mejor "lo que me serviría es…".
- Prometer el 25% de mejora como un hecho → siempre "es una hipótesis que quiero validar".

---

## 5. Leer la conversación

| Señal de que va bien | Señal de que va mal |
|---|---|
| Hace preguntas técnicas de detalle | Respuestas de una palabra |
| Cuenta casos concretos de su operación | Generalidades, "sí, interesante" |
| Menciona a otras personas ("habría que ver con…") | Mira el reloj o el teléfono |
| Pregunta plazos o cómo seguiría | "Déjame ver y te aviso" sin más |
| Discute o corrige algún supuesto tuyo | Acuerdo fácil con todo (desinterés cortés) |

**Si va mal, reducir el pedido en vivo:**
> "Mira, te lo hago más fácil: ¿qué te parece si partimos con un solo bus y tres meses? Si de eso sale algo interesante, seguimos; si no, no te molesto más."

Un compromiso pequeño aceptado vale más que uno grande rechazado.

---

## 6. Cierres según escenario

| Escenario | Cómo cerrar |
|---|---|
| **Sí entusiasta** | Fijar quién manda los datos, por qué canal y en qué plazo. Ofrecer coordinar directo con esa persona. Confirmar todo por escrito el mismo día |
| **Sí tibio** ("veamos") | Proponer fecha concreta de seguimiento: "te escribo el martes 12 para ver cómo fue". Dejar el PDF |
| **"Lo tengo que consultar"** | Ofrecer material para esa instancia y preguntar si conviene que participes. Pedir fecha estimada |
| **No, por política de datos** | Sacar la carta del software en su infraestructura. Si tampoco, pedir lo único que cuesta cero: "¿me dirías al menos qué datos registran? Con eso ajusto el diseño" |
| **No, sin más** | Agradecer sinceramente, dejar la puerta abierta y pedir una sola cosa: "¿a quién más crees que le podría interesar esto?" |

---

## 7. Checklist antes de entrar

- [ ] Celular y notebook con la app abierta en `/flota/MIC-104` (y batería cargada).
- [ ] Probar que el sitio carga con datos móviles, no solo con WiFi.
- [ ] PDF `E-Bus-Control-datos-requeridos.pdf` listo para enviar en el momento (correo o WhatsApp ya abierto).
- [ ] Libreta o notas para anotar **sus frases textuales** — se reutilizan en el seguimiento.
- [ ] Las dos preguntas técnicas memorizadas (identificación bus↔sesión / reemplazo de packs).
- [ ] Tener claro el pedido mínimo: **5–10 buses, 6 meses, dos planillas**.
- [ ] Decidido de antemano el día concreto del seguimiento.

---

## 8. Lo único que hay que recordar si todo lo demás se olvida

1. **Preguntar antes de presentar.** Que él enuncie el problema.
2. **Una sola pantalla**, no diez.
3. **El pedido es mínimo y con salida fácil.**
4. **Salir con nombre y fecha**, no con "quedamos en contacto".

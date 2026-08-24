# Método de cálculo: degradación y proyección de vida útil

> El corazón técnico del proyecto. Explica cómo se estima el estado de salud (SoH) real de un pack a partir de datos de operación y carga, cómo se proyecta cuándo cruzará el umbral de reemplazo, y cuánto de esa degradación es atribuible a cada práctica.
>
> **Principio rector:** el número lo produce un cálculo determinista, reproducible y auditable. Nada de esto lo hace un modelo de lenguaje.

---

## Los cinco pasos

```
1. MEDIR      cada carga completa → un punto de capacidad real
2. FILTRAR    descartar las mediciones poco confiables
3. AJUSTAR    de puntos ruidosos → curva de degradación
4. PROYECTAR  extrapolar la curva → fecha de reemplazo
5. ATRIBUIR   qué prácticas explican la pendiente
```

---

## Paso 1 — Medir la capacidad real en cada carga

### La fórmula base

Si conozco cuánta energía entró a la batería y cuánto subió su estado de carga, puedo estimar la capacidad total del pack:

```
                    E_entregada [kWh]
C_estimada  =  ─────────────────────────  × 100
                 (SOC_final − SOC_inicial)
```

**Ejemplo:** una carga entrega 180 kWh y el SOC sube de 12% a 95% (ΔSOC = 83 puntos):

```
C_estimada = 180 / 83 × 100 = 216,9 kWh
```

Y el estado de salud es esa capacidad comparada con la nominal de fábrica:

```
SoH [%] = (C_estimada / C_nominal) × 100 = 216,9 / 229 × 100 = 94,7 %
```

### Corrección por eficiencia de carga

La energía que mide el cargador no es toda la que llega a las celdas: hay pérdidas en la conversión AC/DC, en el cableado y en la resistencia interna de la batería (que se van en calor). La eficiencia típica en carga DC de buses es η ≈ 0,92–0,95.

```
C_real = η × E_entregada / ΔSOC × 100
```

**Detalle importante y honesto:** para medir la *tendencia* —que es lo que interesa— no hace falta conocer η con exactitud. Si η se mantiene aproximadamente constante entre sesiones, introduce un sesgo constante que **se cancela al comparar mediciones en el tiempo**. Una batería que baja de 216 a 205 kWh perdió 5% de capacidad, aunque el valor absoluto tenga un sesgo del 5%.

Por eso conviene reportar dos cosas distintas:
- **SoH relativo** (respecto de la primera medición del propio bus) → confiable.
- **SoH absoluto** (respecto de la capacidad de fábrica) → depende de η y de que la capacidad nominal declarada sea real.

### Por qué solo sirven las cargas profundas

El SOC que reporta el BMS tiene error, especialmente en química LFP, cuya curva de voltaje es muy plana entre 20% y 80% (por eso cuesta saber exactamente dónde está). Un error típico es de ±2 puntos en cada extremo.

Propagando el error de la división:

```
σ_C / C  ≈  √[ (σ_E/E)² + (σ_ΔSOC/ΔSOC)² ]
```

Con σ_SOC = 2 puntos en cada extremo, el error de la diferencia es σ_ΔSOC = √2 × 2 ≈ 2,8 puntos:

| ΔSOC de la sesión | Error relativo de la capacidad |
|---|---|
| 20 puntos | 2,8 / 20 = **14 %** → inservible |
| 40 puntos | 2,8 / 40 = **7 %** → dudoso |
| 70 puntos | 2,8 / 70 = **4 %** → aceptable |
| 85 puntos | 2,8 / 85 = **3,3 %** → bueno |

> **Conclusión operativa:** solo se usan sesiones con ΔSOC ≥ 50–60 puntos. Las **cargas nocturnas completas son el punto de calibración natural**, y además terminan cerca del 100%, donde el BMS suele hacer balanceo de celdas y recalibrar su estimación de SOC. Las cargas de oportunidad de mediodía sirven para medir *estrés*, no para medir *capacidad*.

---

## Paso 2 — Filtrar: qué mediciones se aceptan

Cada sesión entrega un punto, pero no todos los puntos valen lo mismo. Criterios de admisión:

| Filtro | Umbral | Razón |
|---|---|---|
| Profundidad | ΔSOC ≥ 50 puntos | Error de propagación (arriba) |
| Sesión completa | Sin interrupciones ni desconexiones | Un corte invalida el balance de energía |
| SOC final | ≥ 90 % preferentemente | Zona de recalibración del BMS |
| Temperatura | Dentro de rango normal de operación | Fuera de rango, la capacidad aparente varía por física, no por degradación |
| Sin fallas | Sin códigos de error activos | Datos potencialmente corruptos |
| Coherencia | El bus estuvo detenido durante toda la sesión | Descarta mezclas de consumo |

**Corrección adicional por temperatura:** la capacidad *aparente* de una batería fría es menor sin que haya degradación real (a 5 °C una LFP puede entregar 10–15% menos que a 25 °C). Si hay datos de temperatura, se normaliza cada medición a una temperatura de referencia (25 °C) antes de compararlas. Si no los hay, se compara solo entre sesiones de temperatura similar.

---

## Paso 3 — Ajustar: de puntos ruidosos a una curva

Con las mediciones válidas se construye la serie SoH(t). Tres niveles de modelo, en orden de sofisticación:

### Modelo v0 — Lineal (el que se defiende con pocos datos)

```
SoH(t) = SoH₀ − k · t
```

- `k` = pendiente de degradación en puntos porcentuales por mes.
- Se ajusta por **regresión robusta** (Theil–Sen o mínimos cuadrados con exclusión de outliers), no por mínimos cuadrados simples: una sola medición mala no debe torcer la recta.
- Con 6–12 meses de historia, este es el modelo **honesto**: más complejidad no se sostiene con esa cantidad de datos.

### Modelo v1 — Raíz del tiempo (más fiel a la física)

La degradación no es lineal: es más rápida al principio y se desacelera, porque el mecanismo dominante (crecimiento de la capa SEI) sigue una ley de raíz cuadrada.

```
SoH(t) = SoH₀ − a · √t − b · Ah_acumulado
```

Separa las dos causas del envejecimiento:
- **Calendario** (`a·√t`): la batería envejece aunque no se use, acelerado por temperatura y por permanecer mucho tiempo a SOC alto.
- **Ciclado** (`b·Ah`): envejece por la energía que la atraviesa.

### Modelo v2 — Con factores de estrés (el diferenciador del proyecto)

La tasa instantánea de degradación se pondera por las condiciones reales de cada momento:

```
dQ/dt = k_base · f_T(T) · f_SOC(SOC) · f_C(C-rate)
```

**Factor de temperatura** (ley de Arrhenius) — el más determinante:

```
f_T = exp[ (Ea/R) · (1/T_ref − 1/T) ]
```

Con energía de activación típica de LFP, la regla práctica es: **cada +10 °C aproximadamente duplica la tasa de degradación.** Cargar con el pack a 40 °C en vez de 25 °C puede acelerar el envejecimiento cerca del doble.

**Factor de velocidad de carga** (C-rate):

```
C-rate = Potencia [kW] / Capacidad nominal [kWh]
```

Ejemplo: 150 kW sobre un pack de 229 kWh → C-rate ≈ 0,65C. Una carga nocturna a 80 kW → 0,35C. A mayor C-rate, mayor estrés.

**Factor de SOC:** permanecer largos períodos sobre 90% o bajo 10% acelera la degradación; la zona 20–80% es la más benigna.

### El índice de estrés que muestra la app

El valor 0–100 de la pantalla de Cargas es la combinación normalizada de esos factores por sesión:

```
Estrés = 100 · norm( w₁·f_T + w₂·f_C + w₃·f_profundidad + w₄·f_SOC_final )
```

Es un **proxy ordinal**: sirve para comparar sesiones entre sí ("esta carga castigó el triple que aquella"), no para afirmar "esta carga costó 0,03% de SoH". Esa segunda afirmación solo se puede hacer cuando los coeficientes estén calibrados con datos reales (paso 5).

---

## Paso 4 — Proyectar la fecha de reemplazo

### Cálculo directo (modelo lineal)

```
                SoH_actual − SoH_umbral
meses_restantes = ─────────────────────────
                            k
```

Con `SoH_umbral` = 70% (criterio habitual de fin de vida útil en tracción; algunas flotas usan 80%).

### Ejemplo numérico completo

Un bus con 14 meses de operación:

| | |
|---|---|
| Primera medición válida (mes 1) | 98,5 % |
| Última medición (mes 14) | 93,4 % |
| Pérdida observada | 5,1 puntos en 13 meses |
| **Pendiente k** | 5,1 / 13 = **0,392 puntos/mes** (≈ 4,7 %/año) |
| SoH actual | 93,4 % |
| Umbral | 70 % |
| **Proyección** | (93,4 − 70) / 0,392 = **59,7 meses ≈ 5,0 años** |

### La proyección debe ir con banda de incertidumbre

Reportar "59,7 meses" es falsa precisión. La pendiente `k` viene de una regresión y tiene error estándar σ_k; la proyección se expresa como rango:

```
t_min = ΔSoH / (k + σ_k)        t_max = ΔSoH / (k − σ_k)
```

Si σ_k = 0,05 puntos/mes:

```
t_min = 23,4 / 0,442 = 53 meses
t_max = 23,4 / 0,342 = 68 meses
```

> **Reporte correcto:** "el reemplazo se proyecta entre 53 y 68 meses (≈ 4,4 a 5,7 años), con los datos disponibles hasta hoy". Esto es más creíble y más profesional que un número único.

### Ajuste por la "rodilla" de fin de vida

Las baterías de litio no se degradan linealmente hasta el final: cerca del 70–80% de SoH suele aparecer un **codo** donde la degradación se acelera. Una proyección lineal tiende a ser **optimista** en esa zona. Mientras el pack esté sobre ~85%, la extrapolación lineal es razonable; bajo eso, hay que declarar explícitamente que el modelo puede estar subestimando.

---

## Paso 5 — Atribuir: por qué unos se degradan más rápido

Aquí está el aporte que ningún sistema del ecosistema entrega hoy.

### Regresión sobre los factores operacionales

Para cada bus y cada mes:

```
ΔSoH_mes = β₀ + β₁·(kWh cargados)
                + β₂·(% de cargas rápidas)
                + β₃·(temperatura media al conectar)
                + β₄·(% de cargas fuera de ventana óptima)
                + β₅·(km recorridos)
                + ε
```

Los coeficientes β cuantifican el peso de cada práctica. Ese es el número que permite afirmar, por ejemplo: *"cargar al mediodía con el pack sobre 35 °C está costando X puntos de SoH al año por unidad"*.

### Comparación entre unidades (lo viable con pocos datos)

Con 5–10 buses y 6–12 meses, la regresión múltiple tiene pocos grados de libertad. El enfoque robusto es **contrastar unidades con hábitos distintos**:

| | Bus A | Bus B |
|---|---|---|
| Cargas en ventana nocturna | 95 % | 40 % |
| Temperatura media al conectar | 24 °C | 37 °C |
| C-rate medio | 0,35C | 0,62C |
| **Pendiente de degradación** | 0,28 pts/mes | 0,51 pts/mes |

Conclusión defendible: el bus B se degrada **1,8 veces más rápido**, y sus tres diferencias de operación apuntan en la misma dirección que predice la física. Esto se enuncia como **asociación consistente con el modelo**, no como causalidad demostrada — para eso haría falta un experimento controlado.

Por eso importa que la muestra de buses incluya **contraste de hábitos**: si los 10 buses cargan igual, no hay nada que comparar.

---

## Validación: cómo se sabe si el cálculo sirve

1. **Contraste con el SoH del BMS.** Si el fabricante reporta SoH, comparar tendencias. Que coincidan valida el método; que difieran es en sí mismo un hallazgo (y suele deberse a que el BMS actualiza el SoH a saltos).
2. **Validación cruzada temporal.** Ajustar el modelo con los primeros N meses y verificar si predice bien los meses siguientes. Es la prueba honesta de capacidad predictiva.
3. **Consistencia física.** Una pérdida de 2–5% anual es plausible; 20% anual indica un error de método (o una falla real que debería tener otros síntomas).
4. **Coherencia entre unidades.** Buses del mismo lote con uso similar deberían mostrar pendientes parecidas.

---

## Limitaciones (decirlas antes de que las pregunten)

| Limitación | Cómo se maneja |
|---|---|
| Con 6 meses de datos, la señal (2–4%/año) es del orden del ruido de medición | Se reportan rangos, no valores puntuales; se privilegian cargas profundas |
| El SoH absoluto depende de η y de la capacidad nominal real | Se reporta también el SoH relativo, que es robusto |
| La proyección lineal ignora la rodilla de fin de vida | Se advierte explícitamente bajo 85% de SoH |
| Correlación ≠ causalidad en la atribución | Se enuncia como asociación consistente con la física |
| Si el pack fue reemplazado, la curva se rompe | Por eso es dato imprescindible en el pedido de información |
| Temperatura ambiente no siempre disponible | Se complementa con datos meteorológicos públicos de La Serena |

---

## En palabras simples: el balde que encoge

**Imaginemos que la batería es un balde de agua.**

**1. Medir el tamaño real del balde.** Cada vez que se carga el bus, se sabe cuánta agua se echó (los kWh que registró el cargador) y cuánto subió el nivel (el porcentaje de batería). Si echo 180 litros y el nivel sube del 12% al 95%, entonces el balde completo aguanta unos 217 litros. **Eso es medir la batería sin abrirla.**

**2. Medir muchas veces, no una.** El medidor de nivel no es perfecto: cada medición trae un poco de error. Por eso solo se usan las cargas de noche, que son las profundas —las que van casi de vacío a lleno—, porque ahí el error pesa mucho menos. Una carga rápida de mediodía que sube de 30% a 60% no sirve para medir: el error se come el resultado.

**3. Ver cómo encoge.** Juntando las mediciones de varios meses aparece la tendencia: si hace un año el balde aguantaba 229 litros y hoy aguanta 205, perdió 24 litros. Las mediciones sueltas suben y bajan, pero la línea que las atraviesa es clara.

**4. Estimar cuándo hay que cambiarlo.** Si pierde unos 2 litros al mes y el límite para reemplazarlo es 160 litros (el 70% del original), quedan (205 − 160) / 2 ≈ 22 meses. Y como la medición tiene incertidumbre, no se dice "22 meses" sino **"entre 19 y 26 meses"**.

**5. Explicar por qué unos encogen más rápido.** Acá está lo interesante: comparando los buses que cargan de noche y despacio con los que cargan al mediodía, rápido y con la batería caliente, se ve cuánto cuesta cada hábito. Ese es el número que permite decidir si conviene cambiar la programación de las cargas — porque tiene un valor en pesos.

**La idea de fondo:** la batería no dice cuánto le queda de vida, pero **cada carga es una medición gratuita** que ya está ocurriendo. Nadie estaba juntando esas mediciones.

---

## La versión de 30 segundos (para la reunión)

> "Cada vez que un bus carga, el cargador sabe cuánta energía entregó y la batería sabe cuánto subió su porcentaje. Con esas dos cosas se calcula cuánta capacidad real le queda al pack — es como medir el tamaño del estanque sabiendo cuántos litros entraron y cuánto subió la aguja.
>
> Haciendo ese cálculo en cada carga nocturna durante varios meses, sale la curva real de cómo se está gastando esa batería. Y esa curva, proyectada hacia adelante, dice en cuántos meses va a llegar al límite de reemplazo.
>
> Lo interesante viene después: comparando buses que cargan distinto se puede ver cuánto cuesta cada hábito — cargar al mediodía con la batería caliente versus cargar de noche. Eso ya no es un dato, es una decisión de operación."

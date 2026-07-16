# Preguntas para evaluar la prueba con datos reales

**E-Bus Control — INACAP La Serena** · Contacto: Tomás Ibacache (tomasibac@gmail.com)

**El objetivo:** hacer una prueba con datos históricos de algunas máquinas para construir la **primera curva real de degradación de las baterías de la flota** y medir el **impacto de cada carga y cada jornada de operación**. La prueba no requiere acceso a sistemas en vivo ni instalar nada en los buses: con exportaciones históricas (planillas/CSV) basta para el primer informe — que queda para ustedes.

**El prototipo se puede ver aquí** (con datos simulados, etiquetados como tales): https://ebus-test.vercel.app/cargas

---

## Sobre el acceso y el alcance de la prueba

1. ¿Quién es la contraparte dueña de los datos (Eserco, Liserco, DTPR/MTT)? ¿Necesitamos firmar un NDA o convenio? (Podemos canalizarlo vía INACAP si eso facilita las cosas.)
2. ¿Con cuántas máquinas y cuánta historia podríamos partir? ¿Hay registros guardados desde el inicio de la operación (noviembre 2024)?

## Sobre la telemetría del vehículo (Tracktec)

3. ¿Qué variables entrega la plataforma por bus (SOC, SOH, tensiones máx/mín de celda, temperaturas, códigos de falla, eventos de conducción) y con qué frecuencia se registran?
4. ¿Se puede exportar el histórico (CSV/Excel) o acceder por API/web services de solo lectura? ¿Quién administra esas credenciales?
5. ¿La flota participa del estudio de degradación de baterías de Tracktec con la Universidad Católica (DICTUC)? ¿Les han compartido resultados?

## Sobre la carga (El Sauce · Copec Voltex · Dhemax)

6. ¿Qué queda registrado por sesión de carga: kWh entregados, curva de potencia, SOC inicial y final, duración, horario? ¿Se registra también la temperatura del pack al conectar?
7. ¿Cómo se identifica qué bus cargó en cada sesión (tarjeta RFID, bahía asignada por unidad, registro manual)? — Esta es la llave para cruzar los datos de carga con los de telemetría.
8. ¿Cómo se programa hoy la carga (ventanas nocturnas, carga inteligente, cargas de oportunidad durante el día)? ¿Quién decide qué bus carga cuándo?

## Sobre el fabricante (Foton · Andes Motor · CATL)

9. ¿Cuáles son las condiciones de la garantía de las baterías (años/km y condiciones de carga exigidas)?
10. ¿Andes Motor ofrece alguna plataforma de monitoreo de fábrica o informes de salud de batería de posventa?

## Sobre la operación y la mantención

11. ¿Cómo se registran hoy las mantenciones y fallas (sistema, planilla)? ¿Qué protocolo se sigue ante una falla en ruta?
12. ¿Qué pregunta les gustaría responder primero con datos? (Por ejemplo: ¿cuánto degrada una carga rápida en un día caluroso versus una carga nocturna?) ¿Qué indicador les importa más: costo por kilómetro, disponibilidad de flota, fecha estimada de reemplazo de packs?

---

**Nota sobre datos personales:** los datos de conductores son datos personales (Ley 21.719). En la prueba trabajaríamos con indicadores anonimizados o agregados por flota — sin nombres.

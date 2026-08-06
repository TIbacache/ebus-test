# Datos para la prueba con la flota

**E-Bus Control** · Tomás Ibacache Cortés — INACAP La Serena · tomasibac@gmail.com
Prototipo: https://ebus-test.vercel.app/cargas

---

## El objetivo

Calcular **cuánto se degrada cada batería por efecto de las cargas y de la operación**, y con eso **proyectar cuándo correspondería reemplazar cada pack**. Es el cálculo que hoy ningún sistema entrega: unos miden la ruta, otros el enchufe, y nadie cruza ambos.

**No necesito** acceso a sus sistemas, instalar nada en los buses, ni datos personales de conductores. Solo planillas de lo que ya registran.

**Sin costo ni compromiso:** el informe con la curva real de degradación queda para ustedes, les sirva o no mi proyecto.

---

## Cómo exportar (importante)

Si el sistema tiene botón de **exportar**, úsenlo con el rango de fechas más largo posible y **mándenme el archivo tal como sale, con todas sus columnas**. No hace falta limpiar, filtrar ni ordenar nada.

Las tablas siguientes son para verificar qué está disponible — **no una lista para armar a mano**.

---

## Archivo 1 — Telemetría de los buses

Una fila por registro en el tiempo (cada pocos minutos, o lo que entregue el sistema).

| Dato | |
|---|---|
| Identificador del bus (patente o nº interno) | **Imprescindible** |
| Fecha y hora | **Imprescindible** |
| Estado de carga — SOC (%) | **Imprescindible** |
| Kilómetros / odómetro | **Imprescindible** |
| Estado de salud — SOH (%), si lo entrega | Importante |
| Temperatura de batería | Importante |
| Energía consumida (kWh), voltaje, corriente | Importante |
| Tensión máx/mín de celda, códigos de falla, GPS | Suma |

## Archivo 2 — Sesiones de carga

Una fila por sesión de carga.

| Dato | |
|---|---|
| **Qué bus cargó** — si el sistema registra tarjeta RFID o nº de bahía, sirve igual: adjuntar la tabla que asocia esa tarjeta/bahía con cada bus | **Imprescindible** |
| Fecha y hora de inicio y término | **Imprescindible** |
| Energía entregada (kWh) | **Imprescindible** |
| SOC al inicio y al final de la carga (%) | **Imprescindible** |
| Potencia máxima y promedio (kW) | Importante |
| Identificador de cargador o bahía | Importante |
| Temperatura del pack al conectar, si se registra | Importante |

> **Por qué estos cuatro son los críticos:** la capacidad real de una batería se estima como *energía entregada ÷ variación de SOC*. Aplicado a las cargas nocturnas de varios meses, entrega la curva de degradación real de cada pack — de forma independiente al valor que reporte el vehículo. Con solo esos cuatro datos ya puedo entregar un primer resultado útil.

---

## Tres datos de contexto (no son planilla)

1. **Fecha de puesta en servicio** de cada bus incluido.
2. **Si algún pack fue reemplazado o intervenido**, y cuándo. Es clave: un módulo cambiado reinicia la curva y sin ese dato el análisis se interpretaría mal.
3. Confirmación de la **capacidad nominal** del pack (entiendo que son 229 kWh) y si todas las unidades son del mismo modelo.

Si además existe una planilla de mantenciones o fallas en ruta, bienvenida.

---

## Alcance sugerido

| | |
|---|---|
| **Buses** | Entre 5 y 10. Ideal si hay contraste: alguno de los que más kilómetros hace y alguno de los que menos |
| **Período** | Mínimo 6 meses. Ideal desde el inicio de la operación |
| **Formato** | CSV o Excel, tal como lo exporte el sistema |
| **Entrega** | Drive, WeTransfer o correo. Si prefieren firmar un acuerdo de confidencialidad antes, sin problema |

**Si algo de esto no está disponible, no es impedimento:** mándenme lo que sí exista. Cada dato que falte reduce precisión en una parte del análisis, no lo invalida.

*Sobre datos personales: no necesito nombres de conductores. Si las planillas los traen, los reemplazo por códigos apenas los recibo (Ley 21.719).*

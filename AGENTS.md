<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ebus-control-project -->
# E-Bus Control — reglas del proyecto

Mockup navegable "mission control" para monitoreo de baterías de micros eléctricas (INACAP La Serena). **Primer prototipo.** Spec completa en `docs/` (prompt-maestro-ebus-v2.md + infografías + PDF + PPTX). Deploy: GitHub → Vercel (ramas + PR + Preview; merge a `main` = producción).

## Idioma
TODO el texto de UI y contenido en **español chileno** (ej. "micros", no "buses"). Comunicación con el equipo también en español.

## Datos canónicos (usar EXACTAMENTE, centralizados en `lib/data.ts`)
- Flota: total **120**, en recorrido **98**, con alerta **3**, fuera de servicio **2**.
- Unidades: MIC-101 85% healthy (Carlos Muñoz) · MIC-102 62% normal (Jorge Pérez) · MIC-103 35% warning (Luis Torres) · MIC-104 15% **critical** (Pedro Flores) · MIC-105 78% healthy (Mario Díaz).
- Caso activo MIC-104: ubicación "Av. Central con San Martín", falla "Tensión de Celda Baja (Crítico)", mecánico ETA 15 min. Debe verse con **badge rojo pulsante** en Dashboard/Flota/Detalle/Alertas.
- Ignorar "Unidad 405" de infografías viejas: la unidad crítica es **MIC-104**.

## Paleta y tema (tokens `@theme inline` en `app/globals.css` — Tailwind v4, sin tailwind.config)
El semáforo de batería y el acento teal son **constantes**: healthy `#22C55E` · normal `#84CC16` · warning `#FF8C00` · critical `#FF4444` · primary/teal `#00D4AA` · primary-hover `#00B894`. Los tokens de superficie/texto son **themables** y se voltean con la clase `.dark` en `<html>`. Valores del tema **oscuro** (en `.dark`): bg `#0A0E1A` · surface `#111827` · surface-2 `#1a2235` · surface-offset `#1f2d40` · text `#E2E8F0` · text-muted `#94A3B8` · text-faint `#475569`. El **tema claro es el default** (definido en `:root`, estilo Infografía1: cards claras + sidebar siempre oscuro navy `#0f1829`).

**Tema claro por defecto + toggle a oscuro** (`components/theme/ThemeToggle.tsx`; script no-flash en `app/layout.tsx`). Acento **teal** `#00D4AA`; sidebar siempre oscuro como firma de marca. **NO** gradientes púrpura/violeta, **NO** cards con borde-izquierdo de color. Glassmorphism sutil solo en overlays (usar util `.glass`, con `--glass-bg` themable).

## Stack y convenciones
- Next.js 16 (App Router) + React 19.2 + TypeScript + Turbopack. Tailwind v4. Fuente General Sans (Fontshare) vía `next/font/local`.
- Animación: **`motion`** (import desde `motion/react`, NO `framer-motion`). Gráficos: **`recharts`** (componentes con `"use client"`). Íconos: `lucide-react`. Override `react-is: $react` ya fijado en package.json.
- Componentes con hooks/estado/motion/recharts → `"use client"`.
- Next 16: `params`/`searchParams` son **async (Promise)** → resolver con `await` (server) o `use()` (client). **NO** usar `next/dynamic { ssr:false }` dentro de Server Components.
- ODS 3/7/13 y metáfora "El Corazón del Bus" (línea ECG) deben estar visibles en la app.
<!-- END:ebus-control-project -->

"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Phone,
  Search,
  Send,
  X,
} from "lucide-react";
import { ods, equipo, institucion } from "@/lib/constants";
import { EcgLogo } from "@/components/ui/EcgLogo";
import {
  contacto,
  faqItems,
  guideSteps,
  menuSections,
  searchHelp,
  systemStack,
  systemVersion,
  type SupportSectionId,
} from "./helpContent";

type Active = "menu" | SupportSectionId;

const inputCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20";
const labelCls = "text-sm font-medium text-text-muted";

function folio(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function SupportPanel({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<Active>("menu");

  const current = menuSections.find((s) => s.id === active);
  const title = active === "menu" ? "Centro de Soporte" : current?.title ?? "Soporte";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Encabezado */}
      <div className="flex shrink-0 items-center gap-2 border-b border-line px-4 py-3">
        {active === "menu" ? (
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <EcgLogo size={22} />
          </span>
        ) : (
          <button
            onClick={() => setActive("menu")}
            aria-label="Volver al menú de soporte"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
          >
            <ArrowLeft className="size-[18px]" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">{title}</h2>
          {active === "menu" && (
            <p className="truncate text-[11px] text-text-faint">
              Ayuda de E-Bus Control
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar soporte"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
        >
          <X className="size-[18px]" />
        </button>
      </div>

      {/* Cuerpo */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, x: active === "menu" ? -12 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {active === "menu" && <Menu onPick={setActive} />}
            {active === "error" && <ErrorForm />}
            {active === "sugerencia" && <SugerenciaForm />}
            {active === "guia" && <Guia onClose={onClose} />}
            {active === "buscador" && (
              <Buscador onClose={onClose} onSection={setActive} />
            )}
            {active === "faq" && <Faq />}
            {active === "contacto" && <Contacto />}
            {active === "sistema" && <Sistema />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---- Menú -----------------------------------------------------------------

function Menu({ onPick }: { onPick: (id: SupportSectionId) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="mb-1 px-1 text-xs text-text-muted">
        ¿En qué te podemos ayudar?
      </p>
      {menuSections.map((s) => {
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            onClick={() => onPick(s.id)}
            className="group flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-surface-2"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">
                {s.title}
              </span>
              <span className="block truncate text-xs text-text-faint">
                {s.desc}
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-text-faint transition-transform group-hover:translate-x-0.5" />
          </button>
        );
      })}
    </div>
  );
}

// ---- Confirmación reutilizable --------------------------------------------

function Confirmacion({
  folio: code,
  mensaje,
  onReset,
  resetLabel,
}: {
  folio: string;
  mensaje: string;
  onReset: () => void;
  resetLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-3 rounded-xl border border-healthy/30 bg-healthy/5 px-4 py-6 text-center"
    >
      <span className="grid size-12 place-items-center rounded-full bg-healthy/15 text-healthy">
        <Check className="size-6" />
      </span>
      <div>
        <p className="text-sm font-semibold">¡Recibido!</p>
        <p className="mt-1 text-sm text-text-muted">{mensaje}</p>
      </div>
      <span className="tnum rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-primary">
        Folio {code}
      </span>
      <button
        onClick={onReset}
        className="mt-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
      >
        {resetLabel}
      </button>
    </motion.div>
  );
}

// ---- Formulario: Reportar un error ----------------------------------------

const severidades = [
  { value: "baja", label: "Baja", color: "#22C55E" },
  { value: "media", label: "Media", color: "#FF8C00" },
  { value: "alta", label: "Alta", color: "#FF4444" },
] as const;

function ErrorForm() {
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [pantalla, setPantalla] = useState(guideSteps[1].title);
  const [severidad, setSeveridad] = useState<string>("media");
  const [code, setCode] = useState<string | null>(null);

  if (code) {
    return (
      <Confirmacion
        folio={code}
        mensaje="Tu reporte de error fue registrado. El equipo de Soporte lo revisará a la brevedad."
        onReset={() => {
          setCode(null);
          setAsunto("");
          setDescripcion("");
        }}
        resetLabel="Reportar otro error"
      />
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setCode(folio("ERR"));
      }}
      className="flex flex-col gap-3.5"
    >
      <p className="text-xs text-text-muted">
        Describe el problema y lo revisaremos. Los tickets son simulados en este
        prototipo.
      </p>
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Asunto</span>
        <input
          required
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          placeholder="Ej: El mapa no carga en el Dashboard"
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Descripción</span>
        <textarea
          required
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="¿Qué pasó y qué esperabas que pasara?"
          className={`${inputCls} resize-none`}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Pantalla afectada</span>
        <select
          value={pantalla}
          onChange={(e) => setPantalla(e.target.value)}
          className={inputCls}
        >
          {guideSteps.map((g) => (
            <option key={g.href} value={g.title} className="bg-surface">
              {g.title}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-col gap-1.5">
        <span className={labelCls}>Severidad</span>
        <div className="grid grid-cols-3 gap-2">
          {severidades.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSeveridad(s.value)}
              className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                severidad === s.value
                  ? "border-primary/50 bg-primary/10 text-text"
                  : "border-line text-text-muted hover:bg-surface-2"
              }`}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-primary-hover"
      >
        <Send className="size-4" /> Enviar reporte
      </button>
    </form>
  );
}

// ---- Formulario: Enviar sugerencia ----------------------------------------

const categoriasSugerencia = [
  "Interfaz y usabilidad",
  "Nueva funcionalidad",
  "Rendimiento",
  "Datos y reportes",
  "Otro",
];

function SugerenciaForm() {
  const [categoria, setCategoria] = useState(categoriasSugerencia[0]);
  const [sugerencia, setSugerencia] = useState("");
  const [code, setCode] = useState<string | null>(null);

  if (code) {
    return (
      <Confirmacion
        folio={code}
        mensaje="¡Gracias por tu idea! La tendremos en cuenta para las próximas iteraciones."
        onReset={() => {
          setCode(null);
          setSugerencia("");
        }}
        resetLabel="Enviar otra sugerencia"
      />
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setCode(folio("SUG"));
      }}
      className="flex flex-col gap-3.5"
    >
      <p className="text-xs text-text-muted">
        Cuéntanos cómo mejorar E-Bus Control. Toda idea suma.
      </p>
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Categoría</span>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={inputCls}
        >
          {categoriasSugerencia.map((c) => (
            <option key={c} value={c} className="bg-surface">
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Tu sugerencia</span>
        <textarea
          required
          rows={4}
          value={sugerencia}
          onChange={(e) => setSugerencia(e.target.value)}
          placeholder="Describe tu idea con el mayor detalle posible…"
          className={`${inputCls} resize-none`}
        />
      </label>
      <button
        type="submit"
        className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-primary-hover"
      >
        <Send className="size-4" /> Enviar sugerencia
      </button>
    </form>
  );
}

// ---- Guía rápida ----------------------------------------------------------

function Guia({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="mb-1 text-xs text-text-muted">
        Un recorrido por las 9 pantallas. Toca cualquiera para ir directo.
      </p>
      {guideSteps.map((g) => {
        const Icon = g.icon;
        return (
          <Link
            key={g.href}
            href={g.href}
            onClick={onClose}
            className="group flex items-start gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-surface-2"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="tnum text-[10px] font-bold text-text-faint">
                  {String(g.n).padStart(2, "0")}
                </span>
                <span className="truncate text-sm font-semibold">{g.title}</span>
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-text-muted">
                {g.desc}
              </span>
            </span>
            <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-text-faint transition-colors group-hover:text-primary" />
          </Link>
        );
      })}
    </div>
  );
}

// ---- Buscador inteligente -------------------------------------------------

function Buscador({
  onClose,
  onSection,
}: {
  onClose: () => void;
  onSection: (id: SupportSectionId) => void;
}) {
  const [query, setQuery] = useState("");
  const results = searchHelp(query);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-faint" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca pantallas, unidades, acciones…"
          className={`${inputCls} pl-9`}
        />
      </div>

      {query.trim() === "" ? (
        <p className="px-1 py-6 text-center text-xs text-text-faint">
          Prueba con “alertas”, “MIC-104”, “umbrales” o “eco-score”.
        </p>
      ) : results.length === 0 ? (
        <p className="px-1 py-6 text-center text-xs text-text-faint">
          Sin resultados para “{query}”.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {results.map((r) => {
            const Icon = r.icon;
            const inner = (
              <>
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-text-muted">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {r.label}
                  </span>
                  <span className="block truncate text-[11px] text-text-faint">
                    {r.hint}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-text-faint" />
              </>
            );
            const cls =
              "flex w-full items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-surface-2";
            return (
              <li key={r.label}>
                {r.href ? (
                  <Link href={r.href} onClick={onClose} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <button
                    onClick={() => r.section && onSection(r.section)}
                    className={cls}
                  >
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ---- FAQ ------------------------------------------------------------------

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-2">
      {faqItems.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="overflow-hidden rounded-lg border border-line bg-surface"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
            >
              <span className="flex-1 text-sm font-medium">{item.q}</span>
              <ChevronDown
                className={`size-4 shrink-0 text-text-faint transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-3 pb-3 text-xs leading-relaxed text-text-muted">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ---- Contacto -------------------------------------------------------------

function Contacto() {
  const [copied, setCopied] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(contacto.display);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard no disponible */
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-line bg-surface px-4 py-6 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
          <Phone className="size-6" />
        </span>
        <div>
          <p className="text-xs text-text-muted">Soporte E-Bus Control</p>
          <p className="tnum mt-1 text-xl font-bold tracking-tight">
            {contacto.display}
          </p>
        </div>
        <p className="flex items-center gap-1.5 text-[11px] text-text-faint">
          <Clock className="size-3.5" /> {contacto.horario}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={`tel:${contacto.tel}`}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-primary-hover"
        >
          <Phone className="size-4" /> Llamar
        </a>
        <button
          onClick={copiar}
          className="flex items-center justify-center gap-2 rounded-lg border border-line bg-surface py-2.5 text-sm font-semibold transition-colors hover:bg-surface-2"
        >
          {copied ? (
            <>
              <Check className="size-4 text-healthy" /> Copiado
            </>
          ) : (
            <>
              <Copy className="size-4" /> Copiar
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ---- Información del sistema -----------------------------------------------

function Sistema() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-4">
        <EcgLogo size={40} />
        <div>
          <p className="text-sm font-bold tracking-tight">
            E-Bus <span className="text-primary">Control</span>
          </p>
          <p className="text-xs text-text-muted">{systemVersion}</p>
        </div>
      </div>

      <p className="rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-xs leading-relaxed text-text-muted">
        <span className="font-semibold text-text">“El Corazón del Bus”:</span>{" "}
        como un monitor cardíaco, el sistema vigila el pulso (voltaje) de cada
        batería, predice arritmias (fallas) y alerta al instante al Centro de
        Control.
      </p>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-faint">
          Impacto ODS
        </p>
        <div className="flex flex-col gap-1.5">
          {ods.map((o) => (
            <div
              key={o.num}
              className="flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3 py-2"
            >
              <span
                className="grid size-7 shrink-0 place-items-center rounded text-xs font-bold text-white"
                style={{ backgroundColor: o.color }}
              >
                {o.num}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">{o.nombre}</p>
                <p className="text-[11px] leading-snug text-text-faint">
                  {o.detalle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-faint">
          Equipo
        </p>
        <div className="flex flex-wrap gap-1.5">
          {equipo.map((n) => (
            <span
              key={n}
              className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-text-muted"
            >
              {n}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-text-faint">{institucion}</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-faint">
          Tecnología
        </p>
        <div className="flex flex-wrap gap-1.5">
          {systemStack.map((s) => (
            <span
              key={s}
              className="rounded-md bg-surface-2 px-2 py-1 text-[11px] font-medium text-text-muted"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  Users,
  Bell,
  Zap,
  KeyRound,
  Check,
} from "lucide-react";
import { usuariosSistema } from "@/lib/data";
import { umbrales } from "@/lib/constants";

function Section({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: typeof Bell;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-text-faint">{desc}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between py-2 text-sm"
    >
      <span className="font-medium">{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${
          on ? "bg-primary" : "bg-surface-offset"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export default function ConfiguracionPage() {
  const [critico, setCritico] = useState<number>(umbrales.critico);
  const [advertencia, setAdvertencia] = useState<number>(umbrales.advertencia);
  const [tempMax, setTempMax] = useState(45);
  const [notif, setNotif] = useState({ email: true, push: true, sms: false });
  const [guardado, setGuardado] = useState(false);

  function guardar() {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Configuración</h2>
          <p className="text-sm text-text-muted">
            Parámetros del sistema E-Bus Control
          </p>
        </div>
        <button
          onClick={guardar}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors sm:w-auto ${
            guardado
              ? "bg-healthy text-bg"
              : "bg-primary text-bg hover:bg-primary-hover"
          }`}
        >
          {guardado ? (
            <>
              <Check className="size-4" /> Guardado
            </>
          ) : (
            "Guardar cambios"
          )}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Umbrales */}
        <Section
          icon={SlidersHorizontal}
          title="Umbrales de alerta"
          desc="Define los niveles de batería que disparan alertas"
        >
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-critical">Crítico</span>
                <span className="tnum font-semibold">menos de {critico}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={critico}
                onChange={(e) => setCritico(Number(e.target.value))}
                className="mt-2 w-full"
                style={{ accentColor: "#FF4444" }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-warning">Advertencia</span>
                <span className="tnum font-semibold">menos de {advertencia}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={50}
                value={advertencia}
                onChange={(e) => setAdvertencia(Number(e.target.value))}
                className="mt-2 w-full"
                style={{ accentColor: "#FF8C00" }}
              />
            </div>
          </div>
        </Section>

        {/* Notificaciones */}
        <Section
          icon={Bell}
          title="Notificaciones"
          desc="Canales de aviso por tipo de alerta"
        >
          <div className="divide-y divide-line">
            <Toggle
              label="Email"
              on={notif.email}
              onChange={(v) => setNotif((n) => ({ ...n, email: v }))}
            />
            <Toggle
              label="Push"
              on={notif.push}
              onChange={(v) => setNotif((n) => ({ ...n, push: v }))}
            />
            <Toggle
              label="SMS"
              on={notif.sms}
              onChange={(v) => setNotif((n) => ({ ...n, sms: v }))}
            />
          </div>
        </Section>

        {/* Carga inteligente */}
        <Section
          icon={Zap}
          title="Carga inteligente"
          desc="Optimiza el método y momento de recarga"
        >
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-text-muted">Horario óptimo</span>
              <input
                type="text"
                defaultValue="23:00 – 06:00"
                className="rounded-lg border border-line bg-surface px-3 py-2 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-text-muted">
                  Temperatura máxima de carga
                </span>
                <span className="tnum font-semibold">{tempMax}°C</span>
              </div>
              <input
                type="range"
                min={30}
                max={55}
                value={tempMax}
                onChange={(e) => setTempMax(Number(e.target.value))}
                className="mt-2 w-full"
                style={{ accentColor: "#00D4AA" }}
              />
            </div>
          </div>
        </Section>

        {/* Integraciones */}
        <Section
          icon={KeyRound}
          title="Integraciones"
          desc="Claves de API de servicios externos"
        >
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-text-muted">API Key — Telemetría IoT</span>
              <input
                type="password"
                defaultValue="ebus_live_8f3a92c4d1"
                className="rounded-lg border border-line bg-surface px-3 py-2 font-mono outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-text-muted">API Key — Mapas / GPS</span>
              <input
                type="password"
                defaultValue="maps_sk_5b21e7f099"
                className="rounded-lg border border-line bg-surface px-3 py-2 font-mono outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
        </Section>
      </div>

      {/* Gestión de usuarios */}
      <Section
        icon={Users}
        title="Gestión de usuarios"
        desc="Roles activos en el sistema"
      >
        <div className="overflow-x-auto scroll-x-shadow">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-text-faint">
                <th className="py-2.5 pr-4 font-medium">Usuario</th>
                <th className="py-2.5 pr-4 font-medium">Rol</th>
                <th className="py-2.5 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {usuariosSistema.map((u) => (
                <tr key={u.nombre}>
                  <td className="py-2.5 pr-4 font-medium">{u.nombre}</td>
                  <td className="py-2.5 pr-4 text-text-muted">{u.rol}</td>
                  <td className="py-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.estado === "Activo"
                          ? "bg-healthy/10 text-healthy"
                          : "bg-text-faint/10 text-text-faint"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          u.estado === "Activo" ? "bg-healthy" : "bg-text-faint"
                        }`}
                      />
                      {u.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

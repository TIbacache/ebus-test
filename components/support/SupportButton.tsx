"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LifeBuoy } from "lucide-react";
import { SupportPanel } from "./SupportPanel";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Detecta viewport móvil (< md). Lazy-init evita flash en el primer render. */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

export function SupportButton() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Esc para cerrar, focus-trap con Tab y bloqueo de scroll del body.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    const focusTimer = setTimeout(() => panel?.focus(), 20);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key === "Tab" && panel) {
        const items = Array.from(
          panel.querySelectorAll<HTMLElement>(FOCUSABLE),
        );
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Soporte y ayuda"
        title="Soporte"
        className={`grid size-9 place-items-center rounded-lg transition-colors hover:bg-surface-2 hover:text-text ${
          open ? "bg-surface-2 text-primary" : "text-text-muted"
        }`}
      >
        <LifeBuoy className="size-[18px]" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Backdrop: atenuado en móvil, invisible (solo captura clic) en desktop */}
            <div
              onClick={close}
              className={`absolute inset-0 ${
                isMobile ? "bg-black/40 backdrop-blur-[2px]" : ""
              }`}
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Centro de soporte de E-Bus Control"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              initial={
                isMobile
                  ? { y: "100%" }
                  : { opacity: 0, scale: 0.96, y: -8 }
              }
              animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={
                isMobile ? { y: "100%" } : { opacity: 0, scale: 0.96, y: -8 }
              }
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className={`glass flex flex-col border-line shadow-2xl outline-none ${
                isMobile
                  ? "absolute inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl border-t"
                  : "absolute right-4 top-16 max-h-[calc(100dvh-5.5rem)] w-[min(360px,calc(100vw-2rem))] rounded-2xl border"
              }`}
            >
              {isMobile && (
                <div className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-text-faint/40" />
              )}
              <SupportPanel onClose={close} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

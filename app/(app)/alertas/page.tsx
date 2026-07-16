import {
  getAlertasActivas,
  getAlertasResueltas,
  getTimelineAlerta,
} from "@/lib/api";
import { AlertasView } from "@/components/alertas/AlertasView";

export default async function AlertasPage() {
  const [activas, resueltas] = await Promise.all([
    getAlertasActivas(),
    getAlertasResueltas(),
  ]);
  const critica = activas.find((a) => a.estadoUnidad === "critical");
  const timeline = critica ? await getTimelineAlerta(critica.id) : [];

  return (
    <AlertasView
      alertasIniciales={activas}
      alertasResueltas={resueltas}
      timeline={timeline}
    />
  );
}

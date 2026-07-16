import { getHistorialMecanico, getSolicitudMecanico } from "@/lib/api";
import { MecanicoView } from "@/components/mecanico/MecanicoView";

export default async function MecanicoPage() {
  const [solicitud, historial] = await Promise.all([
    getSolicitudMecanico(),
    getHistorialMecanico(),
  ]);

  return <MecanicoView solicitud={solicitud} historial={historial} />;
}

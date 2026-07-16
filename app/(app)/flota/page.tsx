import { getFleetSummary, getUnidades } from "@/lib/api";
import { FlotaView } from "@/components/flota/FlotaView";

export default async function FlotaPage() {
  const [summary, unidades] = await Promise.all([
    getFleetSummary(),
    getUnidades(),
  ]);

  return (
    <FlotaView
      unidades={unidades}
      unidadesExtra={summary.total - unidades.length}
    />
  );
}

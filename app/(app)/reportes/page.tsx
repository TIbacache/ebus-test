import {
  getDegradacionFlota,
  getEcoScorePorConductor,
  getFallasEvitadas,
  getIncidenciasPorUnidad,
  getTendenciaSaludFlota,
} from "@/lib/api";
import { ReportesView } from "@/components/reportes/ReportesView";

export default async function ReportesPage() {
  const [
    degradacionFlota,
    ecoScorePorConductor,
    tendenciaSaludFlota,
    incidenciasPorUnidad,
    fallasEvitadas,
  ] = await Promise.all([
    getDegradacionFlota(),
    getEcoScorePorConductor(),
    getTendenciaSaludFlota(),
    getIncidenciasPorUnidad(),
    getFallasEvitadas(),
  ]);

  return (
    <ReportesView
      degradacionFlota={degradacionFlota}
      ecoScorePorConductor={ecoScorePorConductor}
      tendenciaSaludFlota={tendenciaSaludFlota}
      incidenciasPorUnidad={incidenciasPorUnidad}
      fallasEvitadas={fallasEvitadas}
    />
  );
}

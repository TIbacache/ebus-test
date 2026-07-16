import { notFound } from "next/navigation";
import { getEcoScore7d, getUnidad } from "@/lib/api";
import { ConductorView } from "@/components/conductor/ConductorView";

/** Vista de cabina del conductor del caso activo (MIC-104 · Pedro Flores). */
export default async function ConductorPage() {
  const [unidad, ecoScore7d] = await Promise.all([
    getUnidad("MIC-104"),
    getEcoScore7d(),
  ]);
  if (!unidad) notFound();

  return <ConductorView unidad={unidad} ecoScore7d={ecoScore7d} />;
}

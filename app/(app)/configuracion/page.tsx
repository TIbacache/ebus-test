import { getUsuariosSistema } from "@/lib/api";
import { ConfiguracionView } from "@/components/configuracion/ConfiguracionView";

export default async function ConfiguracionPage() {
  const usuarios = await getUsuariosSistema();

  return <ConfiguracionView usuarios={usuarios} />;
}

import { db } from "../index";
import { tipoCategoria } from '../schema';

export async function seedTipoCategoria() {
  const existe = await db.select().from(tipoCategoria);

  if (existe.length > 0) 
    return;
  
  await db.insert(tipoCategoria).values([
    { codigo: "E", descricao: "Receita" },
    { codigo: "S", descricao: "Despesa" },
  ]);
}

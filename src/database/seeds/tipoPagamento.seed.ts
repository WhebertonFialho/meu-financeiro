import { db } from "../index";
import { tipoLancamento } from '../schema';

export async function seedTipoPagamento() {
  const existe = await db.select().from(tipoLancamento);

  if (existe.length > 0) 
    return;
  
  await db.insert(tipoLancamento).values([
    { descricao: "Cartão Crédito", parcelado: true },
    { descricao: "Cartão Débito", parcelado: false },
    { descricao: "PIX", parcelado: false },
    { descricao: "Dinheiro", parcelado: false },
    { descricao: "Recorrente", parcelado: true },
  ]);
}

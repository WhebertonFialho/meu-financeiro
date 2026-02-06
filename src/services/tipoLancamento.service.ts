import { db } from "@database/index";
import { tipoLancamento } from "@database/schema";

export type TipoLancamentoDTO = typeof tipoLancamento.$inferInsert;

class TipoLancamentoService {
  async findAll() {
    return await db.query.tipoLancamento.findMany({
      orderBy: (tipoLancamento, { asc }) => [asc(tipoLancamento.descricao)],
    });
  }
}

export const tipoLancamentoService = new TipoLancamentoService();
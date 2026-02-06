import { db } from "@database/index";
import { tipoCategoria } from "@database/schema";

export type TipoCategoriaDTO = typeof tipoCategoria.$inferInsert;

class TipoCategoriaService {
  async findAll() {
    return await db.query.tipoCategoria.findMany({
      orderBy: (tipoCategoria, { asc }) => [asc(tipoCategoria.descricao)],
    });
  }
}

export const tipoCategoriaService = new TipoCategoriaService();
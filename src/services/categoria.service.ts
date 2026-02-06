import { db } from "@database/index";
import { categoria, tipoCategoria } from "@database/schema";
import { eq, like, sql } from "drizzle-orm";
import { lancamento } from '../database/schema';

export type CategoriaDTO = typeof categoria.$inferInsert;

class CategoriaService {
  async create(data: CategoriaDTO) {
    try {
      const tipo = await db.query.tipoCategoria.findFirst({
        where: eq(tipoCategoria.codigo, data.tipo),
      });

      if (!tipo)
        throw new Error("Tipo de categoria inválido");

      const [result] = await db
        .insert(categoria)
        .values({
          descricao: data.descricao.trim(),
          tipo: data.tipo,
        })
        .returning({ codigo: categoria.codigo });

      return result;
    } catch (e: any) {
      throw new Error(e?.message ?? "Erro ao criar categoria");
    }
  }

  async findAll(search?: string) {
    return await db.query.categoria.findMany({
      where: search ? like(categoria.descricao, `%${search}%`) : undefined,
      orderBy: (categoria, { asc }) => [asc(categoria.descricao)],
      with: {}
    });
  }

  async findById(codigo: number) {
    const row = await db.query.categoria.findFirst({
      where: eq(categoria.codigo, codigo),
    });

    if (!row)
      throw new Error("Categoria não encontrada");

    return row;
  }

  async update(codigo: number, data: Partial<CategoriaDTO>) {
    if (data.tipo) {
      const tipo = await db.query.tipoCategoria.findFirst({
        where: eq(tipoCategoria.codigo, data.tipo),
      });

      if (!tipo) 
        throw new Error("Tipo de categoria inválido");
    }

    const result = await db
      .update(categoria)
      .set({
        ...(data.descricao && { descricao: data.descricao.trim() }),
        ...(data.tipo && { tipo: data.tipo }),
      })
      .where(eq(categoria.codigo, codigo))
      .returning();

    if (result.length === 0) 
      throw new Error("Categoria não encontrada");

    return result[0];
  }

  async remove(codigo: number) {
    const existeLancamento = await await db
      .select({ count: sql<number>`count(*)` })
      .from(lancamento)
      .where(eq(lancamento.categoria, codigo))
      .limit(1);

    if (Number(existeLancamento[0].count) > 0) 
      throw new Error("Categoria em Uso.");

    const result = await db
      .delete(categoria)
      .where(eq(categoria.codigo, codigo))
      .returning();

    if (result.length === 0) 
      throw new Error("Categoria não encontrada");

    return true;
  }
}

export const categoriaService = new CategoriaService();
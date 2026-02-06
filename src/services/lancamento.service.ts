import { db } from "@database/index";
import { lancamento, tipoLancamento, categoria, tipoCategoria } from "@database/schema";
import { and, gte, lte, eq, sql } from "drizzle-orm";

export type LancamentoDTO = typeof lancamento.$inferInsert;

const toISO = (date: Date) => date.toISOString();

class LancamentoService {

    async create(data: LancamentoDTO) {
        try {
            const tipo = await db.query.tipoLancamento.findFirst({
                where: eq(tipoLancamento.codigo, data.tipo),
            });

            if (!tipo)
                throw new Error("Tipo de lancamento inválido");

            const [result] = await db
                .insert(lancamento)
                .values({
                    tipo: data.tipo,
                    categoria: data.categoria,
                    data: data.data,
                    valor: data.valor,
                    observacao: data.observacao
                })
                .returning({ codigo: lancamento.codigo });

            return result;
        } catch (e: any) {
            throw new Error(e?.message ?? "Erro ao criar lancamento");
        }
    }

    async findSemanal() {
        const now = new Date();

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return db
            .select({
                codigo: lancamento.codigo,
                data: sql<string>` strftime('%d/%m/%Y', ${lancamento.data})`.as("data"),
                valor: lancamento.valor,
                observacao: lancamento.observacao,

                codigoCategoria: categoria.codigo,
                descricaoCategoria: categoria.descricao,
                codigoTipoCategoria: tipoCategoria.codigo,
                descricaoTipoCategoria: tipoCategoria.descricao,
                codigoTipoLancamento: tipoLancamento.codigo, 
                descricaoTipoLancamento: tipoLancamento.descricao
            })
            .from(lancamento)
            .innerJoin(categoria, eq(lancamento.categoria, categoria.codigo))
            .innerJoin(tipoCategoria, eq(categoria.tipo, tipoCategoria.codigo))
            .innerJoin(tipoLancamento, eq(lancamento.tipo, tipoLancamento.codigo))
            .where(
                and(
                    gte(lancamento.data, toISO(startOfWeek)),
                    lte(lancamento.data, toISO(endOfWeek))
                )
            )
            .orderBy(lancamento.data);
    };

    async findQuinzenal() {
        const agora = new Date();
      
        const quinzeDiasAtras = new Date();
        quinzeDiasAtras.setDate(agora.getDate() - 15);
        quinzeDiasAtras.setHours(0, 0, 0, 0);
      
        return db
          .select({
            codigo: lancamento.codigo,
            data: sql<string>` strftime('%d/%m/%Y', ${lancamento.data})`.as("data"),
            valor: lancamento.valor,
            observacao: lancamento.observacao,
            
            codigoCategoria: categoria.codigo,
            descricaoCategoria: categoria.descricao,
            codigoTipoCategoria: tipoCategoria.codigo,
            descricaoTipoCategoria: tipoCategoria.descricao,
            codigoTipoLancamento: tipoLancamento.codigo, 
            descricaoTipoLancamento: tipoLancamento.descricao
          })
          .from(lancamento)
          .innerJoin(categoria, eq(lancamento.categoria, categoria.codigo))
          .innerJoin(tipoCategoria, eq(categoria.tipo, tipoCategoria.codigo))
          .innerJoin(tipoLancamento, eq(lancamento.tipo, tipoLancamento.codigo))
          .where(
            and(
              gte(lancamento.data, toISO(quinzeDiasAtras)),
              lte(lancamento.data, toISO(agora))
            )
          )
          .orderBy(lancamento.codigo);
    }
      
    async findMensal(mes: number, ano: number) {
        const startDate = new Date(Date.UTC(ano, mes - 1, 1, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(ano, mes, 0, 23, 59, 59, 999));
        
        return db
            .select({
                codigo: lancamento.codigo,
                data: sql<string>` strftime('%d/%m/%Y', ${lancamento.data})`.as("data"),
                valor: lancamento.valor,
                observacao: lancamento.observacao,
                
                codigoCategoria: categoria.codigo,
                descricaoCategoria: categoria.descricao,
                codigoTipoCategoria: tipoCategoria.codigo,
                descricaoTipoCategoria: tipoCategoria.descricao,
                codigoTipoLancamento: tipoLancamento.codigo, 
                descricaoTipoLancamento: tipoLancamento.descricao
            })
            .from(lancamento)
            .innerJoin(categoria, eq(lancamento.categoria, categoria.codigo))
            .innerJoin(tipoCategoria, eq(categoria.tipo, tipoCategoria.codigo))
            .innerJoin(tipoLancamento, eq(lancamento.tipo, tipoLancamento.codigo))
            .where(
                and(
                    gte(lancamento.data, toISO(startDate)),
                    lte(lancamento.data, toISO(endDate))
                )
            )
            .orderBy(lancamento.data);
    };

    async update(codigo: number, data: Partial<LancamentoDTO>) {
        if (data.tipo) {
            const tipo = await db.query.tipoLancamento.findFirst({
                where: eq(tipoLancamento.codigo, data.tipo),
            });

            if (!tipo)
                throw new Error("Tipo de lancamento inválido");
        }

        try {
            const result = await db
                .update(lancamento)
                .set({
                    ...(data.tipo && { tipo: data.tipo }),
                    ...(data.categoria && { categoria: data.categoria }),
                    ...(data.data && { data: data.data }),
                    ...(data.valor && { valor: data.valor }),
                    ...(data.observacao && { observacao: data.observacao }),
                })
                .where(eq(lancamento.codigo, codigo))
                .returning();

            if (result.length === 0)
                throw new Error("Lancamento não encontrada");

            return result[0];
        } catch (e: any) {
            throw new Error(e?.message ?? "Erro ao Atualizar lancamento");
        }
    }

    async remove(codigo: number) {
        const result = await db
            .delete(lancamento)
            .where(eq(lancamento.codigo, codigo))
            .returning();

        if (result.length === 0)
            throw new Error("Lançamento não encontrado");

        return true;
    }
}

export const lancamentoService = new LancamentoService();
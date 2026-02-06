import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const tipoCategoria = sqliteTable("tipo_categoria", {
  codigo: text("codigo").notNull().primaryKey().unique(), 
  descricao: text("descricao").notNull(),          
});

export const tipoCategoriaRelations = relations(tipoCategoria, ({ many }) => ({
  categorias: many(categoria),
}));

export const tipoLancamento = sqliteTable("tipo_lancamento", {
  codigo: integer("codigo").primaryKey({ autoIncrement: true }),
  descricao: text("descricao").notNull(),
  parcelado: integer("parcelado", { mode: "boolean" }).notNull().default(false),
});

export const tipoLancamentoRelations = relations(tipoLancamento, ({ many }) => ({
  lancamentos: many(lancamento),
}));

export const categoria = sqliteTable("categoria", {
  codigo: integer("codigo").primaryKey({ autoIncrement: true }),
  descricao: text("descricao").notNull(),
  tipo: text("tipo").notNull().references(() => tipoCategoria.codigo, { onDelete: "restrict" }),
});

export const categoriaRelations = relations(categoria, ({ one, many }) => ({
  tipoCategoria: one(tipoCategoria, {
    fields: [categoria.tipo],
    references: [tipoCategoria.codigo],
  }),
  lancamentos: many(lancamento),
}));

export const lancamento = sqliteTable("lancamento", {
  codigo: integer("codigo").primaryKey({ autoIncrement: true }),
  tipo: integer("tipo").notNull().references(() => tipoLancamento.codigo, { onDelete: "restrict" }),
  categoria: integer("categoria").notNull().references(() => categoria.codigo, { onDelete: "restrict"}),
  data: text("data").notNull(),
  valor: real("valor").notNull(),
  observacao: text("observacao")
});

export const lancamentoRelations = relations(lancamento, ({ one }) => ({
  tipoLancamento: one(tipoLancamento, {
    fields: [lancamento.tipo],
    references: [tipoLancamento.codigo],
  }),
  categoria: one(categoria, {
    fields: [lancamento.codigo],
    references: [categoria.codigo]
  })
}));
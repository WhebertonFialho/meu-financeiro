import { useState, useEffect } from "react";
import { useMyLoading } from "@contexts/MyLoadingProvider";
import { lancamentoService } from "@services/lancamento.service";
import type { LancamentoDTO } from "@services/lancamento.service";
import { MyToastErro, MyToastGravarSucesso } from "@utils/MyToast";

export function useLancamento() {
    const { showMyLoading, hideMyLoading } = useMyLoading();

    const [lancamentos, setLancamentos] = useState<any[]>([]);

    async function listarSemanal() {
        try {
            showMyLoading();
            const dados = await lancamentoService.findSemanal();
            setLancamentos(dados);
        } catch (e: any) {
            MyToastErro(e?.message);
        } finally {
            hideMyLoading();
        }
    }

    async function listarQuinzenal() {
        try {
            showMyLoading();
            const dados = await lancamentoService.findQuinzenal();
            setLancamentos(dados);
        } catch (e: any) {
            MyToastErro(e?.message);
        } finally {
            hideMyLoading();
        }
    }

    async function listarMensal(mes: number, ano: number) {
        try {
            showMyLoading();
            const dados = await lancamentoService.findMensal(mes, ano);
            setLancamentos(dados);
        } catch (e: any) {
            MyToastErro(e?.message);            
        } finally {
            hideMyLoading();
        }
    }

    async function salvar(data: LancamentoDTO) {
        try {
            showMyLoading();
            
            await lancamentoService.create(data);
            await listarQuinzenal();
            
            MyToastGravarSucesso();
        } catch (e: any) {
            MyToastErro(e?.message ?? 'Erro ao criar Lançamento.');
        } finally {
            hideMyLoading();
        }
    }

    async function atualizar(id: number, data: Partial<LancamentoDTO>) {
        try {
            showMyLoading();
            await lancamentoService.update(id, data);
        } catch (e: any) {
            MyToastErro(e?.message);
        } finally {
            hideMyLoading();
        }
    }

    async function remover(id: number) {
        try {
            showMyLoading();
            await lancamentoService.remove(id);
        } catch (e: any) {
            MyToastErro(e?.message);
        } finally {
            hideMyLoading();
        }
    }

    useEffect(() => {
        listarSemanal();
    }, []);

    return {
        lancamentos,

        listarSemanal,
        listarQuinzenal,
        listarMensal,

        salvar,
        atualizar,
        remover,
    };
}

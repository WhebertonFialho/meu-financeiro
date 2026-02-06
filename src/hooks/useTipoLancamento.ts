import { useState, useEffect } from "react";
import { useMyLoading } from "@contexts/MyLoadingProvider";
import { TipoLancamentoDTO, tipoLancamentoService } from "@services/tipoLancamento.service";
import { MyToastErro } from "@utils/MyToast";

export function useTipoLancamento() {
    const { showMyLoading, hideMyLoading } = useMyLoading();
    const [ listaTiposLancamento, setTipoLancamentos] = useState<TipoLancamentoDTO[]>([]);
    
    async function listar() {
        try {
            showMyLoading();

            const dados = await tipoLancamentoService.findAll();
            setTipoLancamentos(dados);
        } catch(error : any){
            MyToastErro(error);
        } finally {
            hideMyLoading();
        }
    }

    useEffect(() => {
        listar();
    }, []);

    return { listaTiposLancamento, listar };
}

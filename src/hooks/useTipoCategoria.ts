import { useState, useEffect } from "react";
import { useMyLoading } from "@contexts/MyLoadingProvider";
import { TipoCategoriaDTO, tipoCategoriaService } from "@services/tipoCategoria.service";
import { MyToastErro } from "@utils/MyToast";

export function useTipoCategoria() {
    const { showMyLoading, hideMyLoading } = useMyLoading();
    const [ listaTiposCategoria, setTipoCategorias] = useState<TipoCategoriaDTO[]>([]);
    
    async function listar() {
        try {
            showMyLoading();
            
            const dados = await tipoCategoriaService.findAll();
            setTipoCategorias(dados);
        } catch(error : any){
            MyToastErro(error);
        } finally {
            hideMyLoading();
        }
    }

    useEffect(() => {
        listar();
    }, []);

    return { listaTiposCategoria, listar };
}

import { useState, useEffect } from "react";
import { useMyLoading } from "@contexts/MyLoadingProvider";
import { categoriaService } from "@services/categoria.service";
import { MyToastErro, MyToastGravarSucesso } from "@utils/MyToast";

export function useCategoria() {
    const { showMyLoading, hideMyLoading } = useMyLoading();
    const [categorias, setCategorias] = useState<any[]>([]);
    
    async function listar(search?: string) {
        try {
            showMyLoading();

            const dados = await categoriaService.findAll(search);
            setCategorias(dados);
        } catch(e : any){
            MyToastErro(e?.message);
        } finally {
            hideMyLoading();
        }
    }

    async function salvar(data: any) {
        try {
            showMyLoading();

            await categoriaService.create(data);
            await listar();    

            MyToastGravarSucesso();
        } catch (e: any) {
            MyToastErro(e?.message);
        }
        finally{
            hideMyLoading();
        }
    }

    async function atualizar(id: number, data: any) {
        try {
            showMyLoading();
            
            await categoriaService.update(id, data);
            await listar();    
        } catch (e: any) {
            MyToastErro(e?.message);
        }
        finally {
            hideMyLoading();
        }   
    }

    async function remover(id: number) {
        try {
            showMyLoading();

            await categoriaService.remove(id);
            await listar();
        } catch (e : any) {
            throw new Error(e);
        }
        finally {
            hideMyLoading();
        }
    }

    useEffect(() => {
        listar();
    }, []);

    return { categorias, listar, salvar, atualizar, remover, };
}

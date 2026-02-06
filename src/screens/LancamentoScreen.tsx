import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import { colors } from '@theme/colors';

import MyComboBox from '@components/MyComboBox';
import MyInputDate from '@components/MyInputDate';
import MyInputNumber from '@components/MyInputNumber';
import MyButton from '@components/MyButton';
import MyInput from '@components/MyIntup';

import { useAppNavigation, useAppParams } from '@hooks/useAppNavigation';
import { useTipoLancamento } from '@hooks/useTipoLancamento';
import { useLancamento } from '@hooks/useLancamento';
import { useCategoria } from '@hooks/useCategoria';
import { MyToastInformacao, MyToastSucesso, MyToastErro } from '@utils/MyToast';
import { BottomTabParamList } from '@routes/types';

export default function LancamentosScreen() {
    const nav = useAppNavigation();
    const params = useAppParams<BottomTabParamList, 'Adicionar'>();
    const lancamento = params?.lancamento;
    const isEdit = !!lancamento;

    const { listaTiposLancamento } = useTipoLancamento();
    const { categorias, listar: listarCategorias } = useCategoria();
    const { salvar, atualizar } = useLancamento();

    const [tipo, setTipo] = useState<string>('');
    const [categoria, setCategoria] = useState<string>('');
    const [data, setData] = useState<Date | null>(new Date());
    const [valor, setValor] = useState<number | null>(null);
    const [numParcela, setNumParcela] = useState<number | null>(1);
    const [observacao, setObservacao] = useState<string>('');
    
    const limparDados = useCallback(() => {
        setTipo('');
        setCategoria('');
        setData(new Date());
        setValor(null);
        setNumParcela(1);
        setObservacao('');
    }, []);

    const gerarParcelas = (valorTotal: number, qtdParcelas: number) => {
        const totalCentavos = Math.round(valorTotal * 100);
        const valorBaseCentavos = Math.floor(totalCentavos / qtdParcelas);
        let restoCentavos = totalCentavos % qtdParcelas;

        const parcelas = Array(qtdParcelas).fill(valorBaseCentavos);
        for (let i = 0; i < restoCentavos; i++) {
            parcelas[i] += 1;
        }
        return parcelas.map(p => p / 100);
    };

    const handleSubmit = async () => {
        if (!tipo || !categoria || !data || !valor) {
            MyToastInformacao("Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            if (isEdit && lancamento?.codigo) {
    
                await atualizar(lancamento.codigo, {
                    tipo: parseInt(tipo),
                    categoria: parseInt(categoria),
                    data: data.toISOString(),
                    valor: valor,
                    observacao: observacao
                });
                MyToastSucesso("Lançamento atualizado.");
            } else {
                const qtdParcelas = numParcela ?? 1;
                const valoresDasParcelas = gerarParcelas(valor, qtdParcelas);
                
                const promessas = valoresDasParcelas.map((valorParcela, i) => {
                    const dataParcela = new Date(data);
                    dataParcela.setMonth(dataParcela.getMonth() + i);
                    const obsFinal = qtdParcelas > 1 ? `${observacao || ''} (${i + 1}/${qtdParcelas})`.trim() : observacao;

                    return salvar({
                        tipo: parseInt(tipo),
                        categoria: parseInt(categoria),
                        data: dataParcela.toISOString(),
                        valor: valorParcela,
                        observacao: obsFinal
                    });
                });

                await Promise.all(promessas);
                MyToastSucesso("Lançamento criado.");
            }

            limparDados();
            nav.goBack();
        } catch (e: any) {
            MyToastErro(e.message ?? "Erro ao processar.");
        } 
    };

    useFocusEffect(
        useCallback(() => {
            const carregar = async () => {
                await listarCategorias();
            }

            carregar()
            if (!isEdit) 
                limparDados();

            return () => {
                nav.setParams({ lancamento: undefined });
            };
        }, [])
    );

    useEffect(() => {
        if (isEdit && lancamento) {
            let dataObjeto = new Date();
            if (lancamento.data.includes('/')) {
                const [d, m, a] = lancamento.data.split('/');
                dataObjeto = new Date(Number(a), Number(m) - 1, Number(d));
            } else {
                dataObjeto = new Date(lancamento.data);
            }

            setTipo(String(lancamento.tipo));
            setCategoria(String(lancamento.categoria));
            setData(dataObjeto);
            setValor(lancamento.valor);
            setObservacao(lancamento.observacao ?? '');
        }
    }, [lancamento, isEdit, categorias]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
            <MyComboBox
                    clearable
                    label={'Tipo Lançamento'}
                    value={tipo}
                    onChange={setTipo}
                    options={
                        listaTiposLancamento.map(item => ({
                            value: item.codigo,
                            label: item.descricao
                        }))
                    }
                />

                <MyComboBox
                    clearable
                    label={'Categoria'}
                    value={categoria}
                    onChange={setCategoria}
                    options={
                        categorias.map(item => ({
                            value: item.codigo,
                            label: item.descricao
                        }))
                    }
                />

                <MyInputDate
                    label='Data Lançamento'
                    value={data}
                    setValue={setData}
                />

                <MyInputNumber
                    label='Valor Lançamento'
                    value={valor}
                    setValue={setValor}
                />

                {(listaTiposLancamento.find(x => x.codigo == parseInt(tipo))?.parcelado ?? false) == false ? null :
                    <MyInputNumber
                        integer
                        label='Num. Parcela'
                        value={numParcela}
                        setValue={setNumParcela}
                    />
                }

                <MyInput
                    label={'Observação'}
                    value={observacao}
                    setValue={setObservacao}
                />
            </View>

            <View style={styles.buttonFooter}>
                <MyButton
                    color='green'
                    title={(isEdit ? 'Atualizar' : 'Salvar')}
                    onPress={handleSubmit}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: 
        colors.backgroundColorDark 
    },
    content: { 
        alignItems: "center",
        paddingTop: 45, 
        width: "100%", 
        paddingHorizontal: 10 
    },
    buttonFooter: { 
        position: "absolute", 
        bottom: 40, 
        width: "90%", 
        alignSelf: "center" 
    },
});
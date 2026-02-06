import React, { useCallback, useState, useEffect, Fragment } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, StyleSheet, Text, ScrollView, Pressable } from "react-native";
import { colors } from "@theme/colors";

import { useLancamento } from "@hooks/useLancamento";
import { parseNumber } from "@utils/index";
import MyTabFilter, { FilterType } from "@components/MyTabFilter";
import { useAppNavigation } from "@hooks/useAppNavigation";
import { LancamentoDTO } from "@services/lancamento.service";

export default function TransacaoScreen() {
    const nav = useAppNavigation();
    const { lancamentos, listarSemanal, listarQuinzenal, listarMensal } = useLancamento();

    const [ filtro, setFiltro ] = useState<FilterType>('Semanal');
    const [ mes, setMes ] = useState<number>(new Date().getMonth()+1)
    const [ ano, setAno ] = useState<number>(new Date().getFullYear());

    const handleOnLongClick = (e : any) => {
        const lancamento : LancamentoDTO = {
            tipo: e?.codigoTipoLancamento,
            data: e?.data,
            categoria: e?.codigoCategoria,
            valor: e?.valor,
            codigo: e?.codigo,
            observacao: e?.observacao
        } 

        nav.goToLancamento(lancamento)
    }

    useEffect(() => {
        const carregar = async () => {
            switch (filtro) {
              case 'Semanal':
                await listarSemanal();
                break;
        
              case 'Quinzenal':
                await listarQuinzenal();
                break;
        
              case 'Mensal':
                await listarMensal(mes, ano);
                break;
        
              default:
                break;
            }
        };
        
        carregar();
    }, [filtro, mes, ano])

    useFocusEffect(
        useCallback(() => {
            const carregar = async () => {
                setFiltro('Semanal');
                await listarSemanal();
            };

            carregar();
        }, [])
    );

    return (
        <Fragment>
            <MyTabFilter 
                filter={filtro}
                setFilter={setFiltro}
                setMonth={setMes}
                setYear={setAno}        
            />
            <View style={styles.container}>
                
                <ScrollView>
                    {lancamentos.map((lancamento) => {
                        const isEntrada = lancamento.codigoTipoCategoria === "E";

                        return (
                            <Pressable
                                key={lancamento.codigo}
                                style={[ styles.card, { borderLeftColor: isEntrada ? "#2ecc71" : "#e74c3c" }, ]}
                                onLongPress={() => handleOnLongClick(lancamento)}
                            >
                                <View>
                                    <Text style={styles.categoria}>{lancamento.descricaoCategoria}</Text>
                                    <Text style={styles.data}>{lancamento.data}</Text>
                                    <Text style={styles.obs}>{lancamento.observacao}</Text>
                                </View>

                                <Text style={[ styles.valor, { color: isEntrada ? "#2ecc71" : "#e74c3c" }, ]} >
                                    {isEntrada ? "+" : "-"} R$ {parseNumber(lancamento.valor.toFixed(2))}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColorDark,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 30,
    },
    text: {
        color: colors.textColor
    },
    card: {
        height: 85,
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 14,
        marginHorizontal: 20,
        marginVertical: 5,
        backgroundColor: colors.backgroundColorLight,
        borderRadius: 5,
        borderLeftWidth: 5,
        elevation: 2,
    },
    categoria: {
        fontSize: 16,
        paddingBottom: 15,
        fontWeight: "600",
        color: "#FFF",
    },
    data: {
        fontSize: 12,
        color: colors.textColor,
    },
    obs: {
        fontSize: 10,
        color: colors.textColor,
        paddingTop: 5
    },
    valor: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
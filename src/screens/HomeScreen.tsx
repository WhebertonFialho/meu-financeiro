import React, { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@theme/colors';
import { useLancamento } from "@hooks/useLancamento";
import MyTabFilter, { FilterType } from '@components/MyTabFilter';
import { PieChart } from "react-native-chart-kit";
import { gerarCores, parseNumber } from '@utils/index';

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
    const { lancamentos, listarSemanal, listarQuinzenal, listarMensal } = useLancamento();

    const [filtro, setFiltro] = useState<FilterType>('Semanal');
    const [mes, setMes] = useState<number>(new Date().getMonth()+1)
    const [ano, setAno] = useState<number>(new Date().getFullYear());

    const [abaFluxo, setAbaFluxo] = useState<'receita' | 'despesa'>('despesa');

    const resumo = useMemo(() => {
        const receitas = lancamentos.filter(x => x.codigoTipoCategoria === 'E').reduce((acc, curr) => acc + Number(curr.valor), 0);
        const despesas = lancamentos.filter(x => x.codigoTipoCategoria === 'S').reduce((acc, curr) => acc + Number(curr.valor), 0);
        return { receitas, despesas, saldo: receitas - despesas };
    }, [lancamentos]);

    const dadosGrafico = useMemo(() => {
        const filtrados = lancamentos.filter(l =>
            abaFluxo === 'receita' ? l.codigoTipoCategoria === 'E' : l.codigoTipoCategoria === 'S'
        );
    
        const agrupado = filtrados.reduce((acc, curr) => {
            const cat = curr.descricaoCategoria || "Outros";
            acc[cat] = (acc[cat] || 0) + Math.abs(Number(curr.valor));
            return acc;
        }, {});
    
        const keys = Object.keys(agrupado);
        const cores = gerarCores(keys.length);
    
        const totalFluxo = Object.values(agrupado).reduce((acc: number, val: any) => acc + val, 0);
    
        return keys.map((key, i) => {
            const valorCategoria = agrupado[key];
            const porcentagem = totalFluxo > 0 ? (valorCategoria / totalFluxo) * 100 : 0;
    
            return {
                name: key,
                population: valorCategoria,
                percentage: porcentagem.toFixed(1),
                color: cores[i] || "#333",
                legendFontColor: "#AAA",
                legendFontSize: 12
            };
        });
    }, [lancamentos, abaFluxo, mes, ano]);

    useEffect(() => {
        const carregar = async () => {
            switch (filtro) {
                case 'Semanal': await listarSemanal(); break;
                case 'Quinzenal': await listarQuinzenal(); break;
                case 'Mensal': await listarMensal(mes, ano); break;
            }
        };
        carregar();
    }, [filtro, mes, ano]);

    useFocusEffect(
        useCallback(() => {
            const carregar = async () => {
                setFiltro('Semanal');
                await listarSemanal()
            }

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
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.row}>
                    <View style={[styles.card, { borderLeftColor: '#2ecc71' }]}>
                        <Text style={styles.cardLabel}>Entradas</Text>
                        <Text style={styles.cardValue}>R$ {parseNumber(resumo.receitas.toFixed(2))}</Text>
                    </View>
                    <View style={[styles.card, { borderLeftColor: '#e74c3c' }]}>
                        <Text style={styles.cardLabel}>Saídas</Text>
                        <Text style={styles.cardValue}>R$ {parseNumber(resumo.despesas.toFixed(2))}</Text>
                    </View>
                </View>

                <View style={styles.selector}>
                    <TouchableOpacity
                        style={[styles.btn, abaFluxo === 'receita' && styles.btnActive]}
                        onPress={() => setAbaFluxo('receita')}
                    >
                        <Text style={styles.btnText}>Receitas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btn, abaFluxo === 'despesa' && styles.btnActive]}
                        onPress={() => setAbaFluxo('despesa')}
                    >
                        <Text style={styles.btnText}>Despesas</Text>
                    </TouchableOpacity>
                </View>

                {dadosGrafico.length > 0 ? (
                    <Fragment>
                        <View style={styles.chartContainer}>
                            <PieChart
                                data={dadosGrafico}
                                width={screenWidth}
                                height={300}
                                chartConfig={{ color: () => `#FFF` }}
                                accessor={"population"}
                                backgroundColor={"transparent"}
                                paddingLeft={(screenWidth / 4).toString()}
                                center={[0, 0]}
                                hasLegend={false}
                                absolute
                            />
                            <View style={styles.donutHole} />
                        </View>
                        <View style={styles.legendGrid}>
                            {dadosGrafico.map((item, index) => (
                                <View key={index} style={styles.legendItem}>
                                    <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={styles.legendName} numberOfLines={1}>
                                                {item.name}
                                            </Text>
                                            <Text style={styles.legendPercentage}>{item.percentage}%</Text>
                                        </View>
                                        <Text style={styles.legendValue}>
                                            R$ {parseNumber(item.population.toFixed(2))}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </Fragment>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>📊</Text>
                        <Text style={styles.emptyText}>Sem lançamentos para este filtro</Text>
                        <Text style={styles.emptySubText}>Tente mudar o período ou adicionar um novo registro.</Text>
                    </View>
                )}
            </ScrollView>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColorDark,
        padding: 15
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    card: {
        backgroundColor: '#1E1E1E',
        width: '48%',
        padding: 15,
        borderRadius: 8,
        borderLeftWidth: 4
    },
    cardLabel: {
        color: '#888',
        fontSize: 12
    },
    cardValue: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5
    },
    selector: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        borderRadius: 25,
        marginBottom: 20,
        padding: 5
    },
    btn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 20
    },
    btnActive: {
        backgroundColor: '#333'
    },
    btnText: {
        color: '#FFF',
        fontWeight: '600'
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    donutHole: {
        position: 'absolute',
        width: 145,
        height: 145,
        backgroundColor: colors.backgroundColorDark,
        borderRadius: 85,
    },
    legendGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        width: '48%',
        backgroundColor: '#1E1E1E',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
    },
    legendPercentage: {
        color: '#666',
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 5,
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    legendName: {
        color: '#AAA',
        fontSize: 12,
    },
    legendValue: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        paddingHorizontal: 40
    },
    emptyEmoji: {
        fontSize: 50,
        marginBottom: 10,
        opacity: 0.5
    },
    emptyText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    emptySubText: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8
    },
});
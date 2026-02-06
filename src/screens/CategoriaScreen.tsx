import React, { Fragment, useCallback, useState } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAppNavigation } from '@hooks/useAppNavigation';
import { colors } from '@theme/colors';
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from 'react-native';

import { useCategoria } from '@hooks/useCategoria';

import MyButtonAdd from '@components/MyButtonAdd';

const { height } = Dimensions.get('window');

export default function CategoriaScreen() {
    const nav = useAppNavigation();
    const { categorias, listar } = useCategoria();

    useFocusEffect(
        useCallback(() => {
            const carregar = async () => {
                await listar();
            }
            
            carregar();
        }, [])
    );

    return (
        <Fragment>
            <View style={styles.container}>
                <View style={styles.lista}>
                    <ScrollView style={{ flex: 1 }}>
                        {categorias.map((categoria, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[ styles.card, { borderLeftColor: categoria.tipo === 'E' ? "#2ecc71" : "#e74c3c" } ]}
                                onPress={() => nav.goToCategoriaForm(categoria)}
                            >
                                <View style={styles.textContainer}>
                                    <Text style={styles.descricaoItem}>{categoria.descricao}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.grayColor} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
            <MyButtonAdd onPress={() => nav.goToCategoriaForm()} />
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColorDark,
    },
    lista: {
        paddingTop: 25,
        padding: 5,
        height: height * 0.77
    },
    text: {
        color: colors.textColor
    },
    card: {
        height: 65,
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
    textContainer: {
        flex: 1,
    },
    descricaoItem: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textColor,
    }
});
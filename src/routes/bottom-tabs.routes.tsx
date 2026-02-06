import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { colors } from '@theme/colors';
import { BottomTabParamList } from './types';
import HomeScreen from '@screens/HomeScreen';
import TransacaoScreen from '@screens/TransacaoScreen';
import LancamentosScreen from '@screens/LancamentoScreen';
import UtilsScreens from '@screens/UtilsScreens';
import CategoriaScreen from '@screens/CategoriaScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: colors.greenColor,
                tabBarInactiveTintColor: colors.grayColor,
                tabBarIcon: ({ color, focused }) => {
                    const icons: Record<string, any> = {
                        Principal: focused ? 'home' : 'home-outline',
                        Transações: focused ? 'swap-horizontal' : 'swap-horizontal-outline',
                        Categoria: focused ? 'file-tray-full' : 'file-tray-full-outline',
                        Mais: focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline',
                    };

                    return (
                        <Ionicons name={icons[route.name]} size={22} color={color} />
                    );
                },
            })}
        >
            <Tab.Screen name="Principal" component={HomeScreen} />
            <Tab.Screen name="Transações" component={TransacaoScreen} />
            
            <Tab.Screen
                name="Adicionar"
                component={LancamentosScreen}
                options={{
                    tabBarLabel: '',
                    tabBarButton: (props) => (
                        <TouchableWithoutFeedback onPress={props.onPress}>
                            <Animatable.View
                                animation="bounceIn"
                                duration={600}
                                style={styles.addButton}
                            >
                                <Ionicons name="add" size={34} color="#fff" />
                            </Animatable.View>
                        </TouchableWithoutFeedback>
                    ),
                }}
            />

            <Tab.Screen name="Categoria" component={CategoriaScreen} />
            <Tab.Screen name="Mais" component={UtilsScreens} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.backgroundColorLight,
        borderTopColor: colors.backgroundColorDark,
        height: 65,
        paddingBottom: 10,
    },
    addButton: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: colors.greenColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.greenColor,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 7,
    },
    headerContainer: {
        borderTopWidth: 1,
        borderTopColor: colors.backgroundColorLight,
        backgroundColor: colors.backgroundColorDark,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
    },
    headerTitle: {
        color: colors.textColor,
        fontWeight: 'bold',
        fontSize: 18,
    },
});
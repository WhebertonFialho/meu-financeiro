import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import Toast from 'react-native-toast-message';

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { MyDatePickerProvider } from '@contexts/MyDatePickerProvider';
import { MyLoadingProvider } from '@contexts/MyLoadingProvider';
import { MyMessageProvider } from '@contexts/MyMessageProvider';

import MyLoading from '@components/MyLoading';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@database/migrations/migrations';
import { seedTipoCategoria } from '@database/seeds/tipoCategoria.seed';
import { db } from '@database/index';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackNavigator } from '@routes/root.stack';
import { seedTipoPagamento } from '@database/seeds/tipoPagamento.seed';

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success) {
      seedTipoCategoria();
      seedTipoPagamento();
    }
  }, [success]);

  if (error) {
    return (
      <View style={styles.containerErro}>
        <Text style={styles.title}>Erro ao carregar banco de dados</Text>
        <View style={styles.errorWrapper}>
          <Text style={styles.errorMessage}>{error.message}</Text>
        </View>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Atualizando banco de dados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <MyDatePickerProvider>
          <MyLoadingProvider>
            <MyMessageProvider>
              <StatusBar />
              <NavigationContainer>
                <RootStackNavigator />
              </NavigationContainer>
            </MyMessageProvider>
            <MyLoading />
          </MyLoadingProvider>
        </MyDatePickerProvider>
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerErro: {
    flex: 1,
    backgroundColor: '#D32F2F', 
    alignItems: 'center',
    paddingTop: '20%', 
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorWrapper: {
    width: '90%', 
    flex: 0.6,    
    justifyContent: 'center',
  },
  errorMessage: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import MyScreenHeader from '@components/MyScreenHeader';
import { colors } from '@theme/colors';
import { useAppNavigation } from '@hooks/useAppNavigation';

export default function BancoDadosScreen() {
    const nav = useAppNavigation();
    const DB_NAME = "app.db"; 

    const backupDatabase = async () => {
        try {
            const dbPath = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;
            const backupPath = `${FileSystem.cacheDirectory}${DB_NAME}`;

            const fileInfo = await FileSystem.getInfoAsync(dbPath);
            
            if (!fileInfo.exists) {
                Alert.alert("Erro", "O banco de dados ainda não foi criado. Insira algum dado no app primeiro.");
                return;
            }

            await FileSystem.copyAsync({
                from: dbPath,
                to: backupPath
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(backupPath, {
                    dialogTitle: 'Exportar Backup',
                    mimeType: 'application/octet-stream',
                    UTI: 'public.database'
                });
            }
        } catch (error) {
            console.error("Erro no backup:", error);
            Alert.alert("Erro", "Falha ao gerar backup.");
        }
    };

    const restaurarDatabase = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const selectedFile = result.assets[0];
            const sqliteDir = `${FileSystem.documentDirectory}SQLite/`;
            const dbInternalPath = `${sqliteDir}${DB_NAME}`;
            const dirInfo = await FileSystem.getInfoAsync(sqliteDir);

            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
            }

            await FileSystem.copyAsync({
                from: selectedFile.uri,
                to: dbInternalPath
            });

            Alert.alert("Sucesso", "Backup restaurado! Feche e abra o app para carregar os novos dados.");
        } catch (error) {
            console.error("Erro no restore:", error);
            Alert.alert("Erro", "Falha ao restaurar banco de dados.");
        }
    };

    return (
        <View style={styles.container}>
            <MyScreenHeader 
                title='Banco de Dados'
                showBackButton
                handleOnPress={() => nav.goBack()}
            />
            
            <View style={styles.content}>
                <TouchableOpacity 
                    style={[styles.button, { borderLeftColor: '#2ecc71' }]} 
                    onPress={backupDatabase}
                >
                    <Text style={styles.buttonText}>Fazer Backup (Exportar)</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, { borderLeftColor: '#212dd6ff' }]} 
                    onPress={restaurarDatabase}
                >
                    <Text style={styles.buttonText}>Restaurar Backup (Importar)</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColorDark
    },
    content: {
        padding: 20,
        gap: 10
    },
    button: {
        height: 80,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        backgroundColor: colors.backgroundColorLight,
        borderRadius: 8,
        borderLeftWidth: 6,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    buttonText: {
        color: colors.textColor || '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    }
});
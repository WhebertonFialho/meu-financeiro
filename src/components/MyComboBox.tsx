import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import Modal from "react-native-modal";
import { colors } from "@theme/colors";

type Option = {
    value: any;
    label: string;
};

type MyComboBoxProps = {
    options: Option[];
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
    label?: string;
    clearable?: boolean;
};

const MyComboBox: React.FC<MyComboBoxProps> = ({ options, value, onChange, placeholder, label, clearable }) => {

    const [ visible, setVisible ] = useState(false);
    const [ selectedLabel, setSelectedLabel ] = useState<string>('');

    function handleSelect(item: Option) {
        onChange(item.value);
        setVisible(false);
    }

    function handleClear() {
        onChange(null);
    }

    useEffect(() => {
        setSelectedLabel(options.find((o) => o.value == value)?.label || placeholder || "Selecione...");
    }, [value, options])

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.combo}>
                <TouchableOpacity
                    style={styles.comboPressArea}
                    onPress={() => setVisible(true)}
                    activeOpacity={0.8}
                >
                    <Text style={{ fontSize: 14, color: options.find((o) => o.value == value)?.label ? '#CCC' : '#999' }}>{selectedLabel}</Text>
                </TouchableOpacity>

                {(clearable && value) && (
                    <TouchableOpacity style={styles.clearInside} onPress={handleClear}>
                        <Text style={styles.clearText}>×</Text>
                    </TouchableOpacity>
                )}
            </View>
            <Modal
                isVisible={visible}
                animationIn="fadeIn"
                animationOut="fadeOut"
                backdropOpacity={0.88}
                onBackdropPress={() => setVisible(false)}
                style={styles.fullscreenModal}
            >
                <View style={styles.modalBox}>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => String(item.value)}
                        showsVerticalScrollIndicator={false}
                        style={{ maxHeight: "100%" }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={styles.optionText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View style={styles.footerFixed}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setVisible(false)}
                    >
                        <Text style={styles.cancelText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "90%",
    },
    label: {
        color: colors.grayColor,
        fontSize: 16,
        padding: 3
    },
    combo: {
        height: 40,
        width: "100%",
        backgroundColor: colors.backgroundColorDark,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        justifyContent: "center",
    },
    comboPressArea: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    clearInside: {
        position: "absolute",
        right: 6,
        top: 3,
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: "center",
        alignItems: "center",
    },
    clearText: {
        color: "#fff",
        fontSize: 22,
        marginTop: -2
    },
    fullscreenModal: {
        margin: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        backgroundColor: colors.backgroundColorDark,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ffffff33",
        width: "90%",
        paddingVertical: 10,
        paddingHorizontal: 8,
        maxHeight: "70%"
    },
    option: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff33",
    },
    optionText: {
        color: colors.textColor,
        fontSize: 18,
    },
    footerFixed: {
        position: "absolute",
        bottom: 20,
        width: "90%",
    },
    cancelButton: {
        backgroundColor: colors.backgroundColorDark,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 18,
        borderRadius: 8,
    },
    cancelText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
    },
});

export default MyComboBox;


import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors } from "@theme/colors";

type MyButtonAddProps = {
    onPress: () => void;
}

const MyButtonAdd : React.FC<MyButtonAddProps> = (props) => { 
    return(
        <TouchableOpacity 
            style={ styles.button } 
            onPress={ props.onPress }
        >
            <Text style={ styles.buttonText }>+</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        right: 20,
        bottom: 8,
        backgroundColor: colors.backgroundColorDark,
        borderWidth: 1,
        borderColor: colors.grayColor,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, 
        shadowColor: '#000', 
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    buttonText: {
        color: colors.grayColor,
        fontSize: 30,
        lineHeight: 30,
    }
})

export default MyButtonAdd;
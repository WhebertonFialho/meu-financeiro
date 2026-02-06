import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Modal, Platform, StyleSheet, BackHandler, Keyboard, Pressable, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from '@theme/colors';

interface MyInputProps extends TextInputProps {
  label: string;
  value?: string;
  setValue: (value: string) => void;
}

const MyInput: React.FC<MyInputProps> = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [texto, setTexto] = useState(props.value ?? '');
  const inputRef = useRef<TextInput>(null);

  const onModalShow = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, Platform.OS === 'android' ? 150 : 100);
  };

  const handleModalClose = () => {
    inputRef.current?.blur();
    Keyboard.dismiss();
    setTimeout(() => {
      closeModal();
    }, 100);
  };

  const handleOnChange = (value: string) => {
    setTexto(value);
    props.setValue(value)
  }

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (props.value !== undefined)
      setTexto(props.value);
  }, [props.value]);

  useEffect(() => {
    if (!modalVisible)
      return;

    setTimeout(() => {
      inputRef.current?.focus();
    }, Platform.OS === 'android' ? 100 : 20);

    let backHandler: any;

    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      closeModal();
    });

    backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      inputRef.current?.blur();
      Keyboard.dismiss();
      setTimeout(() => {
        closeModal();
      }, 50);

      return true;
    });

    return () => {
      keyboardDidHide?.remove();
      backHandler?.remove();
    };
  }, [modalVisible]);

  return (
    <View style={{ width: '90%' }}>
      <Text style={styles.label}>{props.label}</Text>
      <Pressable
        style={styles.container}
        onPress={openModal}
      >
        <Text style={{ color: texto ? '#CCC' : '#999' }}>
          {texto || 'Digite aqui...'}
        </Text>
      </Pressable>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={handleModalClose}
        onShow={onModalShow}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.touchClose}
              activeOpacity={1}
              onPress={handleModalClose}
            />

            <SafeAreaView style={styles.safeArea}>
              <TextInput
                {...props}
                ref={inputRef}
                style={styles.input}
                value={texto}
                onChangeText={handleOnChange}
                placeholder={'Digite aqui...'}
              />
            </SafeAreaView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  touchClose: {
    flex: 1,
    width: '100%',
  },
  safeArea: {
    backgroundColor: '#E5E5E5',
    paddingVertical: Platform.OS === 'ios' ? 0 : 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    fontSize: 15,
  },
  label: {
    color: colors.textColor,
    fontSize: 16,
    padding: 3
  }
});

export default MyInput;
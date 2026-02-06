import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Platform, StyleSheet, BackHandler, Keyboard, Pressable, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@theme/colors';

interface MyInputNumberProps {
  label: string;
  value?: number | null;
  setValue: (value: number | null) => void;
  integer?: boolean;
}

const MyInputNumber: React.FC<MyInputNumberProps> = ({ label, value, setValue, integer }) => {
  const inputRef = useRef<TextInput>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [digits, setDigits] = useState('');

  const onModalShow = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, Platform.OS === 'android' ? 150 : 100);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const formatDisplay = (digits: string): string => {
    if (!digits)
      return integer ? '0' : '0,00';

    if (integer)
      return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const number = parseInt(digits, 10) / 100;
    return number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleChange = (text: string) => {
    const onlyDigits = text.replace(/\D/g, '') ?? 0;
    setDigits(onlyDigits);

    const safeDigits = onlyDigits === '' ? '0' : onlyDigits;

    const numericValue = integer ? parseInt(safeDigits, 10) : parseInt(safeDigits, 10) / 100;
    setValue(numericValue);
  };

  const valorFormatado = formatDisplay(digits);


  useEffect(() => {
    if (value !== null && value !== undefined) {
      const finalDigits = integer ? Math.round(value) : Math.round(value * 100);
      setDigits(String(finalDigits));
    } else {
      setDigits('');
    }
  }, [value, integer]);

  useEffect(() => {
    if (!modalVisible)
      return;

    setTimeout(() => {
      inputRef.current?.focus();
    }, Platform.OS === 'android' ? 150 : 20);

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
      <Text style={styles.label}>{label}</Text>

      <Pressable
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: valorFormatado != (integer ? '0' : '0,00') ? '#CCC' : '#999' }}>{valorFormatado}</Text>
      </Pressable>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onShow={onModalShow}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.touchClose}
              onPress={() => setModalVisible(false)}

            />

            <SafeAreaView style={styles.safeArea}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={valorFormatado}
                keyboardType="numeric"
                onChangeText={handleChange}
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
    fontSize: 16,
  },
  label: {
    color: colors.textColor,
    fontSize: 16,
    padding: 3,
  },
});

export default MyInputNumber;

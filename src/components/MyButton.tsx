import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

type MyButtonProps = TouchableOpacityProps & {
  title: string;
  color?: 'green' | 'red';
};

const MyButton: React.FC<MyButtonProps> = ({ title, color = 'green', ...rest }) => {
  return (
    <TouchableOpacity
      style={[styles.button, color === 'green' ? styles.green : styles.red]}
      activeOpacity={0.8}
      {...rest}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  green: {
    backgroundColor: '#28a745',
  },
  red: {
    backgroundColor: '#dc3545',
  },
});

export default MyButton;

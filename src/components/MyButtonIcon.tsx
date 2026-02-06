import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

type MyButtonIconProps = TouchableOpacityProps & {
  iconName: keyof typeof Ionicons.hasGlyph | string;
  color: string;
  size?: number;  
  backgroundColor?: string; 
  style?: StyleProp<ViewStyle>;
};

const MyButtonIcon: React.FC<MyButtonIconProps> = ({ iconName, color, size = 24, backgroundColor = '#e74c3c', style, ...rest }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        { backgroundColor }, 
        style
      ]}
      activeOpacity={0.7}
      {...rest}
    >
      <Ionicons name={iconName as any} size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default MyButtonIcon;
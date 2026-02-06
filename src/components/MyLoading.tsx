import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { useMyLoading } from '@contexts/MyLoadingProvider';

const MyLoading: React.FC = () => {
  const { isLoading } = useMyLoading();

  return (
    <Modal 
        visible={ isLoading } 
        transparent={ true } 
        animationType="fade"
    >
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7d7a7a" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
});

export default MyLoading;
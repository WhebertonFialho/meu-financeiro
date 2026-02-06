import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import { Dimensions } from 'react-native';
const {  height } = Dimensions.get('window');

interface MyMessageButton {
  text: string;
  onPress?: () => void;
}

interface MyMessageContextData {
  showMyMessage: (title : string, message: string, buttons?: MyMessageButton[]) => void;
}

const MyMessageContext = createContext<MyMessageContextData>({ showMyMessage: () => {} });

export const useMyMessage = () => {
  return useContext(MyMessageContext);
};

export const MyMessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ title, setTitle ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ buttons, setButtons ] = useState<MyMessageButton[]>([]);

  const showMyMessage = (title : string, msg: string, btns: MyMessageButton[] = [{ text: 'Close', onPress: () => setModalVisible(false) }]) => {
    setTitle(title);
    setMessage(msg);
    setButtons(btns);
    setModalVisible(true);
  };

  return (
    <MyMessageContext.Provider value={{ showMyMessage }}>
      {children}
      <Modal
        animationType="slide"
        transparent={ true}
        visible={ modalVisible }
        onRequestClose={() => setModalVisible(false)}
      > 
        <View style={ styles.modalView }>
          <View style={ styles.modalTitle }>
            <Text style={ styles.modalTitleText }>{ title }</Text>
          </View>
          <Text style={ styles.modalText }>{ message }</Text>
          <View style={ styles.buttonContainer }>
            { buttons.map((button, index) => (
              <TouchableOpacity
                key={ index }
                style={ styles.button }
                onPress={() => {
                  if (button.onPress) 
                    button.onPress();
                  
                  setModalVisible(false);
                }}
              >
                <Text style={ styles.buttonText }>{ button.text }</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </MyMessageContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    marginTop: height/3,
    backgroundColor: '#29292E',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalTitle: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
  },
  modalTitleText: {
    color: '#FFF'
  },
  modalText: {
    margin: 15,
    padding: 20,
    color: '#FFF',
    textAlign: 'center',
  },
  button: {
    flex: 1,
    padding: 20,
    borderRadius: 2,
    alignItems: 'center',
    marginTop: 15,
    margin: 1,
  },
  buttonText: {
    color: '#C9C9C9',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom:0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
});
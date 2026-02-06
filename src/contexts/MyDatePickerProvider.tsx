import React, { createContext, useContext, useState, ReactNode } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import DateTimePicker, { DateType, useDefaultStyles } from "react-native-ui-datepicker";
import { colors } from '../theme/colors';

interface MyDatePickerContextProps {
  openMyDatePicker: (initialDate?: Date) => Promise<Date>;
}

const MyDatePickerContext = createContext<MyDatePickerContextProps | undefined>(undefined);

export const useMyDatePicker = () => {
  const context = useContext(MyDatePickerContext);
  if (!context) throw new Error("useMyDatePicker deve ser usado dentro de MyDatePickerProvider");
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const MyDatePickerProvider: React.FC<ProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [resolver, setResolver] = useState<((date: Date) => void) | null>(null);
  const defaultStyles = useDefaultStyles();

  const customStyles = {
    ...defaultStyles,
    selected: {
      backgroundColor: "#049404",
      borderRadius: 25
    },
    selected_label: {
      color: "#ffffff" 
    },
    selected_month_label: { 
      ...defaultStyles.selected_month_label, 
      color: colors.textColor, 
    },
    button_prev: {
      ...defaultStyles.button_prev,
    },
    button_prev_image:{
      ...defaultStyles.button_prev_image,
      tintColor: colors.grayColor
    },
    button_next: {
      ...defaultStyles.button_next,
    },
    button_next_image:{
      ...defaultStyles.button_next_image,
      tintColor: colors.grayColor
    },
    selected_year: {
      backgroundColor: "#ff5733"
    },
    selected_year_label: {
      color: "#ffffff"
    },
    today: {
      backgroundColor: colors.backgroundColorDark,
      borderWidth: 1,
      borderColor: '#0d0db5',
      boderRadius: 25
    },
    today_label: { 
      ...defaultStyles.today_label, 
      color: colors.textColor
    },
    day_label: { 
      ...defaultStyles.day_label, 
      color: colors.textColor 
    },
    month_label: { 
      ...defaultStyles.month_label, 
      color: colors.textColor 
    },
    month_selector_label: {
      ...defaultStyles.month_label, 
      color: colors.textColor,
      fontSize: 16,
      fontWeight: 'bold'
    },
    year_label: { 
      ...defaultStyles.year_label, 
      color: colors.textColor 
    },
    year_selector_label: {
      ...defaultStyles.year_selector_label,
      color: colors.textColor
    },
    weekday_label: { 
      ...defaultStyles.weekday_label, 
      color: colors.textColor 
    },
  };

  const openMyDatePicker = (initialDate?: Date): Promise<Date> => {
    setTempDate(initialDate || new Date());
    setVisible(true);

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirmar = () => {
    setVisible(false);
    resolver?.(tempDate);
    setResolver(null);
  };

  const handleCancelar = () => {
    setVisible(false);
    setResolver(null);
  };

  return (
    <MyDatePickerContext.Provider value={{ openMyDatePicker }}>
      {children}

      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>Selecione a data</Text>

            <DateTimePicker
              mode="single"
              date={tempDate}
              onChange={({ date }) => date && setTempDate(date)}
              locale="pt-BR"
              styles={customStyles}
            />

            <View style={styles.buttons}>
              <TouchableOpacity style={[styles.button, styles.cancel]} onPress={ handleCancelar }>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.confirm]} onPress={ handleConfirmar }>
                <Text style={[styles.buttonText]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </MyDatePickerContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.backgroundColorLight,
    padding: 20,
    borderRadius: 16,
    width: "85%",
    alignItems: "center",
  },
  title: {
    color: colors.textColor,
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 15,
    width: "100%",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: colors.backgroundColorDark,
    borderWidth: 1,
  },
  cancel: {
    borderColor: '#bd0404'
  },
  confirm: {
    borderColor: '#048c04'
  },
  buttonText: {
    color: colors.textColor,
    fontSize: 16,
  },
});

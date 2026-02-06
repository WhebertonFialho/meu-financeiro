import React, { useState, Fragment } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, } from "react-native";
import DateTimePicker, { DateType, useDefaultStyles, } from "react-native-ui-datepicker";
import { colors } from "@theme/colors";

interface MyInputDateProps {
  label: string;
  value?: Date | null;
  setValue: (value: Date | null) => void;
}

const MyInputDate: React.FC<MyInputDateProps> = ({ label, value, setValue }) => {
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState<DateType>(value ?? new Date());

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
  
  const handleConfirmar = () => {
    if (tempDate instanceof Date) {
      setValue(tempDate);
    }
    setOpen(false);
  };

  const handleCancelar = () => {
    setTempDate(value ?? new Date());
    setOpen(false);
  };

  const handleClear = () => {
    setValue(null);
    setTempDate(new Date());
  };

  const formataData = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={{ width: "90%" }}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        style={styles.container}
        onPress={() => {
          setTempDate(value ?? new Date());
          setOpen(true);
        }}
      >
        <Text style={{ color: value ? "#ccc" : "#999" }}>
          {value ? formataData(value) : "DD/MM/YYYY"}
        </Text>

        {value && (
          <TouchableOpacity style={styles.clearInside} onPress={handleClear}>
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        )}
      </Pressable>

      {open && (
        <Fragment>
          <Modal transparent visible animationType="fade">
            <View style={styles.overlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.title}>Selecione a data</Text>

                <DateTimePicker
                  mode="single"
                  date={tempDate}
                  onChange={({ date }) => setTempDate(date)}
                  locale="pt-BR"
                  styles={customStyles}
                />

                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancel]}
                    onPress={handleCancelar}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.confirm]}
                    onPress={handleConfirmar}
                  >
                    <Text style={styles.buttonText}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </Fragment>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
  },
  label: {
    color: colors.textColor,
    fontSize: 16,
    padding: 3,
  },
  clearInside: {
    position: "absolute",
    right: 6,
    top: 1,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  clearText: {
    color: "#fff",
    fontSize: 22,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
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
    borderWidth: 1,
  },
  cancel: {
    borderColor: "#bd0404",
  },
  confirm: {
    borderColor: "#048c04",
  },
  buttonText: {
    color: colors.textColor,
    fontSize: 16,
  },
});

export default MyInputDate;

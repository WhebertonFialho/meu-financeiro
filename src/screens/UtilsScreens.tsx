import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useAppNavigation } from '@hooks/useAppNavigation';
import { Ionicons } from "@expo/vector-icons";
import { colors } from '@theme/colors';

type RouteItem = {
  title: string;
  subtitle: string;
  icon: string;
  route: string;
};

const routes: RouteItem[] = [
  { 
    title: "Banco de Dados", 
    subtitle: "Backup e Restauracao de Banco de Dados", 
    icon: "server-outline", 
    route: "BancoDados" 
  }
];

export default function UtilsScreen() {
  const nav = useAppNavigation();

  return (
    <ScrollView style={styles.container}>
      { routes.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={() => nav.navigate(item.route as never)}
        >
          <Ionicons 
            name={item.icon as any} 
            size={24} 
            color={ colors.grayColor } 
            style={styles.icon} 
          />
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          
          <Ionicons name="chevron-forward" size={20} color={ colors.grayColor } />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColorDark,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    margin: 10,
    borderRadius: 8,
    borderWidth: 0.7,
    borderColor: "#E5DFF2",
    borderBottomWidth: 1
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textColor,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textColor,
  },
});
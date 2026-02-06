import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';

export type FilterType = 'Semanal' | 'Quinzenal' | 'Mensal';

interface MyTabFilterProps {
  filter: FilterType;
  setFilter: (filter : FilterType) => void;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  setYear: React.Dispatch<React.SetStateAction<number>>;
}

const MyTabFilter: React.FC<MyTabFilterProps> = ({ filter, setFilter, setMonth, setYear }) => {
  const [activeTab, setActiveTab] = useState<FilterType>('Semanal');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()+1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const tabs: FilterType[] = ['Semanal', 'Quinzenal', 'Mensal'];

  const handleOnChangeTab = (tab : FilterType) => {
    setActiveTab(tab);
    setFilter(tab);
  }

  const handleOnChangeMonth = (direction: 'next' | 'prev') => {
    let month = 0;
    if (direction === 'next') 
      month = (selectedMonth === 12 ? 1 : selectedMonth + 1)
    else 
      month = (selectedMonth === 1 ? 12 : selectedMonth - 1)
     
    setSelectedMonth(month);
    setMonth(month);
  };

  const handleOnChangeYear = (direction: 'next' | 'prev') => {
    const year = (direction === 'next' ? selectedYear + 1 : selectedYear - 1)
    setSelectedYear(year);
    setYear(year);
  };

  useEffect(() => {
    setActiveTab(filter)
  }, [filter]);

  return (
    <View style={styles.container}>
      <View style={styles.tabWrapper}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleOnChangeTab(tab)}
            style={[ styles.tabItem, activeTab === tab && styles.activeTabItem ]}
          >
            <Text style={[ styles.tabText, activeTab === tab && styles.activeTabText ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'Mensal' && (
        <View style={styles.extraFiltersContainer}>
          
          <View style={styles.selectorRow}>
            <TouchableOpacity onPress={() => handleOnChangeMonth('prev')} style={styles.arrowBtn}>
              <Ionicons name="chevron-back" size={24} color={colors.grayColor} />
            </TouchableOpacity>
            
            <View style={styles.labelContainer}>
              <Text style={styles.selectorValue}>{months[selectedMonth]}</Text>
            </View>

            <TouchableOpacity onPress={() => handleOnChangeMonth('next')} style={styles.arrowBtn}>
              <Ionicons name="chevron-forward" size={24} color={colors.grayColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.selectorRow}>
            <TouchableOpacity onPress={() => handleOnChangeYear('prev')} style={styles.arrowBtn}>
              <Ionicons name="chevron-back" size={24} color={colors.grayColor} />
            </TouchableOpacity>

            <View style={styles.labelContainer}>
              <Text style={styles.selectorValue}>{selectedYear}</Text>
            </View>

            <TouchableOpacity onPress={() => handleOnChangeYear('next')} style={styles.arrowBtn}>
              <Ionicons name="chevron-forward" size={24} color={colors.grayColor} />
            </TouchableOpacity>
          </View>
          
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
    backgroundColor: colors.backgroundColorLight,
  },
  tabWrapper: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: colors.greenColor,
  },
  tabText: {
    fontSize: 16,
    color: colors.textColor,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.greenColor,
    fontWeight: 'bold',
  },
  extraFiltersContainer: {
    marginTop: 10,
    gap: 10,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#272424',
    padding: 10,
    elevation: 3,
    borderRadius: 10,
  },
  arrowBtn: {
    padding: 5,
  },
  labelContainer: {
    alignItems: 'center',
  },
  labelTitle: {
    fontSize: 10,
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  selectorValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textColor,
    minWidth: 120,
    textAlign: 'center',
  },
});

export default MyTabFilter;
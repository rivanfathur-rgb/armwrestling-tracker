import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ProgramCardProps {
  name: string;
  day: string;
  onPress: () => void;
}

export const ProgramCard = ({ name, day, onPress }: ProgramCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>{day}</Text>
      </View>
      <MaterialIcons
        name="chevron-right"
        size={28}
        color="#8DEAE7" 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0a0a0a', 
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(55, 175, 212, 0.2)', 
    borderLeftWidth: 5,
    borderLeftColor: '#8DEAE7', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  title: {
    color: '#8DEAE7', 
    fontSize: 19,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#a3a3a3', 
    fontSize: 14,
    marginTop: 4,
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SubCardProps {
  name: string;
  lastWeight: string; 
  status: string;     
  onPress: () => void;
}

export const SubCard = ({ name, lastWeight, status, onPress }: SubCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.weight}>Terakhir: <Text style={styles.goldText}>{lastWeight} </Text></Text>
      </View>
      <View style={[
        styles.statusBadge, 
        { 
          backgroundColor: status === 'Selesai' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(55, 188, 212, 0.1)',
          borderColor: status === 'Selesai' ? '#10b981' : '#8DEAE7',
          borderWidth: 1
        }
      ]}>
        <Text style={[
          styles.statusText,
          { color: status === 'Selesai' ? '#10b981' : '#8DEAE7' }
        ]}>
          {status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0a0a0a', // Hitam kartu
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1a1a', // Border gelap agar clean
  },
  name: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  weight: { 
    color: '#a3a3a3', 
    fontSize: 12, 
    marginTop: 4 
  },
  goldText: {
    color: '#8DEAE7', // Berat terakhir jadi warna emas
    fontWeight: 'bold',
  },
  statusBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 10 
  },
  statusText: { 
    fontSize: 11, 
    fontWeight: '900',
    textTransform: 'uppercase'
  },
});
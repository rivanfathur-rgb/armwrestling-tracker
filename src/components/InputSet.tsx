import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

interface InputSetProps {
  weight: string;
  reps: string;
  placeholderWeight: string;
  placeholderReps: string;
  onWeightChange: (text: string) => void;
  onRepsChange: (text: string) => void;
  onSave: () => void;
}

export const InputSet = ({
  weight,
  reps,
  placeholderWeight,
  placeholderReps,
  onWeightChange,
  onRepsChange,
  onSave,
}: InputSetProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Beban (KG)</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholderWeight}
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={weight}
            onChangeText={onWeightChange}
          />
        </View>
        <View style={[styles.inputGroup, { marginLeft: 12 }]}>
          <Text style={styles.label}>Reps</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholderReps}
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={reps}
            onChangeText={onRepsChange}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>Simpan Set</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0a',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#fff',
    padding: 15,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  button: {
    backgroundColor: '#8DEAE7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
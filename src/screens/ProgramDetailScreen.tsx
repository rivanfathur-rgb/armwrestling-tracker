import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { SubCard } from '../components/SubCard';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'ProgramDetail'>;

export const ProgramDetailScreen = ({ route, navigation }: Props) => {
  const { programId } = route.params;
  const [newExerciseName, setNewExerciseName] = useState('');
  
  const program = useWorkoutStore((state) => 
    state.programs.find((p) => p.id === programId)
  );

  const addExercise = useWorkoutStore((state) => state.addExercise);

  const handleAddExercise = () => {
    if (newExerciseName.trim() === '') return;
    addExercise(programId, newExerciseName);
    setNewExerciseName('');
  };

  const handleFinishWorkout = () => {
    const summary = program?.exercises
      .map(ex => `${ex.name}: ${ex.lastMaxWeight}kg`)
      .join('\n');

    Alert.alert(
      "Latihan Selesai! 🔥",
      `Rangkuman hari ini:\n\n${summary || "Belum ada data."}\n\nTetap konsisten!`,
      [{ text: "Mantap!", onPress: () => navigation.navigate('Home') }]
    );
  };

  if (!program) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          placeholder="Tambah latihan baru..."
          placeholderTextColor="#64748b"
          value={newExerciseName}
          onChangeText={setNewExerciseName}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAddExercise}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={program.exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SubCard
            name={item.name}
            lastWeight={`${item.lastMaxWeight}kg`}
            status={item.activeSets.length > 0 ? "Sedang Jalan" : "Selesai"}
            onPress={() => navigation.navigate('ExerciseDetail', {
              programId: program.id,
              exerciseId: item.id,
              exerciseName: item.name
            })}
          />
        )}

        ListFooterComponent={
          <View style={styles.globalHistoryContainer}>
            <Text style={styles.historyTitle}>Histori Sesi Sebelumnya</Text>
            {program.exercises.map((ex) => (
              ex.history.length > 0 && (
                <View key={ex.id} style={styles.historyCard}>
                  <Text style={styles.historyExName}>{ex.name}</Text>
                  
                  {/* Tambahkan .slice().reverse() agar yang terbaru di atas */}
                  {ex.history
                    .slice() 
                    .sort((a, b) => b.timestamp - a.timestamp) 
                    .slice(0, 3) 
                    .map((h) => (
                      <View key={h.id} style={styles.historyRow}>
                        <Text style={styles.historyDate}>
                          {new Date(h.timestamp).toLocaleDateString('id-ID')}
                        </Text>
                        <Text style={styles.historyData}>{h.weight}kg x {h.reps}</Text>
                      </View>
                  ))}
                </View>
              )
            ))}
          </View>
        }

      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishAllBtn} onPress={handleFinishWorkout}>
          <Text style={styles.finishAllText}>AKHIRI LATIHAN HARI INI</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', padding: 20, gap: 10 },
  input: { flex: 1, backgroundColor: '#0a0a0a', borderRadius: 12, borderColor: '#1a1a1a', paddingHorizontal: 15, color: '#fff', height: 50 },
  addBtn: { backgroundColor: '#8DEAE7', width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: '#000', fontSize: 24, fontWeight: 'bold' },
  list: { paddingHorizontal: 20, paddingBottom: 120 },
  
  
  globalHistoryContainer: { marginTop: 30, paddingBottom: 20 },
  historyTitle: { color: '#a3a3a3', fontSize: 16, fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase' },
  historyCard: { backgroundColor: '#0a0a0a', padding: 15, borderRadius: 15, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#8DEAE7' },
  historyExName: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginBottom: 8 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, borderTopWidth: 0.5, borderTopColor: '#334155', paddingTop: 4 },
  historyDate: { color: '#8DEAE7', fontSize: 12 },
  historyData: { color: '#8DEAE7', fontSize: 12, fontWeight: '600' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#0a0a0a' },
  finishAllBtn: { backgroundColor: '#8DEAE7', padding: 18, borderRadius: 15, alignItems: 'center' },
  finishAllText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});

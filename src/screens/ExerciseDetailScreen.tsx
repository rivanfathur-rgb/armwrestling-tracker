import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { InputSet } from '../components/InputSet';
import { ProgressChart } from '../components/ProgressChart';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SetEntry } from '../types';

type Props = StackScreenProps<RootStackParamList, 'ExerciseDetail'>;

interface ListData extends SetEntry {
  isHistory: boolean;
}

export const ExerciseDetailScreen = ({ route, navigation }: Props) => {
  const { programId, exerciseId } = route.params;
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const exercise = useWorkoutStore((state) => 
    state.programs
      .find((p) => p.id === programId)
      ?.exercises.find((ex) => ex.id === exerciseId)
  );

  const addSet = useWorkoutStore((state) => state.addSet);
  const finishExerciseSession = useWorkoutStore((state) => state.finishExerciseSession);
  const deleteSet = useWorkoutStore((state) => state.deleteSet);
  const clearHistory = useWorkoutStore((state) => state.clearHistory);

  const handleSaveSet = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (w > 0 && r > 0) {
      addSet(programId, exerciseId, w, r);
      setWeight('');
      setReps('');
    }
  };

  const handleFinishSession = () => {
    Alert.alert(
      "Selesaikan Sesi",
      "Set aktif akan dipindah ke histori.",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Ya, Selesai", 
          onPress: () => {
            finishExerciseSession(programId, exerciseId);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleItemOptions = (item: ListData) => {
    Alert.alert(
      "Opsi Data",
      `${item.weight}kg x ${item.reps}`,
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive", 
          onPress: () => deleteSet(programId, exerciseId, item.id, item.isHistory) 
        },
        { 
          text: "Edit", 
          onPress: () => {
            setWeight(item.weight.toString());
            setReps(item.reps.toString());
            deleteSet(programId, exerciseId, item.id, item.isHistory);
          }
        }
      ]
    );
  };

  const handleResetHistory = () => {
    Alert.alert(
      "Hapus Semua Histori?",
      "Grafik dan catatan lama akan hilang permanen.",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive", 
          onPress: () => clearHistory(programId, exerciseId) 
        }
      ]
    );
  };

  if (!exercise) return null;

  const combinedSets = [...exercise.history, ...exercise.activeSets]
    .sort((a, b) => a.timestamp - b.timestamp);

  const dataPerDay: { [key: string]: { maxWeight: number, totalVolume: number } } = {};

  combinedSets.forEach(set => {
    const date = new Date(set.timestamp).toDateString();
    const volume = set.weight * set.reps;
    if (!dataPerDay[date]) {
      dataPerDay[date] = { maxWeight: set.weight, totalVolume: volume };
    } else {
      dataPerDay[date].maxWeight = Math.max(dataPerDay[date].maxWeight, set.weight);
      dataPerDay[date].totalVolume += volume;
    }
  });

  const strengthData = Object.values(dataPerDay).map(d => d.maxWeight);
  const volumeData = Object.values(dataPerDay).map(d => d.totalVolume);

  const listData: ListData[] = [
    ...exercise.activeSets.map(s => ({ ...s, isHistory: false })),
    ...exercise.history.map(s => ({ ...s, isHistory: true }))
  ];

  const lastSet = exercise.activeSets[0] || exercise.history[0]; 
  const placeholderW = lastSet ? `${lastSet.weight}+` : "0";
  const placeholderR = lastSet ? `${lastSet.reps}+` : "0";

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <View>
            <InputSet
              weight={weight}
              reps={reps}
              placeholderWeight={placeholderW}
              placeholderReps={placeholderR}
              onWeightChange={setWeight}
              onRepsChange={setReps}
              onSave={handleSaveSet}
            />

            <View style={styles.rowBetween}>
              <Text style={styles.chartTitle}>Strength Graph (Peak Load)</Text>
              <TouchableOpacity onPress={handleResetHistory}>
                <Text style={styles.resetText}>RESET</Text>
              </TouchableOpacity>
            </View>
            
            {/* Grafik Kekuatan - Pakai warna Gold */}
            <ProgressChart data={strengthData} color="#8DEAE7" unit="kg" />

            <Text style={styles.chartTitle}>Volume Graph (Workload)</Text>
            {/* Grafik Volume - Pakai warna Emas redup */}
            <ProgressChart data={volumeData} color="#a3a3a3" unit="vol" />

            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Set Hari Ini</Text>
              {exercise.activeSets.length > 0 && (
                <TouchableOpacity style={styles.finishBtn} onPress={handleFinishSession}>
                  <Text style={styles.finishBtnText}>AKHIRI SESI</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            onLongPress={() => handleItemOptions(item)}
            activeOpacity={0.7}
            style={[styles.logItem, item.isHistory && styles.historyItem]}
          >
            <View style={styles.logLeft}>
              <Text style={[styles.setLabel, item.isHistory && styles.historyLabel]}>
                {item.isHistory ? 'HISTORY' : `SET ${exercise.activeSets.length - index}`}
              </Text>
              <Text style={styles.logDate}>
                {new Date(item.timestamp).toLocaleDateString('id-ID')}
              </Text>
            </View>
            <Text style={styles.logText}>
              <Text style={item.isHistory ? styles.historyWeight : styles.highlight}>
                {item.weight} kg
              </Text> x {item.reps}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada catatan. Hajar hari ini!</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollContent: { padding: 20 },
  chartTitle: { color: '#8DEAE7', fontSize: 11, fontWeight: '900', marginTop: 15, marginBottom: 8, letterSpacing: 1 },
  resetText: { color: '#ef4444', fontSize: 11, fontWeight: '900', marginTop: 15 },
  sectionTitle: { color: '#a3a3a3', fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  finishBtn: { backgroundColor: '#8DEAE7', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  finishBtnText: { color: '#000', fontWeight: '900', fontSize: 11 },
  logItem: { 
    backgroundColor: '#0a0a0a', 
    padding: 18, 
    borderRadius: 15, 
    marginBottom: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#1a1a1a' 
  },
  historyItem: { opacity: 0.4, borderStyle: 'dashed', borderColor: '#333' },
  logLeft: { flexDirection: 'column' },
  setLabel: { color: '#8DEAE7', fontWeight: '900', fontSize: 10, letterSpacing: 1 },
  historyLabel: { color: '#666' },
  logDate: { color: '#444', fontSize: 10, marginTop: 2 },
  logText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  highlight: { color: '#8DEAE7' },
  historyWeight: { color: '#a3a3a3' },
  emptyText: { color: '#444', textAlign: 'center', marginTop: 30, fontWeight: 'bold' },
});
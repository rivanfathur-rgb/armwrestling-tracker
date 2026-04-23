import React from 'react';
import { StyleSheet, View, ScrollView, Text, SafeAreaView } from 'react-native';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { ProgramCard } from '../components/ProgramCard';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const programs = useWorkoutStore((state) => state.programs);
  const getStreak = useWorkoutStore((state) => state.getStreak);
  const currentStreak = getStreak();

  const schedule = [
    { day: 'S', active: true },
    { day: 'S', active: false },
    { day: 'R', active: true },
    { day: 'K', active: false },
    { day: 'J', active: true },
    { day: 'S', active: false },
    { day: 'M', active: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Elite Training,</Text>
            <Text style={styles.username}>Rivan Armwrestling 🏆</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakNumber}>{currentStreak}</Text>
          </View>
        </View>

        {/* Weekly Schedule - Theme Gold */}
        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>Jadwal Mingguan</Text>
          <View style={styles.calendarRow}>
            {schedule.map((item, index) => (
              <View key={index} style={styles.dayCol}>
                <View style={[
                  styles.dayDot, 
                  item.active ? styles.activeDot : styles.inactiveDot
                ]} />
                <Text style={styles.dayText}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Program Latihan</Text>
          {programs.map((prog) => (
            <ProgramCard
              key={prog.id}
              name={prog.name}
              day={prog.scheduledDay}
              // Catatan: Pastikan di ProgramCard kamu juga mengubah warnanya ke Hitam/Emas
              onPress={() => 
                navigation.navigate('ProgramDetail', { 
                  programId: prog.id, 
                  programName: prog.name 
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
  
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  greeting: { color: '#a3a3a3', fontSize: 14 },
  username: { color: '#8DEAE7', fontSize: 22, fontWeight: '900' }, // Gold
  streakBadge: {
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8DEAE7', 
  },
  streakEmoji: { fontSize: 18, marginRight: 5 },
  streakNumber: { color: '#8DEAE7', fontWeight: 'bold', fontSize: 18 },
  streakCard: {
    backgroundColor: '#0a0a0a', // Background Gelap
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgb(141, 234, 231)', // Border Emas
  },
  streakTitle: { color: '#8DEAE7', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  calendarRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center' },
  dayDot: { width: 30, height: 30, borderRadius: 15, marginBottom: 5, justifyContent: 'center', alignItems: 'center' },
  activeDot: { backgroundColor: '#8DEAE7', borderWidth: 1, borderColor: '#8DEAE7' },
  inactiveDot: { backgroundColor: '#333' },
  dayText: { color: '#a3a3a3', fontSize: 12, fontWeight: '600' },
  section: { marginTop: 10 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
});
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutState, SetEntry, Exercise } from '../types';


const getDiffDays = (date1: Date, date2: Date) => {
  const d1 = new Date(date1);
  d1.setHours(0, 0, 0, 0);
  const d2 = new Date(date2);
  d2.setHours(0, 0, 0, 0);
  return Math.round((d1.getTime() - d2.getTime()) / (1000 * 3600 * 24));
};

interface WorkoutStore extends Omit<WorkoutState, 'streak'> {
  addExercise: (programId: string, name: string) => void;
  addSet: (programId: string, exerciseId: string, weight: number, reps: number) => void;
  finishExerciseSession: (programId: string, exerciseId: string) => void;
  deleteSet: (programId: string, exerciseId: string, setId: string, isHistory: boolean) => void;
  editSet: (programId: string, exerciseId: string, setId: string, weight: number, reps: number) => void;
  clearHistory: (programId: string, exerciseId: string) => void;
  getStreak: () => number; 
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      programs: [
        { id: '1', name: 'Toproll', scheduledDay: 'Senin', exercises: [] },
        { id: '2', name: 'Hook', scheduledDay: 'Rabu', exercises: [] },
        { id: '3', name: 'Push Day', scheduledDay: 'Jumat', exercises: [] },
        { id: '4', name: 'Pull Day', scheduledDay: 'Minggu', exercises: [] },
      ],
      lastWorkoutDate: null,

      getStreak: () => {
        const state = get();
        const allTimestamps: number[] = [];
        
        
        state.programs.forEach(p => {
          p.exercises.forEach(ex => {
            ex.history.forEach(h => allTimestamps.push(h.timestamp));
          });
        });

        if (allTimestamps.length === 0) return 0;

        
        const uniqueDates = Array.from(new Set(
          allTimestamps.map(t => new Date(t).toDateString())
        )).map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

        const today = new Date();
        const diffFromLatest = getDiffDays(today, uniqueDates[0]);

        
        if (diffFromLatest > 1) return 0;

        let streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const diff = getDiffDays(uniqueDates[i], uniqueDates[i + 1]);
          if (diff === 1) {
            streak++;
          } else {
            break; 
          }
        }
        return streak;
      },

      addExercise: (programId, name) => set((state) => ({
        programs: state.programs.map((prog) => {
          if (prog.id === programId) {
            const newExercise: Exercise = {
              id: Math.random().toString(36).substring(7),
              name,
              activeSets: [],
              history: [],
              lastMaxWeight: 0,
            };
            return { ...prog, exercises: [...prog.exercises, newExercise] };
          }
          return prog;
        }),
      })),

      addSet: (programId, exerciseId, weight, reps) => {
        set((state) => ({
          programs: state.programs.map((prog) => {
            if (prog.id === programId) {
              return {
                ...prog,
                exercises: prog.exercises.map((ex) => {
                  if (ex.id === exerciseId) {
                    const newSet: SetEntry = {
                      id: Math.random().toString(36).substring(7),
                      weight,
                      reps,
                      timestamp: Date.now(),
                    };
                    return {
                      ...ex,
                      activeSets: [newSet, ...ex.activeSets],
                      lastMaxWeight: Math.max(ex.lastMaxWeight, weight),
                    };
                  }
                  return ex;
                }),
              };
            }
            return prog;
          }),
        }));
      },

      finishExerciseSession: (programId, exerciseId) => {
        const state = get();
        const currentExercise = state.programs
          .find(p => p.id === programId)
          ?.exercises.find(ex => ex.id === exerciseId);

        
        if (!currentExercise || currentExercise.activeSets.length === 0) return;

        set((state) => ({
          lastWorkoutDate: new Date().toDateString(),
          programs: state.programs.map((prog) => {
            if (prog.id === programId) {
              return {
                ...prog,
                exercises: prog.exercises.map((ex) => {
                  if (ex.id === exerciseId) {
                    return {
                      ...ex,
                      history: [...ex.activeSets, ...ex.history],
                      activeSets: [],
                    };
                  }
                  return ex;
                }),
              };
            }
            return prog;
          }),
        }));
      },

      deleteSet: (programId, exerciseId, setId, isHistory) => {
        set((state) => ({
          programs: state.programs.map((p) => {
            if (p.id === programId) {
              return {
                ...p,
                exercises: p.exercises.map((ex) => {
                  if (ex.id === exerciseId) {
                    const targetKey = isHistory ? 'history' : 'activeSets';
                    const otherKey = isHistory ? 'activeSets' : 'history';
                    const updatedList = ex[targetKey].filter((s: SetEntry) => s.id !== setId);
                    const allRemaining = [...updatedList, ...ex[otherKey]];
                    const newMax = allRemaining.length > 0 ? Math.max(...allRemaining.map(s => s.weight)) : 0;

                    return {
                      ...ex,
                      [targetKey]: updatedList,
                      lastMaxWeight: newMax,
                    };
                  }
                  return ex;
                }),
              };
            }
            return p;
          }),
        }));
      },

      editSet: (programId, exerciseId, setId, weight, reps) => {
        set((state) => ({
          programs: state.programs.map((p) => {
            if (p.id === programId) {
              return {
                ...p,
                exercises: p.exercises.map((ex) => {
                  if (ex.id === exerciseId) {
                    const updateFn = (list: SetEntry[]) => list.map(s => s.id === setId ? { ...s, weight, reps } : s);
                    const newActive = updateFn(ex.activeSets);
                    const newHistory = updateFn(ex.history);
                    const newMax = Math.max(...[...newActive, ...newHistory].map(s => s.weight), 0);
                    return {
                      ...ex,
                      activeSets: newActive,
                      history: newHistory,
                      lastMaxWeight: newMax
                    };
                  }
                  return ex;
                }),
              };
            }
            return p;
          }),
        }));
      },

      clearHistory: (programId, exerciseId) => {
        set((state) => ({
          programs: state.programs.map((p) => {
            if (p.id === programId) {
              return {
                ...p,
                exercises: p.exercises.map((ex) => {
                  if (ex.id === exerciseId) {
                    return { ...ex, history: [], activeSets: [], lastMaxWeight: 0 };
                  }
                  return ex;
                }),
              };
            }
            return p;
          }),
        }));
      }
    }),
    {
      name: 'workout-storage-v2', // Versi storage naik ke v2 karena struktur berubah
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

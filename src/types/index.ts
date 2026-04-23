export interface SetEntry {
  id: string;
  weight: number;
  reps: number;
  timestamp: number;
}

export interface Exercise {
  id: string;
  name: string;
  activeSets: SetEntry[];
  history: SetEntry[];
  lastMaxWeight: number;
}

export interface Program {
  id: string;
  name: string;
  scheduledDay: string;
  exercises: Exercise[];
}

export interface WorkoutState {
  programs: Program[];
  streak: number;
  lastWorkoutDate: string | null;
}
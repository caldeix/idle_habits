// Tipos y modelos de dominio para los hábitos
// Toda esta parte NO depende de React, solo define la forma de los datos y reglas básicas

// Tipo para la frecuencia de un hábito: diario, semanal o mensual
export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

// Identificadores internos de dificultad de un hábito
export type HabitDifficultyId =
  | 'easy'
  | 'easy-medium'
  | 'medium'
  | 'medium-hard'
  | 'hard';

// Días de la semana. Usamos string literal types para tener autocompletado y evitar errores de texto
export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// Alias para el identificador único de un hábito
export type HabitId = string;

// Interfaz base que comparten todos los hábitos
// Aquí van los campos comunes: id, nombre, frecuencia...
export interface BaseHabit {
  // id único que usaremos como "primary key" para identificar el hábito
  id: HabitId;
  // nombre visible del hábito (ej: "Pasear al perro")
  name: string;
  // tipo de frecuencia: diario, semanal o mensual
  frequency: HabitFrequency;
  // fecha de creación guardada como string ISO (ej: "2025-11-20T...Z")
  createdAt: string;
  // dificultad asociada al hábito (controla la recompensa base de XP y monedas)
  difficultyId: HabitDifficultyId;
  // Recompensa concreta de este hábito al completarse (puede ajustarse por hábito)
  xpReward: number;
  coinReward: number;
}

// Hábito diario: se hace todos los días
export interface DailyHabit extends BaseHabit {
  frequency: 'daily';
}

// Hábito semanal: se hace solo en algunos días de la semana seleccionados
export interface WeeklyHabit extends BaseHabit {
  frequency: 'weekly';
  // lista de días de la semana en los que toca hacer este hábito
  daysOfWeek: Weekday[];
}

// Hábito mensual: se hace una vez al mes
export interface MonthlyHabit extends BaseHabit {
  frequency: 'monthly';
  // día concreto del mes (1-31). Si no lo ponemos, podemos interpretarlo como "en algún momento del mes"
  dayOfMonth?: number;
}

// Tipo unión de los tres tipos de hábito posibles
export type Habit = DailyHabit | WeeklyHabit | MonthlyHabit;

// Estructura completa que vamos a guardar en localStorage bajo la clave "habits"
// Contiene dos arrays: incompleted y completed
export interface HabitState {
  // Hábitos pendientes de completar
  incompleted: Habit[];
  // Hábitos ya completados
  completed: Habit[];
}

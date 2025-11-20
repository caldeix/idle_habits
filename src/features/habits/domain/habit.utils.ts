// Funciones de utilidad relacionadas con la lógica de los hábitos
// Aquí ponemos lógica pura que NO depende de React ni de localStorage

import type { Habit, MonthlyHabit, Weekday, WeeklyHabit } from './habit.types';

// Devuelve el día de la semana actual como uno de nuestros tipos Weekday
const getTodayWeekday = (): Weekday => {
  // new Date().getDay() devuelve un número de 0 (domingo) a 6 (sábado)
  const dayIndex = new Date().getDay();

  // Mapeamos el índice numérico a nuestro tipo Weekday
  const map: Weekday[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  return map[dayIndex];
};

// Determina si un hábito concreto "toca hoy" según su frecuencia y configuración
// Esta función la usaremos para filtrar la lista de hábitos a mostrar hoy
export const isHabitForToday = (habit: Habit, today = new Date()): boolean => {
  // Si es diario, siempre aparece hoy
  if (habit.frequency === 'daily') return true;

  // Si es semanal, miramos si el día de hoy está incluido en su lista de días
  if (habit.frequency === 'weekly') {
    const weekday = getTodayWeekday();
    const weeklyHabit = habit as WeeklyHabit;
    return weeklyHabit.daysOfWeek.includes(weekday);
  }

  // Si es mensual, comprobamos el día del mes
  if (habit.frequency === 'monthly') {
    const dayOfMonthToday = today.getDate();
    const monthlyHabit = habit as MonthlyHabit;

    // Si no tiene dayOfMonth definido, podemos interpretar que aparece siempre
    if (monthlyHabit.dayOfMonth == null) return true;

    return monthlyHabit.dayOfMonth === dayOfMonthToday;
  }

  // Caso por defecto (no debería ocurrir si hemos definido bien los tipos)
  return false;
};

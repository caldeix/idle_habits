// Hook personalizado que conecta React con la lógica de hábitos
// Este hook usa:
// - habit.storage para leer/escribir en localStorage
// - habit.service para las transformaciones de estado
// - habit.utils para saber qué hábitos tocan hoy

import { useEffect, useState } from 'react';
import type { DailyHabit, Habit, HabitId, HabitState } from '../domain/habit.types';
import { loadHabitState, saveHabitState } from '../storage/habit.storage';
import {
  addHabit,
  completeHabit,
  deleteHabit,
  uncompleteHabit,
  updateHabit,
} from './habit.service';
import { isHabitForToday } from '../domain/habit.utils';

// Definimos una interfaz con todo lo que el hook expone a los componentes
interface UseHabitsResult {
  // Estado completo, por si lo quieres usar en algún momento
  state: HabitState;
  // Solo hábitos de hoy, separados en incompletos y completos
  todaysIncompleted: Habit[];
  todaysCompleted: Habit[];
  // Acciones para modificar el estado
  createHabit: (habit: Habit) => void;
  editHabit: (habit: Habit) => void;
  removeHabit: (id: HabitId) => void;
  markCompleted: (id: HabitId) => void;
  markIncompleted: (id: HabitId) => void;
}

export const useHabits = (): UseHabitsResult => {
  // Estado React que representa todo el estado de hábitos en memoria
  // Lo inicializamos leyendo de localStorage
  const [state, setState] = useState<HabitState>(() => loadHabitState());

  // Cada vez que el estado cambie, lo persistimos en localStorage
  useEffect(() => {
    saveHabitState(state);
  }, [state]);

  // Crea un nuevo hábito y lo añade al estado usando el servicio addHabit
  const createHabit = (habit: Habit) => {
    // Quiero comprobar que si ha escogido semanal y todos los dias los guarde como diario
    if(habit.frequency === 'weekly' && habit.daysOfWeek.length === 7){
      // hay que cambiar el tipo de habitWeekly a HabitDaily
      const {daysOfWeek, ...rest} = habit;
      const habitDaily = {...rest, frequency: 'daily'} as DailyHabit;
      console.log(habitDaily);
      setState((prevState) => addHabit(prevState, habitDaily));
      return;
    }
    console.log(habit);
    setState((prevState) => addHabit(prevState, habit));
  };

  // Actualiza un hábito existente (puede estar en cualquiera de las dos listas)
  const editHabit = (habit: Habit) => {
    setState((prevState) => updateHabit(prevState, habit));
  };

  // Elimina un hábito por id de ambas listas
  const removeHabit = (id: HabitId) => {
    setState((prevState) => deleteHabit(prevState, id));
  };

  // Marca un hábito como completado
  const markCompleted = (id: HabitId) => {
    setState((prevState) => completeHabit(prevState, id));
  };

  // Marca un hábito como incompleto
  const markIncompleted = (id: HabitId) => {
    setState((prevState) => uncompleteHabit(prevState, id));
  };

  // Filtramos la lista de hábitos para quedarnos solo con los que "tocan hoy"
  const todaysIncompleted = state.incompleted.filter((habit) =>
    isHabitForToday(habit)
  );

  const todaysCompleted = state.completed.filter((habit) =>
    isHabitForToday(habit)
  );

  // Devolvemos todo lo que los componentes necesitan
  return {
    state,
    todaysIncompleted,
    todaysCompleted,
    createHabit,
    editHabit,
    removeHabit,
    markCompleted,
    markIncompleted,
  };
};

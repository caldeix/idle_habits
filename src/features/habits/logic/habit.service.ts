// Servicio de hábitos: funciones puras que reciben un estado y devuelven un nuevo estado
// Aquí NO usamos React ni localStorage directamente, solo transformamos datos

import type { Habit, HabitId, HabitState } from '../domain/habit.types';

// Añade un nuevo hábito al array de "incompleted"
export const addHabit = (state: HabitState, habit: Habit): HabitState => {
  // Devolvemos un nuevo objeto estado (no mutamos el original) para mantener inmutabilidad
  return {
    ...state,
    incompleted: [...state.incompleted, habit],
  };
};

// Actualiza un hábito existente en cualquiera de las listas (completed / incompleted)
export const updateHabit = (state: HabitState, updated: Habit): HabitState => {
  // Función auxiliar para actualizar un hábito dentro de un array
  const updateList = (list: Habit[]) =>
    list.map((habit) => (habit.id === updated.id ? updated : habit));

  return {
    incompleted: updateList(state.incompleted),
    completed: updateList(state.completed),
  };
};

// Elimina un hábito por id de ambas listas
export const deleteHabit = (state: HabitState, id: HabitId): HabitState => {
  return {
    incompleted: state.incompleted.filter((habit) => habit.id !== id),
    completed: state.completed.filter((habit) => habit.id !== id),
  };
};

// Marca un hábito como completado: lo movemos de incompleted a completed
export const completeHabit = (state: HabitState, id: HabitId): HabitState => {
  // Buscamos el hábito en la lista de incompletos
  const habit = state.incompleted.find((h) => h.id === id);
  if (!habit) return state; // si no existe, devolvemos el estado sin cambios

  return {
    // filtramos el hábito de la lista de incompletos
    incompleted: state.incompleted.filter((h) => h.id !== id),
    // y lo añadimos al final de la lista de completados
    completed: [...state.completed, habit],
  };
};

// Marca un hábito como incompleto: lo movemos de completed a incompleted
export const uncompleteHabit = (state: HabitState, id: HabitId): HabitState => {
  // Buscamos el hábito en la lista de completados
  const habit = state.completed.find((h) => h.id === id);
  if (!habit) return state; // si no existe, devolvemos el estado sin cambios

  return {
    // lo eliminamos de completados
    completed: state.completed.filter((h) => h.id !== id),
    // y lo añadimos a incompletos
    incompleted: [...state.incompleted, habit],
  };
};

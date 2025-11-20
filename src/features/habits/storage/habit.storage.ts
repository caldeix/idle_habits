// Módulo responsable de leer y escribir el estado de hábitos en localStorage
// Esta capa SOLO sabe trabajar con localStorage, no tiene lógica de negocio ni React

import type { HabitState } from '../domain/habit.types';

// Clave única bajo la que guardaremos los datos en localStorage
const STORAGE_KEY = 'habits';

// Estado por defecto si todavía no hay nada guardado
const defaultState: HabitState = {
  incompleted: [],
  completed: [],
};

// Carga el estado de hábitos desde localStorage
export const loadHabitState = (): HabitState => {
  // Si estamos en un entorno donde no existe window (por ejemplo SSR), devolvemos el estado por defecto
  if (typeof window === 'undefined') return defaultState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    // Si no hay nada guardado aún, devolvemos el estado por defecto
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw);

    // Nos aseguramos de que siempre devolvemos los arrays aunque falten en los datos guardados
    return {
      incompleted: parsed.incompleted ?? [],
      completed: parsed.completed ?? [],
    } as HabitState;
  } catch (error) {
    // Si algo falla al leer/parsear, evitamos que la app se rompa y devolvemos el estado por defecto
    console.error('Error loading habits from localStorage', error);
    return defaultState;
  }
};

// Guarda el estado de hábitos completo en localStorage
export const saveHabitState = (state: HabitState) => {
  // De nuevo, comprobamos que estamos en un entorno con window
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    // Si falla la escritura (por ejemplo, storage lleno), solo registramos el error
    console.error('Error saving habits to localStorage', error);
  }
};

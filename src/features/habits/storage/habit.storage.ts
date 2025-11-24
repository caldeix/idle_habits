// Módulo responsable de leer y escribir el estado de hábitos en localStorage
// Esta capa SOLO sabe trabajar con localStorage, no tiene lógica de negocio ni React

import type { HabitState } from '../domain/habit.types';
import { DEFAULT_HABITS } from '../domain/habits.constants';

// Clave única bajo la que guardaremos los datos en localStorage
const STORAGE_KEY = 'habits';

// Carga el estado de hábitos desde localStorage
export const loadHabitState = (): HabitState => {
  // Si estamos en un entorno donde no existe window (por ejemplo SSR), devolvemos el estado por defecto
  if (typeof window === 'undefined') return initializeHabitState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    // Si no hay nada guardado aún, inicializamos con los hábitos por defecto
    if (!raw) return initializeHabitState();

    const parsed = JSON.parse(raw);

    // Si no hay hábitos (ni completados ni pendientes), inicializamos con los por defecto
    if ((!parsed.incompleted || parsed.incompleted.length === 0) &&
      (!parsed.completed || parsed.completed.length === 0)) {
      return initializeHabitState();
    }

    // Nos aseguramos de que siempre devolvemos los arrays aunque falten en los datos guardados
    return {
      incompleted: parsed.incompleted ?? [],
      completed: parsed.completed ?? [],
    } as HabitState;
  } catch (error) {
    // Si algo falla al leer/parsear, inicializamos con los hábitos por defecto
    console.error('Error loading habits from localStorage', error);
    return initializeHabitState();
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

// Inicializa el estado con los hábitos por defecto
export const initializeHabitState = (): HabitState => {
  return {
    incompleted: [...DEFAULT_HABITS],
    completed: [],
  };
};

// Elemento individual de hábito dentro de una lista
// Se encarga de mostrar la información básica y los botones de acción (editar, eliminar, completar...)

import type { Habit } from '../../features/habits/domain/habit.types';

// Definimos las props que recibe un elemento de la lista de hábitos
interface HabitItemProps {
  // El hábito que vamos a mostrar
  habit: Habit;
  // Función que se ejecutará cuando el usuario pulse en "Editar"
  onEdit: (habit: Habit) => void;
  // Función que se ejecutará cuando el usuario pulse en "Eliminar"
  onDelete: (id: string) => void;
  // Función opcional para marcar el hábito como completado/incompleto
  onToggleComplete?: (id: string) => void;
  // Indica si este elemento representa un hábito ya completado o no
  isCompleted?: boolean;
}

export function HabitItem({
  habit,
  onEdit,
  onDelete,
  onToggleComplete,
  isCompleted,
}: HabitItemProps) {
  return (
    <li>
      {/* Nombre del hábito */}
      <span>{habit.name}</span>

      {/* Botón para editar el hábito. Más adelante puedes abrir un modal o un formulario avanzado */}
      <button type="button" onClick={() => onEdit(habit)}>
        Editar
      </button>

      {/* Botón para eliminar el hábito definitivamente */}
      <button type="button" onClick={() => onDelete(habit.id)}>
        Eliminar
      </button>

      {/* Botón para marcar como completado/incompleto si se nos ha pasado la función */}
      {onToggleComplete && (
        <button type="button" onClick={() => onToggleComplete(habit.id)}>
          {isCompleted ? 'Marcar incompleto' : 'Marcar completado'}
        </button>
      )}
    </li>
  );
}

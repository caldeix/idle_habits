// Elemento individual de hábito dentro de una lista
// Se encarga de mostrar la información básica y los botones de acción (editar, eliminar, completar...)

import type { Habit } from '../../features/habits/domain/habit.types';
import { DIFFICULTIES } from '../../features/habits/domain/difficulty.config';

// Función para obtener la clase CSS según la dificultad
const getDifficultyClass = (difficultyId: string) => {
  switch (difficultyId) {
    case 'easy':
      return 'difficulty-easy';
    case 'medium':
      return 'difficulty-medium';
    case 'hard':
      return 'difficulty-hard';
    default:
      return 'difficulty-easy';
  }
};

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
  // Obtener la etiqueta de la dificultad
  const difficultyLabel = DIFFICULTIES[habit.difficultyId]?.label || habit.difficultyId;
  const difficultyClass = getDifficultyClass(habit.difficultyId);

  return (
    <tr className={isCompleted ? 'completed-habit' : ''}>
      {/* Nombre del hábito */}
      <td className="habit-name">
        {habit.name}
      </td>

      {/* Dificultad */}
      <td>
        <span className={`difficulty-cell ${difficultyClass}`}>
          {difficultyLabel}
        </span>
      </td>

      {/* Acciones */}
      <td>
        <div className="action-buttons">
          {/* Botón para marcar como completado/incompleto si se nos ha pasado la función */}
          {onToggleComplete && (
            <button 
              type="button" 
              onClick={() => onToggleComplete(habit.id)}
              className="action-button complete"
              title={isCompleted ? 'Marcar como incompleto' : 'Marcar como completado'}
            >
              {isCompleted ? '↩️' : '✅'}
            </button>
          )}

          {/* Botón para editar el hábito */}
           {isCompleted === false && (<button 
            type="button" 
            onClick={() => onEdit(habit)}
            className="action-button edit"
            title="Editar hábito"
          >
            ✏️
          </button>)}

          {/* Botón para eliminar el hábito */}
          {isCompleted === false && (<button 
            type="button" 
            onClick={() => onDelete(habit.id)}
            className="action-button delete"
            title="Eliminar hábito"
          >
            🗑️
          </button>)}
        </div>
      </td>
    </tr>
  );
}

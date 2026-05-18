import type { Habit } from '../../features/habits/domain/habit.types';
import { DIFFICULTIES } from '../../features/habits/domain/difficulty.config';

const getDifficultyClass = (difficultyId: string): string => {
  switch (difficultyId) {
    case 'easy':        return 'difficulty-easy';
    case 'easy-medium': return 'difficulty-easy-medium';
    case 'medium':      return 'difficulty-medium';
    case 'medium-hard': return 'difficulty-medium-hard';
    case 'hard':        return 'difficulty-hard';
    default:            return 'difficulty-easy';
  }
};

interface HabitItemProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggleComplete?: (id: string) => void;
  isCompleted?: boolean;
}

export function HabitItem({
  habit,
  onEdit,
  onDelete,
  onToggleComplete,
  isCompleted,
}: HabitItemProps) {
  const difficultyLabel = DIFFICULTIES[habit.difficultyId]?.label ?? habit.difficultyId;
  const difficultyClass = getDifficultyClass(habit.difficultyId);

  return (
    <tr className={isCompleted ? 'completed-habit' : ''}>
      <td className="habit-name">{habit.name}</td>

      <td>
        <span className={`difficulty-cell ${difficultyClass}`}>
          {difficultyLabel}
        </span>
      </td>

      <td>
        <div className="action-buttons">
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

          {isCompleted === false && (
            <button
              type="button"
              onClick={() => onEdit(habit)}
              className="action-button edit"
              title="Editar hábito"
            >
              ✏️
            </button>
          )}

          {isCompleted === false && (
            <button
              type="button"
              onClick={() => onDelete(habit.id)}
              className="action-button delete"
              title="Eliminar hábito"
            >
              🗑️
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

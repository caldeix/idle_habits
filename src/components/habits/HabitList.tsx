// Lista de hábitos genérica
// Esta lista se puede reutilizar tanto para la sección de "Por hacer" como para "Completados"

import type { Habit } from '../../features/habits/domain/habit.types';
import { HabitItem } from './HabitItem';

// Props que necesita la lista de hábitos
interface HabitListProps {
  // Título que se mostrará encima de la lista (ej: "Por hacer (hoy)" o "Completados (hoy)")
  title: string;
  // Lista de hábitos que se van a renderizar
  habits: Habit[];
  // Función de edición que se pasará a cada HabitItem
  onEdit: (habit: Habit) => void;
  // Función de borrado que se pasará a cada HabitItem
  onDelete: (id: string) => void;
  // Función opcional para marcar como completado/incompleto
  onToggleComplete?: (id: string) => void;
  // Indica si estos hábitos representan la lista de completados
  isCompleted?: boolean;
}

export function HabitList({
  title,
  habits,
  onEdit,
  onDelete,
  onToggleComplete,
  isCompleted,
}: HabitListProps) {
  // Si no hay hábitos en la lista, no mostramos nada para mantener la interfaz limpia
  if (!habits.length) return null;

  return (
    <section>
      {/* Título de la sección */}
      <h2>{title}</h2>

      {/* Lista desordenada de elementos HabitItem */}
      <ul>
        {habits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
            isCompleted={isCompleted}
          />
        ))}
      </ul>
    </section>
  );
}

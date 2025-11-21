// Lista de hábitos genérica
// Esta lista se puede reutilizar tanto para la sección de "Por hacer" como para "Completados"

import type { Habit } from '../../features/habits/domain/habit.types';
import { HabitItem } from './HabitItem';
import './HabitList.css';

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
    <div className="habits-container">
      <h2 className="habits-title">{title}</h2>
      
      <table className="habits-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dificultad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </div>
  );
}

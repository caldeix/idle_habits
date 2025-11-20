// Página de prueba para comprobar que toda la lógica de hábitos funciona correctamente
// Aquí conectamos el hook useHabits con los componentes de UI (formulario y listas)

import { HabitForm } from '../components/habits/HabitForm';
import { HabitList } from '../components/habits/HabitList';
import type { Habit } from '../features/habits/domain/habit.types';
import { useHabits } from '../features/habits/logic/useHabits';

export function HabitsTestPage() {
  // Obtenemos del hook useHabits:
  // - las listas filtradas de hábitos que tocan hoy (incompletos y completados)
  // - las funciones para crear, editar, eliminar y cambiar el estado de los hábitos
  const {
    todaysIncompleted,
    todaysCompleted,
    createHabit,
    editHabit,
    removeHabit,
    markCompleted,
    markIncompleted,
  } = useHabits();

  // Función que pasamos al formulario y que crea un hábito usando el hook
  const handleCreate = (habit: Habit) => {
    createHabit(habit);
  };

  // De momento, para editar simplemente volvemos a llamar a editHabit con el hábito que recibimos
  // Más adelante puedes abrir un modal o una página de edición con un formulario más completo
  const handleEdit = (habit: Habit) => {
    editHabit(habit);
  };

  return (
    <div>
      {/* Título de la página de pruebas */}
      <h1>Test de Hábitos</h1>

      {/* Formulario de prueba para crear nuevos hábitos */}
      <HabitForm onSubmit={handleCreate} />

      {/* Lista de hábitos por hacer hoy */}
      <HabitList
        title="Por hacer (hoy)"
        habits={todaysIncompleted}
        onEdit={handleEdit}
        onDelete={removeHabit}
        onToggleComplete={markCompleted}
        isCompleted={false}
      />

      {/* Lista de hábitos ya completados hoy */}
      <HabitList
        title="Completados (hoy)"
        habits={todaysCompleted}
        onEdit={handleEdit}
        onDelete={removeHabit}
        onToggleComplete={markIncompleted}
        isCompleted={true}
      />
    </div>
  );
}

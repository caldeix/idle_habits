import { HabitForm } from '../components/habits/HabitForm';
import { HabitList } from '../components/habits/HabitList';
import { useHabits } from '../features/habits/logic/useHabits';

export function MainPage() {
  const {
    todaysIncompleted,
    todaysCompleted,
    createHabit,
    editHabit,
    removeHabit,
    markCompleted,
    markIncompleted,
  } = useHabits();

  return (
    <div className="habits">
      <HabitForm onSubmit={createHabit} />

      <HabitList
        title="Por hacer (hoy)"
        habits={todaysIncompleted}
        onEdit={editHabit}
        onDelete={removeHabit}
        onToggleComplete={markCompleted}
        isCompleted={false}
      />

      <HabitList
        title="Completados (hoy)"
        habits={todaysCompleted}
        onEdit={editHabit}
        onDelete={removeHabit}
        onToggleComplete={markIncompleted}
        isCompleted={true}
      />
    </div>
  );
}

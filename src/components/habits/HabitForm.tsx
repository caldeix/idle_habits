// Formulario sencillo para crear hábitos de prueba
// Este componente SOLO se encarga de la parte visual y de recoger datos del usuario.
// La lógica de creación real está en el hook/useHabits y en la capa de dominio.

import { useState } from 'react';
import type { FormEvent } from 'react';
import type {
  Habit,
  HabitFrequency,
  Weekday,
} from '../../features/habits/domain/habit.types';

// Definimos las props que recibe el formulario
// onSubmit es una función que recibirá un Habit ya construido
// y se la pasaremos al hook useHabits
interface HabitFormProps {
  onSubmit: (habit: Habit) => void;
}

// Lista de días de la semana para mostrar los checkboxes cuando el hábito sea semanal
const weekdays: Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export function HabitForm({ onSubmit }: HabitFormProps) {
  // Estado local del formulario para el nombre del hábito
  const [name, setName] = useState('');
  // Estado local para la frecuencia seleccionada (daily, weekly, monthly)
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  // Estado local para los días de la semana seleccionados (solo aplica a hábitos semanales)
  const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);
  // Estado local para el día del mes (solo para hábitos mensuales)
  const [dayOfMonth, setDayOfMonth] = useState<number | undefined>();

  // Función para marcar o desmarcar un día de la semana en la lista de seleccionados
  const toggleWeekday = (day: Weekday) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Manejador del envío del formulario
  const handleSubmit = (event: FormEvent) => {
    // Evitamos que el formulario recargue la página
    event.preventDefault();

    // No permitimos crear hábitos sin nombre
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // Generamos un id único para el nuevo hábito usando la API de crypto del navegador
    const id = crypto.randomUUID();

    // Parte base común a todos los tipos de hábito
    const base: any = {
      id,
      name: trimmedName,
      createdAt: new Date().toISOString(),
      frequency,
    };

    // Construimos el hábito concreto según el tipo de frecuencia seleccionado
    let habit: Habit;

    if (frequency === 'weekly') {
      // Para hábitos semanales añadimos la lista de días seleccionados
      habit = {
        ...base,
        daysOfWeek: selectedDays,
      };
    } else if (frequency === 'monthly') {
      // Para hábitos mensuales añadimos el día de mes (si está definido)
      habit = {
        ...base,
        dayOfMonth,
      };
    } else {
      // Para hábitos diarios solo usamos la parte base
      habit = base as Habit;
    }

    // Llamamos a la función onSubmit pasada por props
    // para que el hook useHabits se encargue de guardar el hábito
    onSubmit(habit);

    // Limpiamos el formulario después de crear el hábito
    setName('');
    setSelectedDays([]);
    setDayOfMonth(undefined);
    setFrequency('daily');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo de texto para el nombre del hábito */}
      <input
        placeholder="Nombre del hábito"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      {/* Selector para elegir la frecuencia del hábito */}
      <select
        value={frequency}
        onChange={(event) =>
          setFrequency(event.target.value as HabitFrequency)
        }
      >
        <option value="daily">Diario</option>
        <option value="weekly">Semanal</option>
        <option value="monthly">Mensual</option>
      </select>

      {/* Lista de checkboxes solo visible cuando el hábito es semanal */}
      {frequency === 'weekly' && (
        <div>
          {weekdays.map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                checked={selectedDays.includes(day)}
                onChange={() => toggleWeekday(day)}
              />
              {day}
            </label>
          ))}
        </div>
      )}

      {/* Campo numérico solo visible cuando el hábito es mensual */}
      {frequency === 'monthly' && (
        <input
          type="number"
          min={1}
          max={31}
          value={dayOfMonth ?? ''}
          onChange={(event) =>
            setDayOfMonth(
              event.target.value ? Number(event.target.value) : undefined
            )
          }
          placeholder="Día del mes (1-31)"
        />
      )}

      {/* Botón para enviar el formulario y crear el hábito */}
      <button type="submit">Crear hábito</button>
    </form>
  );
}

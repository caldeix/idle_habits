// Formulario sencillo para crear hábitos de prueba
// Este componente SOLO se encarga de la parte visual y de recoger datos del usuario.
// La lógica de creación real está en el hook/useHabits y en la capa de dominio.

import { useState } from 'react';
import type { FormEvent } from 'react';
import './HabitForm.css';
import type {
  Habit,
  HabitFrequency,
  HabitDifficultyId,
  Weekday,
} from '../../features/habits/domain/habit.types';
import { DIFFICULTIES } from '../../features/habits/domain/difficulty.config';

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
  // Estado local para la dificultad seleccionada
  const [difficultyId, setDifficultyId] =
    useState<HabitDifficultyId>('easy');

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
      difficultyId,
      xpReward: DIFFICULTIES[difficultyId].xpReward,
      coinReward: DIFFICULTIES[difficultyId].coinReward,
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
    setDifficultyId('easy');
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <h2 className="form-title">Nuevo Hábito</h2>

      <div className="form-group">
        <label htmlFor="habit-name" className="form-label">
          Nombre del hábito
        </label>
        <input
          id="habit-name"
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Hacer ejercicio"
          required
          style={{ padding: "0.75rem 0" }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Dificultad</label>
        <select
          className="form-select"
          value={difficultyId}
          onChange={(event) =>
            setDifficultyId(event.target.value as HabitDifficultyId)
          }
        >
          {Object.values(DIFFICULTIES).map((difficulty) => (
            <option key={difficulty.id} value={difficulty.id}>
              {difficulty.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Frecuencia</label>
        <select
          className="form-select"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
        >
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensual</option>
        </select>
      </div>

      {frequency === 'weekly' && (
        <div className="form-group">
          <label className="form-label">Días de la semana</label>
          <div className="weekdays-container">
            {weekdays.map((day) => (
              <label key={day} className="weekday-label">
                <input
                  type="checkbox"
                  id={`day-${day}`}
                  className="weekday-checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={() => toggleWeekday(day)}
                />
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
            ))}
          </div>
        </div>
      )}

      {frequency === 'monthly' && (
        <div className="form-group">
          <label htmlFor="day-of-month" className="form-label">
            Día del mes (1-31)
          </label>
          <input
            id="day-of-month"
            type="number"
            min="1"
            max="31"
            className="form-input"
            value={dayOfMonth || ''}
            onChange={(e) => setDayOfMonth(Number(e.target.value) || undefined)}
          />
        </div>
      )}

      {/* Botón para enviar el formulario y crear el hábito */}
      <button type="submit" className="submit-button">
        Crear hábito
      </button>
    </form>
  );
}

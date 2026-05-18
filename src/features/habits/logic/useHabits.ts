import { useEffect, useState } from 'react';
import type { DailyHabit, Habit, HabitId, HabitState } from '../domain/habit.types';
import { loadHabitState, saveHabitState } from '../storage/habit.storage';
import { DIFFICULTIES } from '../domain/difficulty.config';
import { usePlayer } from '../../player/context/PlayerContext';
import {
  addHabit,
  completeHabit,
  deleteHabit,
  uncompleteHabit,
  updateHabit,
} from './habit.service';
import { isHabitForToday } from '../domain/habit.utils';

interface UseHabitsResult {
  state: HabitState;
  todaysIncompleted: Habit[];
  todaysCompleted: Habit[];
  createHabit: (habit: Habit) => void;
  editHabit: (habit: Habit) => void;
  removeHabit: (id: HabitId) => void;
  markCompleted: (id: HabitId) => void;
  markIncompleted: (id: HabitId) => void;
}

export const useHabits = (): UseHabitsResult => {
  const [state, setState] = useState<HabitState>(() => loadHabitState());
  const { addRewards } = usePlayer();

  useEffect(() => {
    saveHabitState(state);
  }, [state]);

  const createHabit = (habit: Habit) => {
    if (habit.frequency === 'weekly' && habit.daysOfWeek.length === 7) {
      const { daysOfWeek: _days, ...rest } = habit;
      const habitDaily = { ...rest, frequency: 'daily' } as DailyHabit;
      setState((prev) => addHabit(prev, habitDaily));
      return;
    }
    setState((prev) => addHabit(prev, habit));
  };

  const editHabit = (habit: Habit) => {
    setState((prev) => updateHabit(prev, habit));
  };

  const removeHabit = (id: HabitId) => {
    setState((prev) => deleteHabit(prev, id));
  };

  const markCompleted = (id: HabitId) => {
    const habitToComplete = state.incompleted.find((h) => h.id === id);
    if (!habitToComplete) return;

    const difficulty = DIFFICULTIES[habitToComplete.difficultyId];
    const xpReward = habitToComplete.xpReward ?? difficulty.xpReward;
    const coinReward = habitToComplete.coinReward ?? difficulty.coinReward;

    addRewards(xpReward, coinReward);
    setState((prev) => completeHabit(prev, id));
  };

  const markIncompleted = (id: HabitId) => {
    const habitToRevert = state.completed.find((h) => h.id === id);
    if (habitToRevert) {
      const difficulty = DIFFICULTIES[habitToRevert.difficultyId];
      const xpReward = habitToRevert.xpReward ?? difficulty.xpReward;
      const coinReward = habitToRevert.coinReward ?? difficulty.coinReward;
      addRewards(-xpReward, -coinReward);
    }
    setState((prev) => uncompleteHabit(prev, id));
  };

  const todaysIncompleted = state.incompleted.filter(isHabitForToday);
  const todaysCompleted = state.completed.filter(isHabitForToday);

  return {
    state,
    todaysIncompleted,
    todaysCompleted,
    createHabit,
    editHabit,
    removeHabit,
    markCompleted,
    markIncompleted,
  };
};

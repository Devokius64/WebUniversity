import { useState, useMemo } from 'react';

const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function useCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const calendar = useMemo(() => {
    const today = new Date();
    const days = [];

    // 30 дней в прошлом
    for (let i = 30; i > 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d);
    }

    // Сегодня
    days.push(new Date(today));

    // 30 дней в будущем
    for (let i = 1; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      days.push(d);
    }

    return days;
  }, []);

  // ИСПРАВЛЕНО: теперь формат YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDayName = (date) => {
    return dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1];
  };

  return {
    calendar,
    selectedDate,
    setSelectedDate,
    formatDate,
    getDayName
  };
}
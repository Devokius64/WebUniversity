import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getScheduleByGroupAndDate, getAllGroupsSchedule, getAllSubjects } from '../api/realApi';

export function useScheduleData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchSchedule = async () => {
      if (!user) {
        if (isMounted) {
          setData([]);
          setLoading(false);
        }
        return;
      }

      if (isMounted) setLoading(true);

      try {
        const today = new Date();
        const dates = [];
        for (let i = -30; i <= 30; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          dates.push(date.toISOString().split('T')[0]);
        }

        // Загружаем предметы для обогащения данных
        const subjects = await getAllSubjects();
        const subjectsMap = {};
        subjects.forEach(sub => {
          subjectsMap[sub.id] = sub;
        });

        let results = [];

        if (user.role === 'teacher') {
          const allGroupsSchedule = await getAllGroupsSchedule();
          results = dates.map(date => {
            const allLections = [];
            for (const groupName in allGroupsSchedule) {
              const groupSchedule = allGroupsSchedule[groupName];
              const daySchedule = groupSchedule.schedule?.[date] || [];
              
              // Обогащаем каждую лекцию данными о предмете
              const lectionsWithDetails = daySchedule.map(lesson => {
                const subject = subjectsMap[lesson.subjectId];
                return {
                  ...lesson,
                  name: subject?.name || 'Неизвестный предмет',
                  lector: subject?.teacher || 'Не указан',
                  description: subject?.description || '',
                  group: groupName
                };
              });
              
              allLections.push(...lectionsWithDetails);
            }
            return { day: date, lections: allLections };
          });
        } 
        else if (user.group) {
          const promises = dates.map(date => getScheduleByGroupAndDate(user.group, date));
          results = await Promise.all(promises);
        }
        else {
          results = dates.map(date => ({ day: date, lections: [] }));
        }

        if (isMounted) {
          setData(results);
          setError(null);
        }
      } catch (err) {
        console.error('Ошибка:', err);
        if (isMounted) {
          setError(err.error || 'Ошибка загрузки расписания');
          setData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSchedule();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { data, loading, error };
}
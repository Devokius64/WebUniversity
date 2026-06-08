import { useEffect, useRef, useState } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { useScheduleData } from '../hooks/useScheduleData';
import { useDragScroll } from '../hooks/useDragScroll';
import { useAuth } from '../context/AuthContext';
import { LessonModal } from './LessonModal';

export function Schedule() {
  const { calendar, selectedDate, setSelectedDate, formatDate, getDayName } = useCalendar();
  const { data, loading, error, refetch } = useScheduleData();
  const { containerRef, handlers } = useDragScroll();
  const { user } = useAuth();
  const buttonRefs = useRef({});
  const [isReady, setIsReady] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [modalGroupName, setModalGroupName] = useState(null);

  const selectedDateStr = formatDate(selectedDate);
  const todaySchedule = data.find(item => item.day === selectedDateStr);

  // Фильтрация для преподавателя
  let lections = [];
  if (todaySchedule?.lections) {
    if (user?.role === 'teacher') {
      lections = todaySchedule.lections.filter(lecture => 
        user.teacherSubjects?.includes(lecture.subjectId)
      );
    } else {
      lections = todaySchedule.lections;
    }
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleLectureClick = (lecture) => {
    // Для преподавателя передаём группу, для студента — нет
    if (user?.role === 'teacher') {
      setModalGroupName(lecture.group);
    }
    setSelectedLecture(lecture);
  };

  const closeModal = () => {
    setSelectedLecture(null);
    setModalGroupName(null);
    // Обновляем расписание после отметок посещаемости
    if (user?.role === 'teacher' && refetch) {
      refetch();
    }
  };

  const scrollToActiveDate = (behavior = 'smooth') => {
    const activeKey = formatDate(selectedDate);
    const activeButton = buttonRefs.current[activeKey];
    
    if (activeButton && containerRef.current) {
      const container = containerRef.current;
      const buttonRect = activeButton.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft = container.scrollLeft + (buttonRect.left - containerRect.left) - (containerRect.width / 2) + (buttonRect.width / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: behavior
      });
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!loading && calendar.length > 0) {
      setIsReady(true);
    }
  }, [loading, calendar]);

  useEffect(() => {
    if (isReady) {
      const tryScroll = (attempt = 1) => {
        const success = scrollToActiveDate('auto');
        if (!success && attempt < 5) {
          setTimeout(() => tryScroll(attempt + 1), 100);
        }
      };
      setTimeout(() => tryScroll(), 50);
    }
  }, [isReady, selectedDateStr]);

  useEffect(() => {
    if (isReady && !loading) {
      const timer = setTimeout(() => {
        scrollToActiveDate('smooth');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedDateStr, isReady, loading]);

  if (loading) {
    return <div className="parent"><p>Загрузка расписания...</p></div>;
  }

  if (error) {
    return <div className="parent"><p style={{ color: 'red' }}>Ошибка: {error}</p></div>;
  }

  return (
    <div className="parent">
      <div id="calendar_date">
        <p className="date_presented">{selectedDateStr}</p>
      </div>

      <div className="calendar style-scroll">
        <div
          id="calendar_table"
          className="slider"
          ref={containerRef}
          {...handlers}
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            padding: '10px',
            cursor: 'grab',
            scrollBehavior: 'smooth'
          }}
        >
          {calendar.map((date) => {
            const dateStr = formatDate(date);
            const isSelected = dateStr === selectedDateStr;
            return (
              <button
                key={dateStr}
                ref={el => {
                  if (el) {
                    buttonRefs.current[dateStr] = el;
                  }
                }}
                onClick={() => handleDateSelect(date)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: isSelected ? '#2E69FF' : '#353535',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  minWidth: '60px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'background-color 0.2s'
                }}
              >
                <div>{date.getDate()}</div>
                <div>{getDayName(date)}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="child">
        <div className="rasp__header">
          <p className="font__rasp__header">{getDayName(selectedDate)}, {selectedDateStr}</p>
        </div>
        <div className="rasp__table">
          <table id="table_rasp">
            <tbody>
              {lections.length > 0 ? (
                lections.map((lecture, idx) => (
                  <tr 
                    key={idx} 
                    style={{ borderBottom: '1px solid #444', cursor: 'pointer' }}
                    onClick={() => handleLectureClick(lecture)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#353535'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '12px', color: '#fff' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {lecture.name}
                      </div>
                      <div style={{ color: '#fff' }}>
                        {lecture.timeStart} - {lecture.timeEnd}, Ауд. {lecture.class}
                      </div>
                      {user?.role === 'user' && lecture.lector && (
                        <div style={{ color: '#fff', marginTop: '4px' }}>
                          {lecture.lector}
                        </div>
                      )}
                      {user?.role === 'teacher' && lecture.group && (
                        <div style={{ color: '#fff', marginTop: '6px' }}>
                          Группа: {lecture.group}
                        </div>
                      )}
                     </td>
                   </tr>
                ))
              ) : (
                <tr>
                  <td style={{ padding: '20px', color: '#aaa', textAlign: 'center' }}>
                    Нет занятий
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно */}
      {selectedLecture && (
        <LessonModal
          lecture={selectedLecture}
          groupName={modalGroupName}
          userRole={user?.role}
          onClose={closeModal}
          onAttendanceUpdate={() => refetch && refetch()}
        />
      )}
    </div>
  );
}
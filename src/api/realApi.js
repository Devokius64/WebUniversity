// src/api/realApi.js

const API_URL = 'http://localhost:3001';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Вход в систему
export const loginUser = async (login, password) => {
  await delay();
  // Используем поиск по логину, а пароль проверяем отдельно
  const response = await fetch(`${API_URL}/users?login=${login}`);
  const users = await response.json();
  
  const user = users.find(u => u.password === password);
  
  if (!user) {
    throw { error: "Неверный логин или пароль" };
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return {
    success: true,
    user: userWithoutPassword,
    token: "mock-token-" + Date.now()
  };
};

// Получить расписание группы на конкретную дату
export const getScheduleByGroupAndDate = async (group, date) => {
  await delay();
  const response = await fetch(`${API_URL}/groupsSchedule`);
  const allGroups = await response.json();
  
  const groupSchedule = allGroups[group];
  const daySchedule = groupSchedule?.schedule?.[date] || [];
  
  // Загружаем предметы для обогащения данных
  const subjectsRes = await fetch(`${API_URL}/subjects`);
  const subjects = await subjectsRes.json();
  const subjectsMap = {};
  subjects.forEach(sub => { subjectsMap[sub.id] = sub; });
  
  const lectionsWithDetails = daySchedule.map(lesson => ({
    ...lesson,
    name: subjectsMap[lesson.subjectId]?.name || "Неизвестный предмет",
    lector: subjectsMap[lesson.subjectId]?.teacher || "Не указан",
    teacherFullName: subjectsMap[lesson.subjectId]?.teacherFullName || subjectsMap[lesson.subjectId]?.teacher || "Не указан",
    description: subjectsMap[lesson.subjectId]?.description || ""
  }));
  
  return {
    day: date,
    lections: lectionsWithDetails
  };
};

// Получить расписание всех групп (для преподавателя)
export const getAllGroupsSchedule = async () => {
  await delay();
  const response = await fetch(`${API_URL}/groupsSchedule`);
  return response.json();
};

// Получить все предметы
export const getAllSubjects = async () => {
  await delay();
  const response = await fetch(`${API_URL}/subjects`);
  return response.json();
};

// Добавить предмет
export const addSubject = async (subjectData) => {
  await delay();
  const response = await fetch(`${API_URL}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subjectData)
  });
  return response.json();
};

// Удалить предмет
export const deleteSubject = async (subjectId) => {
  await delay();
  await fetch(`${API_URL}/subjects/${subjectId}`, { method: 'DELETE' });
  return { success: true };
};

// Добавить занятие в расписание
export const addLessonToSchedule = async (group, date, lessonData) => {
  await delay();
  const response = await fetch(`${API_URL}/groupsSchedule`);
  const db = await response.json();
  
  if (!db[group]) db[group] = { schedule: {} };
  if (!db[group].schedule[date]) db[group].schedule[date] = [];
  
  const newLesson = { id: Date.now(), ...lessonData };
  db[group].schedule[date].push(newLesson);
  
  await fetch(`${API_URL}/groupsSchedule`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(db)
  });
  
  return newLesson;
};

// Удалить занятие из расписания
export const deleteLessonFromSchedule = async (group, date, lessonId) => {
  await delay();
  const response = await fetch(`${API_URL}/groupsSchedule`);
  const db = await response.json();
  
  if (db[group]?.schedule[date]) {
    db[group].schedule[date] = db[group].schedule[date].filter(l => l.id !== lessonId);
    await fetch(`${API_URL}/groupsSchedule`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db)
    });
  }
  
  return { success: true };
};

// Получить все группы
export const getAllGroups = async () => {
  await delay();
  const response = await fetch(`${API_URL}/groupsSchedule`);
  const data = await response.json();
  return Object.keys(data);
};

// Получить всех пользователей
export const getAllUsers = async () => {
  await delay();
  const response = await fetch(`${API_URL}/users`);
  const users = await response.json();
  return users.map(({ password, ...user }) => user);
};

// Добавить пользователя
export const addUser = async (userData) => {
  await delay();
  // Проверяем, существует ли пользователь с таким логином
  const checkResponse = await fetch(`${API_URL}/users?login=${userData.login}`);
  const existing = await checkResponse.json();
  
  if (existing.length > 0) {
    throw { error: "Пользователь с таким логином уже существует" };
  }
  
  // Создаём нового пользователя
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...userData, id: Date.now() })
  });
  
  const newUser = await response.json();
  const { password, ...userWithoutPassword } = newUser;
  
  // Если группы нет в расписании — создаём
  const groupsResponse = await fetch(`${API_URL}/groupsSchedule`);
  const groupsSchedule = await groupsResponse.json();
  
  if (!groupsSchedule[userData.group]) {
    groupsSchedule[userData.group] = { schedule: {} };
    await fetch(`${API_URL}/groupsSchedule`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groupsSchedule)
    });
  }
  
  return userWithoutPassword;
};

// Получить всех студентов группы
export const getStudentsByGroup = async (groupName) => {
  await delay();
  const response = await fetch(`${API_URL}/users?role=user&group=${groupName}`);
  const students = await response.json();
  return students.map(({ password, ...student }) => student);
};

// Получить отметки для конкретной пары
export const getAttendanceForLesson = async (group, date, lessonId) => {
  await delay();
  const response = await fetch(`${API_URL}/attendance`);
  const attendance = await response.json();
  return attendance[group]?.[date]?.[lessonId] || {};
};

// Сохранить отметки для пары
export const saveAttendanceForLesson = async (group, date, lessonId, attendanceData) => {
  await delay();
  const response = await fetch(`${API_URL}/attendance`);
  const db = await response.json();
  
  if (!db[group]) db[group] = {};
  if (!db[group][date]) db[group][date] = {};
  
  db[group][date][lessonId] = attendanceData;
  
  await fetch(`${API_URL}/attendance`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(db)
  });
  
  return { success: true };
};

// Обновить аватар пользователя
export const updateUserAvatar = async (userId, base64Avatar) => {
  await delay();
  
  // Получаем всех пользователей
  const response = await fetch(`${API_URL}/users`);
  const users = await response.json();
  
  // Находим нужного пользователя
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw { error: "Пользователь не найден" };
  }
  
  // Обновляем аватар
  users[userIndex] = { ...users[userIndex], avatar: base64Avatar };
  
  // Сохраняем обратно
  await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(users[userIndex])
  });
  
  const { password, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword;
};

// Получить все новости
export const getAllNews = async () => {
  await delay();
  const response = await fetch(`${API_URL}/news`);
  return response.json();
};

// Добавить новость (для админа)
export const addNews = async (newsData) => {
  await delay();
  const response = await fetch(`${API_URL}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...newsData, id: Date.now() })
  });
  return response.json();
};

// Удалить новость (для админа)
export const deleteNews = async (newsId) => {
  await delay();
  await fetch(`${API_URL}/news/${newsId}`, { method: 'DELETE' });
  return { success: true };
};

// Получить предметы преподавателя по ID
export const getTeacherSubjects = async (teacherId) => {
  await delay();
  const userResponse = await fetch(`${API_URL}/users/${teacherId}`);
  const teacher = await userResponse.json();
  
  if (!teacher.teacherSubjects || teacher.teacherSubjects.length === 0) {
    return [];
  }
  
  const subjectsResponse = await fetch(`${API_URL}/subjects`);
  const allSubjects = await subjectsResponse.json();
  
  // Преобразуем teacherSubjects в строки для сравнения
  const teacherSubjectIds = teacher.teacherSubjects.map(id => String(id));
  
  // Фильтруем, также приводя subject.id к строке
  return allSubjects.filter(subject => teacherSubjectIds.includes(String(subject.id)));
};

// Обновить предмет (только для преподавателя его предметов)
export const updateSubject = async (subjectId, subjectData) => {
  await delay();
  const response = await fetch(`${API_URL}/subjects/${subjectId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subjectData)
  });
  return response.json();
};
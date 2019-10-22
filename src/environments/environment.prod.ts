const baseUrl = 'https://api.myradius.ru/';
const learning = baseUrl + 'platform-learning/api/';

/** Сервис авторизации, включает в себя хранение пользователей */
const auth = 'https://api.myradius.ru/auth/';

export const environment = {
  production: true,
  questionUrl: learning + 'question/',
  questionsUrl: learning + 'question/by-themes/',
  userQuestionsUrl: learning + 'answers/',
  themesUrl: learning + 'theme/',
  statisticUrl: learning + 'statistics',
  permissionsUrl: learning + 'permissions/',
  userStatisticUrl: learning + 'users_statistics',
  wsUrl: 'wss://ws.myradius.ru/realtime',
  settingsUrl: learning + 'settings/',
  settingsFrequencyURL: learning + 'frequency_options/'
};

const lsTokenKey = 'my_app_token';

function setToken(req) {
  const isAuthUrl = req.url.includes('auth');

  if (!isAuthUrl) {
    const token = localStorage.getItem(lsTokenKey);
    req.headers['x-access-token'] = token; // еще встречается заголовок 'authorization'
  }
  return req;
}

function setTokenOnLogin(res) {
  const isLoginUrl = res.config.url.includes('login');

  if (isLoginUrl) {
    const token = res.data.token;
    localStorage.setItem(lsTokenKey, token);
  }
  return res;
}

function getClearResponse(res) {
  return res.data; // из ответа нам требуется только data
}

function onError(err) {
  console.dir(err);
  return Promise.reject(err);
}

export default function (axios) {
  axios.interceptors.request.use(setToken);
  axios.interceptors.response.use(setTokenOnLogin);
  axios.interceptors.response.use(getClearResponse, onError); // данный метод неможет быть промежуточным т.к. он возвращет не ответ от сервера, а просто данные
}

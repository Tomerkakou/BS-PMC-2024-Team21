import { AuthModel } from './_models'
import { getRefreshToken } from './_requests'



const AUTH_LOCAL_STORAGE_KEY = 'learnix-react-v'
const getAuth = (): AuthModel | undefined => {
  if (!localStorage) {
    return
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel
    if (auth) {
      // You can easily check auth_token expiration also
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const setAuth = (auth: AuthModel) => {
  if (!localStorage) {
    return
  }

  try {
    const lsValue = JSON.stringify(auth)
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeAuth = () => {
  if (!localStorage) {
    return
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
  }
}

export function setupAxios(axios: any) {
  axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL!;
  axios.defaults.headers.Accept = 'application/json';

  let isRefreshing = false;
  let failedQueue: any[] = [];

  const addToFailedQueue = (promise: any) => {
    const timestamp = Date.now();
    failedQueue.push({ promise, timestamp });
  };

  const processTimeouts = () => {
    const now = Date.now();
    const threshold = 5000;  // 15 seconds

    failedQueue.forEach((item, index) => {
      if (now - item.timestamp >= threshold) {
        item.promise.reject(new Error('Timeout: Request not processed in time'));
        failedQueue.splice(index, 1);  // remove this item from the queue
      }
    });

    // Re-run this check every 5 seconds, or adjust as needed
    setTimeout(processTimeouts, 1000);
  };

  processTimeouts();  // Start the timeout processing

  const processQueue = (error: any, token: any = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.promise.reject(error);
      } else {
        prom.promise.resolve(token);
      }
    });

    failedQueue = [];
  };

  axios.interceptors.request.use(
    (config: any) => {
      const auth = getAuth();
      if (auth) {
        if (auth.accessToken && !isRefreshing) {
          config.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
      }

      return config;
    },
    (err: any) => Promise.reject(err)
  );

  axios.interceptors.response.use((response: any) => {
    return response;
  }, async function (error: any) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          addToFailedQueue({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        getRefreshToken(getAuth()!.accessToken, getAuth()!.refreshToken)
          .then(({ data }) => {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
            setAuth(data);
            processQueue(null, data.accessToken);
            resolve(axios(originalRequest));
          })
          .catch(err => {
            processQueue(err);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(error);
  });
}

export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth }


import axios, {AxiosError, AxiosRequestConfig} from "axios";
import * as SecureStore from 'expo-secure-store';

const BASE_URL = ''
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })

    failedQueue = []
}


export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

apiClient.interceptors.request.use(
    async (config) => {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => {
        return response
    },

    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (!error.response || !originalRequest) {
            return Promise.reject(error)
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({resolve, reject});
                }).then((token) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return apiClient(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }


            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = SecureStore.getItemAsync('refreshToken')

                if (!refreshToken) {
                    throw new Error('재발급 토큰이 없습니다.')
                }

                const rs = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refreshToken
                })

                const {accessToken: newAccessToken} = rs.data

                await SecureStore.setItemAsync('accessToken', newAccessToken)

                apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                }

                processQueue(null, newAccessToken)

                return apiClient(originalRequest)
            } catch (_error) {
                processQueue(_error, null)

                await SecureStore.deleteItemAsync('accessToken')
                await SecureStore.deleteItemAsync('refreshToken')

                console.log('재발급 토큰 만료')

                return Promise.reject(_error)
            } finally {
                isRefreshing = false
            }
        }
        return Promise.reject(error)
    }
)
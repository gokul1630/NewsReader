import axios, { AxiosRequestConfig } from 'axios'
export const apiCall = async ({ ...config }: AxiosRequestConfig) => {
	if (config) {
		const response = await axios(config)
		if (response.statusText === 'OK') {
			return Promise.resolve(response.data)
		} else {
			return Promise.reject(response)
		}
	}
}

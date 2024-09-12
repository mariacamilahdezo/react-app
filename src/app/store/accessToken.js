export function setAccessToken(axiosInstance, accessToken) {
	axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
	localStorage.setItem('accessToken', accessToken);
}
export function removeAccessToken(axiosInstance) {
	delete axiosInstance.defaults.headers.Authorization;
	localStorage.removeItem('accessToken');
}
export function getAccessTokenFromLocalStorage() {
	return localStorage.getItem('accessToken');
}

import { useState, useEffect, useCallback } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import _ from '@lodash';
import { useAppDispatch } from 'app/store/hooks';
import {
	updateUser,
	requestUserLogin,
	requestUserFromToken,
} from 'app/store/slices/user-slices/userSlice';
import { UserModel } from 'src/app/store/initialStates';
import { axiosInstance } from 'app/store/config';
import {
	setAccessToken,
	removeAccessToken,
	getAccessTokenFromLocalStorage,
} from 'app/store/accessToken';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';

const defaultAuthConfig = {
	tokenStorageKey: 'auth_access_token',
	signUpUrl: 'api/auth/sign-up',
	tokenRefreshUrl: 'api/auth/refresh',
	getUserUrl: 'api/auth/user',
	updateUserUrl: 'api/auth/user',
	updateTokenFromHeader: false,
};
/**
 * useAppAuth hook
 * Description: This hook handles the authentication flow using JWT
 * It uses axios to make the HTTP requests
 * It uses jwt-decode to decode the access token
 * It uses localStorage to store the access token
 * It uses Axios interceptors to update the access token from the response headers
 * It uses Axios interceptors to sign out the user if the refresh token is invalid or expired
 */
const useAppAuth = (props) => {
	const { config, onSignedIn, onSignedOut, onSignedUp, onError } = props;
	// Merge default config with the one from the props
	const authConfig = _.defaults(config, defaultAuthConfig);
	const dispatch = useAppDispatch();
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	/**
	 * Set session
	 */
	const setSession = useCallback((accessToken) => {
		if (accessToken) {
			setAccessToken(axiosInstance, accessToken);
		}
	}, []);

	const resetSession = useCallback(() => {
		removeAccessToken(axiosInstance);
	}, []);
	/**
	 * Get access token from local storage
	 */
	const getAccessToken = useCallback(() => {
		return getAccessTokenFromLocalStorage();
	}, []);
	/**
	 * Handle sign-in success
	 */
	const handleSignInSuccess = useCallback((userData, accessToken) => {
		setSession(accessToken);
		setIsAuthenticated(true);
		setUser(userData);
		onSignedIn(userData);
	}, []);
	/**
	 * Handle sign-up success
	 */
	const handleSignUpSuccess = useCallback((userData, accessToken) => {
		setSession(accessToken);
		setIsAuthenticated(true);
		setUser(userData);
		onSignedUp(userData);
	}, []);
	/**
	 * Handle sign-in failure
	 */
	const handleSignInFailure = useCallback((error) => {
		resetSession();
		setIsAuthenticated(false);
		setUser(null);
		handleError(error);
	}, []);
	/**
	 * Handle sign-up failure
	 */
	const handleSignUpFailure = useCallback((error) => {
		resetSession();
		setIsAuthenticated(false);
		setUser(null);
		handleError(error);
	}, []);
	/**
	 * Handle error
	 */
	const handleError = useCallback((error) => {
		onError(error);
	}, []);
	/**
	 * Check if the access token is valid
	 */
	const isTokenValid = useCallback((accessToken) => {
		if (accessToken) {
			try {
				const decoded = jwtDecode(accessToken);
				const currentTime = Date.now() / 1000;
				return decoded.exp > currentTime;
			} catch (error) {
				return false;
			}
		}

		return false;
	}, []);
	/**
	 * Check if the access token exist and is valid on mount
	 * If it is, set the user and isAuthenticated states
	 * If not, clear the session
	 */
	useEffect(() => {
		const attemptAutoLogin = async () => {
			const accessToken = getAccessToken();

			if (isTokenValid(accessToken)) {
				try {
					setIsLoading(true);
					const user = await dispatch(
						requestUserFromToken(accessToken),
					).unwrap();
					const initialState = UserModel();
					const userData = UserModel({ ...initialState });
					userData.data = { ...initialState.data, ...user };
					userData.uid = user.id;
					userData.role = user.role;
					userData.data.displayName =
						user.nombre ||
						user.username ||
						user.email ||
						user.identificacion;
					handleSignInSuccess(userData, accessToken);
					return true;
				} catch (error) {
					const axiosError = error;
					handleSignInFailure(axiosError);
					return false;
				}
			} else {
				resetSession();
				return false;
			}
		};

		if (!isAuthenticated) {
			attemptAutoLogin().then(() => {
				setIsLoading(false);
			});
		}
	}, [
		isTokenValid,
		setSession,
		handleSignInSuccess,
		handleSignInFailure,
		handleError,
		getAccessToken,
		isAuthenticated,
	]);
	/**
	 * Sign in
	 */
	const signIn = async (email, password) => {
		const accessToken = await dispatch(
			requestUserLogin({ email, password }),
		).unwrap();
		setSession(accessToken);
		const user = await dispatch(requestUserFromToken(accessToken)).unwrap();
		const initialState = UserModel();
		const userData = UserModel({ ...initialState });
		userData.data = { ...initialState.data, ...user };
		userData.uid = user.id;
		userData.role = user.role;
		userData.data.displayName =
			user.nombre || user.username || user.email || user.identificacion;

		handleSignInSuccess(userData, accessToken);
		return accessToken;
	};
	/**
	 * Sign up
	 */
	const signUp = useCallback((data) => {
		const response = axios.post(authConfig.signUpUrl, data);
		response.then(
			(res) => {
				const userData = res?.data?.user;
				const accessToken = res?.data?.access_token;
				handleSignUpSuccess(userData, accessToken);
				return userData;
			},
			(error) => {
				const axiosError = error;
				handleSignUpFailure(axiosError);
				return axiosError;
			},
		);
		return response;
	}, []);
	/**
	 * Sign out
	 */
	const signOut = useCallback(() => {
		resetSession();
		setIsAuthenticated(false);
		setUser(null);
		onSignedOut();
	}, []);
	/**
	 * Update user
	 */
	// const updateUser = useCallback(async (userData) => {
	// 	try {
	// 		const response = await axios.put(authConfig.updateUserUrl, userData);
	// 		const updatedUserData = response?.data;
	// 		onUpdateUser(updatedUserData);
	// 		return null;
	// 	} catch (error) {
	// 		const axiosError = error;
	// 		handleError(axiosError);
	// 		return axiosError;
	// 	}
	// }, []);
	/**
	 * Refresh access token
	 */
	const refreshToken = async () => {
		setIsLoading(true);
		try {
			const accessToken = await dispatch(
				requestUserLogin({ email, password }),
			).unwrap();

			if (accessToken) {
				setSession(accessToken);
				return accessToken;
			}

			return null;
		} catch (error) {
			const axiosError = error;
			handleError(axiosError);
			return axiosError;
		}
	};
	/**
	 * if a successful response contains a new Authorization header,
	 * updates the access token from it.
	 *
	 */

	useEffect(() => {
		// const accessToken = getAccessToken(); for refresh token

		if (isAuthenticated) {
			// Add interceptor to axiosInstance
			const UNAUTHORIZED = 401;
			// Unauthorized implies that the user is not authenticated: https://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses

			axiosInstance.interceptors.response.use(
				(response) => {
					return response;
				},
				(error) => {
					if (error.response) {
						const { status } = error.response;

						if (status === UNAUTHORIZED) {
							console.warn(
								'Unauthorized request. User was signed out.',
							);
							signOut();
							dispatch(
								showMessage({
									message:
										'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
									variant: 'warning',
								}),
							);
						}
					} else {
						// The request was made but no response was received
						console.warn('error', error.message);
					}

					return Promise.reject(error);
				},
			);
		}
	}, [isAuthenticated]);

	return {
		user,
		isAuthenticated,
		isLoading,
		signIn,
		signUp,
		signOut,
		updateUser,
		setIsLoading,
		refreshToken,
	};
};
export default useAppAuth;

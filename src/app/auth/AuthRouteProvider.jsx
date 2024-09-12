import { createContext, useCallback, useContext, useMemo } from 'react';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen/FuseSplashScreen';
import {
	resetUser,
	selectUser,
	selectUserRole,
	setUser,
	updateUser,
} from 'app/store/slices/user-slices/userSlice';
import BrowserRouter from '@fuse/core/BrowserRouter';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import useAppAuth from './services/useAppAuth';

const AuthContext = createContext({
	isAuthenticated: false,
});

function AuthRouteProvider(props) {
	const { children } = props;
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	/**
	 * Get user role from store
	 */
	const userRole = useAppSelector(selectUserRole);

	const authAppService = useAppAuth({
		config: {
			updateTokenFromHeader: true,
		},
		onSignedIn: (user) => {
			dispatch(setUser(user));
			setAuthService('myAuth');

			if (user.role === null) {
				dispatch(
					showMessage({
						message:
							'No hay un rol asignado a tu usuario, asígnalo antes de ingresar.',
						variant: 'warning',
					}),
				);
			}
		},
		onSignedOut: () => {
			dispatch(resetUser());
			resetAuthService();
		},
		onUpdateUser: (user) => {
			dispatch(updateUser(user));
		},
		onError: (error) => {
			// eslint-disable-next-line no-console
			console.warn(error);
		},
	});
	/**
	 * Check if services is in loading state
	 */
	const isLoading = useMemo(
		() => authAppService?.isLoading,
		[authAppService?.isLoading],
	);
	/**
	 * Check if user is authenticated
	 */
	const isAuthenticated = useMemo(
		() => authAppService?.isAuthenticated,
		[authAppService?.isAuthenticated],
	);
	/**
	 * Combine auth services
	 */
	const combinedAuth = useMemo(
		() => ({
			authAppService,
			signOut: () => {
				const authService = getAuthService();

				if (authService === 'myAuth') {
					return authAppService?.signOut();
				}

				return null;
			},
			updateUser: (userData) => {
				const authService = getAuthService();

				if (authService === 'myAuth') {
					return authAppService?.updateUser(userData);
				}

				return null;
			},
			isAuthenticated,
		}),
		[isAuthenticated, user],
	);
	/**
	 * Get auth service
	 */
	const getAuthService = useCallback(() => {
		return localStorage.getItem('authService');
	}, []);
	/**
	 * Set auth service
	 */
	const setAuthService = useCallback((authService) => {
		if (authService) {
			localStorage.setItem('authService', authService);
		}
	}, []);
	/**
	 * Reset auth service
	 */
	const resetAuthService = useCallback(() => {
		localStorage.removeItem('authService');
	}, []);

	/**
	 * Render loading screen while loading user data
	 */
	if (isLoading) {
		return <FuseSplashScreen />;
	}

	return (
		<AuthContext.Provider value={combinedAuth}>
			<BrowserRouter>
				<FuseAuthorization userRole={userRole}>
					{children}
				</FuseAuthorization>
			</BrowserRouter>
		</AuthContext.Provider>
	);
}

function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within a AuthRouteProvider');
	}

	return context;
}

export { useAuth, AuthRouteProvider };

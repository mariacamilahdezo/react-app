/* eslint-disable no-alert */
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import { useAuth } from 'src/app/auth/AuthRouteProvider';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { selectUserError } from 'app/store/slices/user-slices/userSlice';
import { useAppSelector, useAppDispatch } from 'app/store/hooks';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z
		.string()
		.email('Debes ingresar un email válido')
		.nonempty('Debes ingresar un email'),
	password: z
		.string()
		.min(
			4,
			'La contraseña es muy corta - debe ser de almenos 4 caracteres.',
		)
		.nonempty('Please enter your password.'),
});
const defaultValues = {
	email: '',
	password: '',
	remember: true,
};

function authSignInTab() {
	const userError = useAppSelector(selectUserError);
	const dispatch = useAppDispatch();
	const { authAppService } = useAuth();
	const { control, formState, handleSubmit, setValue, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema),
	});
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	const { isValid, dirtyFields, errors } = formState;
	useEffect(() => {
		setValue('email', '', {
			shouldDirty: true,
			shouldValidate: true,
		});
		setValue('password', '', {
			shouldDirty: true,
			shouldValidate: true,
		});
	}, [setValue]);

	function onSubmit(formData) {
		const { email, password } = formData;
		authAppService.signIn(email, password).catch((error) => {
			if (error.code === 'ERR_NETWORK') {
				setError('email', {
					type: 'manual',
					message: 'Error de conexión',
				});
				dispatch(
					showMessage({
						message: 'Error de conexión.',
						variant: 'error',
					}),
				);
			} else if (error.code === 'ERR_BAD_REQUEST') {
				dispatch(
					showMessage({
						message: 'Email o contraseña incorrectos.',
						variant: 'error',
					}),
				);
			} else {
				const errorData = error.response?.data;

				if (Array.isArray(errorData)) {
					errorData.forEach((err) => {
						setError(err.type, {
							type: 'manual',
							message: err.message,
						});
					});
				} else if (errorData) {
					setError('general', {
						type: 'manual',
						message: errorData.message,
					});
				}
			}
		});
	}

	return (
		<div className="w-full">
			<form
				name="loginForm"
				noValidate
				className="mt-32 flex w-full flex-col justify-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="Email"
							autoFocus
							type="email"
							error={!!errors.email}
							helperText={errors?.email?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Controller
					name="password"
					control={control}
					render={({ field }) => (
						<div className="relative">
							<TextField
								{...field}
								type={showPassword ? 'text' : 'password'}
								className="mb-24 w-full"
								label="Password"
							/>
							<IconButton
								className="absolute right-5 translate-y-[15%]"
								onClick={togglePasswordVisibility}
							>
								{showPassword ? (
									<VisibilityOffIcon />
								) : (
									<VisibilityIcon />
								)}
							</IconButton>
						</div>
					)}
				/>
				<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
					<Controller
						name="remember"
						control={control}
						render={({ field }) => (
							<FormControl>
								<FormControlLabel
									label="Remember me"
									control={
										<Checkbox
											size="small"
											{...field}
										/>
									}
								/>
							</FormControl>
						)}
					/>

					<Link
						className="text-md font-medium"
						to="/pages/auth/forgot-password"
					>
						Forgot password?
					</Link>
				</div>

				<Button
					variant="contained"
					color="secondary"
					className=" mt-16 w-full"
					aria-label="Sign in"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					type="submit"
					size="large"
				>
					Sign in
				</Button>
			</form>
		</div>
	);
}

export default authSignInTab;

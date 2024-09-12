import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
	'& > .logo-icon': {
		transition: theme.transitions.create(['width', 'height'], {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut,
		}),
	},
	'& > .badge': {
		transition: theme.transitions.create('opacity', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut,
		}),
	},
}));

/**
 * The logo component.
 */
function Logo() {
	return (
		<Root className="flex items-center">
			<img
				className="logo-icon h-56 w-100"
				// src="assets/images/logo/pymtech/logo_pymtech_C_white_removebg.png"
				src="assets/images/logo/tenants/logoinmobiliario.png"
				alt="logo"
			/>
		</Root>
	);
}

export default Logo;

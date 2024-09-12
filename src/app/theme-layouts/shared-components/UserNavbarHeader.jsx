import { darken, styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'app/store/slices/user-slices/userSlice';

const Root = styled('div')(({ theme }) => ({
	'& .username, & .email': {
		transition: theme.transitions.create('opacity', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut,
		}),
	},
	'& .avatar': {
		background: darken(theme.palette.background.default, 0.05),
		transition: theme.transitions.create('all', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut,
		}),
		bottom: 0,
		'& > img': {
			borderRadius: '50%',
		},
	},
}));

/**
 * The user navbar header.
 */
function UserNavbarHeader() {
	const user = useAppSelector(selectUser);
	return (
		<Root className="user relative flex flex-col items-center justify-center p-16 pb-14 shadow-0">
			<div className="mb-24 flex items-center justify-center">
				<Avatar
					sx={{
						backgroundColor: 'white',
						color: 'text.secondary',
						width: '200px',
					}}
					className="uppercase h-96 text-32 font-bold"
					// FIXME: Change the src to the user's avatar (OR tenant's logo)
					src="assets/images/logo/tenants/logoinmobiliario.png"
					alt={user.data.displayName}
					variant="rounded"
				>
					{user?.data?.displayName?.charAt(0)}
				</Avatar>
			</div>
			<Typography className="username whitespace-nowrap text-14 font-medium">
				{user?.data?.displayName}
			</Typography>
			<Typography
				className="email whitespace-nowrap text-13 font-medium"
				color="text.secondary"
			>
				{user.data.email}
			</Typography>
		</Root>
	);
}

export default UserNavbarHeader;

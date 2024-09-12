import { styled, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { blueGrey } from '@mui/material/colors';
import { memo, useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { usePrevious } from '@fuse/hooks';
import _ from '@lodash';
import { useAppSelector } from 'app/store/hooks';
import SettingsPanel from 'app/theme-layouts/shared-components/configurator/SettingsPanel';
import ThemesPanel from 'app/theme-layouts/shared-components/configurator/ThemesPanel';
import {
	selectIsUserGuest,
	selectUserSettings,
} from '../../../store/slices/user-slices/userSlice';
import { useAuth } from '../../../auth/AuthRouteProvider';

const Root = styled('div')(({ theme }) => ({
	position: 'absolute',
	height: 64,
	right: 0,
	top: 0,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	overflow: 'hidden',
	padding: 0,
	borderTopLeftRadius: 6,
	borderBottomLeftRadius: 6,
	borderBottomRightRadius: 0,
	borderTopRightRadius: 0,
	zIndex: 999,
	color: theme.palette.getContrastText(blueGrey[500]),
	backgroundColor: blueGrey[400],
	'&:hover': {
		backgroundColor: blueGrey[500],
	},
	'& .settingsButton': {
		'& > span': {
			animation: 'rotating 3s linear infinite',
		},
	},
	'@keyframes rotating': {
		from: {
			transform: 'rotate(0deg)',
		},
		to: {
			transform: 'rotate(360deg)',
		},
	},
}));

/**
 * The settings panel.
 */
function Configurator() {
	const theme = useTheme();
	const [open, setOpen] = useState('');
	const isUserGuest = useAppSelector(selectIsUserGuest);
	const userSettings = useAppSelector(selectUserSettings);
	const prevUserSettings = usePrevious(userSettings);
	const { updateUser } = useAuth();
	useEffect(() => {
		if (
			!isUserGuest &&
			prevUserSettings &&
			!_.isEqual(userSettings, prevUserSettings)
		) {
			updateUser({ data: { settings: userSettings } });
		}
	}, [isUserGuest, userSettings]);
	const handlerOptions = {
		onSwipedLeft: () =>
			Boolean(open) && theme.direction === 'rtl' && handleClose(),
		onSwipedRight: () =>
			Boolean(open) && theme.direction === 'ltr' && handleClose(),
	};
	const settingsHandlers = useSwipeable(handlerOptions);
	const schemesHandlers = useSwipeable(handlerOptions);
	const handleOpen = (panelId) => {
		setOpen(panelId);
	};
	const handleClose = () => {
		setOpen('');
	};
	return (
		<>
			<Root
				id="fuse-settings-panel"
				className="buttonWrapper"
			>
				<Button
					className="settingsButton m-0 h-32 w-32 min-w-32"
					onClick={() => handleOpen('settings')}
					variant="text"
					color="inherit"
					disableRipple
				>
					<span>
						<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>
					</span>
				</Button>

				<Button
					className="m-0 h-32 w-32 min-w-32"
					onClick={() => handleOpen('schemes')}
					variant="text"
					color="inherit"
					disableRipple
				>
					<FuseSvgIcon size={20}>
						heroicons-outline:color-swatch
					</FuseSvgIcon>
				</Button>
			</Root>

			<SettingsPanel
				open={Boolean(open === 'settings')}
				onClose={handleClose}
				settingsHandlers={settingsHandlers}
			/>

			<ThemesPanel
				schemesHandlers={schemesHandlers}
				onClose={handleClose}
				open={Boolean(open === 'schemes')}
			/>
		</>
	);
}

export default memo(Configurator);

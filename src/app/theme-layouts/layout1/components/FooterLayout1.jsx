import AppBar from '@mui/material/AppBar';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { memo } from 'react';
import { useAppSelector } from 'app/store/hooks';
import { selectFooterTheme } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import clsx from 'clsx';
import Footer from 'app/shared-components/general/Footer';

/**
 * The footer layout 1.
 */
function FooterLayout1(props) {
	const { className } = props;
	const footerTheme = useAppSelector(selectFooterTheme);
	return (
		<ThemeProvider theme={footerTheme}>
			<AppBar
				id="fuse-footer"
				className={clsx('relative z-0 shadow', className)}
				color="default"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? footerTheme.palette.background.paper
							: footerTheme.palette.background.default,
				}}
				elevation={0}
			>
				<Toolbar className="min-h-40 md:min-h-40 px-8 sm:px-10 py-0 flex items-center overflow-x-auto">
					<Footer />
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default memo(FooterLayout1);

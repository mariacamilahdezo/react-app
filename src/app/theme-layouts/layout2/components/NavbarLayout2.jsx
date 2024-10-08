import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
import Navigation from 'app/theme-layouts/shared-components/navigation/Navigation';
import Logo from '../../shared-components/Logo';

const Root = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.default,
	color: theme.palette.text.primary,
}));

/**
 * The navbar layout 2.
 */
function NavbarLayout2(props) {
	const { className = '' } = props;
	return (
		<Root
			className={clsx(
				'h-64 max-h-64 min-h-64 w-full shadow-md',
				className,
			)}
		>
			<div className="container z-20 flex h-full w-full flex-auto items-center justify-between p-0 lg:px-24">
				<div
					className="mx-4 my-30 flex flex-1 justify-center items-center rounded-lg"
					style={{ backgroundColor: 'white' }}
				>
					<Logo />
				</div>

				<FuseScrollbars className="flex h-full items-center">
					<Navigation
						className="w-full"
						layout="horizontal"
					/>
				</FuseScrollbars>
			</div>
		</Root>
	);
}

export default memo(NavbarLayout2);

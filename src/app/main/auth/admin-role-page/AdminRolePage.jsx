import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import HomeSummary from './tabs/HomeSummary';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
	},
}));

/**
 * AdminRolePage component renders the page for admin users.
 */
function AdminRolePage() {
	const [tabValue, setTabValue] = useState(0);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	return (
		<Root
			header={
				<div className="flex flex-1 items-center justify-between p-24">
					<Typography className="text-3xl md:text-4xl font-extrabold tracking-tight leading-7 sm:leading-10 truncate">
						Panel de visualización: Administrador
					</Typography>
				</div>
			}
			content={
				<div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
					<Tabs
						value={tabValue}
						onChange={handleChangeTab}
						indicatorColor="secondary"
						textColor="inherit"
						variant="scrollable"
						scrollButtons={false}
						className="w-full px-24 -mx-4 min-h-40"
						classes={{
							indicator:
								'flex justify-center bg-transparent w-full h-full',
						}}
						TabIndicatorProps={{
							children: (
								<Box
									sx={{ bgcolor: 'text.disabled' }}
									className="w-full h-full rounded-full opacity-20"
								/>
							),
						}}
					>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Estados de las órdenes"
						/>
					</Tabs>
					{tabValue === 0 && <HomeSummary />}
				</div>
			}
		/>
	);
}

export default AdminRolePage;

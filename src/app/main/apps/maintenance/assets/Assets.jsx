import GlobalStyles from '@mui/material/GlobalStyles';
import AssetsHeader from './AssetsHeader';
import AssetsTable from './AssetsTable';

/**
 * The assets page.
 */
function Assets() {
	return (
		<>
			<GlobalStyles
				styles={() => ({
					'#root': {
						maxHeight: '100vh',
					},
				})}
			/>

			<div className="w-full h-full container flex flex-col">
				<AssetsHeader />
				<AssetsTable />
			</div>
		</>
	);
}

export default Assets;

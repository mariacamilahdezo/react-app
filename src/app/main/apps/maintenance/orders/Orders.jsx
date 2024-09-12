import GlobalStyles from '@mui/material/GlobalStyles';
import HomeSummary from 'src/app/main/auth/admin-role-page/tabs/HomeSummary';
import OrdersHeader from './OrdersHeader';
import OrdersTable from './OrdersTable';

/**
 * The orders page.
 */
function Orders() {
	return (
		<>
			<GlobalStyles
				styles={() => ({
					'#root': {
						maxHeight: '100vh',
					},
				})}
			/>

			<div className="overflow-auto">
				<HomeSummary />
				<OrdersHeader />
				<OrdersTable />
			</div>
		</>
	);
}

export default Orders;

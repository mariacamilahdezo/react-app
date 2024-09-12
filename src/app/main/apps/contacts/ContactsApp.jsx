import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import ContactsHeader from './ContactsHeader';
import ContactsList from './ContactsList';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
	},
}));

/**
 * The ContactsApp page.
 */
function ContactsApp() {
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const isMobile = useThemeMediaQuery((theme) =>
		theme.breakpoints.down('lg'),
	);
	const [hasSearch, setHasSearch] = useState(false);

	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);
	return (
		<Root
			header={
				<ContactsHeader
					hasSearch={hasSearch}
					setHasSearch={setHasSearch}
				/>
			}
			content={
				<ContactsList
					hasSearch={hasSearch}
					setHasSearch={setHasSearch}
				/>
			}
			ref={pageLayout}
		/>
	);
}

export default ContactsApp;

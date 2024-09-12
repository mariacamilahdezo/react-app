import { motion } from 'framer-motion';
import FuseLoading from '@fuse/core/FuseLoading';
import { Typography, List } from '@mui/material';
import Alert from '@mui/material/Alert';

// Redux imports
import {
	selectUsers,
	selectUsersLoading,
	selectUsersError,
} from 'app/store/slices/user-slices/usersSlice';
import { useAppSelector } from 'app/store/hooks';

import ContactListItem from './ContactListItem';

/**
 * The contacts list.
 */
function ContactsList({ hasSearch, setHasSearch }) {
	const data = useAppSelector(selectUsers);
	const isError = useAppSelector(selectUsersError);
	const isLoading = useAppSelector(selectUsersLoading);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (isError) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Alert
					severity="error"
					variant="filled"
				>
					{isError.code === 'ERR_BAD_REQUEST'
						? 'Usuarios no encontrados'
						: 'Ocurrió un error!'}
				</Alert>
			</div>
		);
	}

	const initialMessage =
		'¡No has buscado aún! Ingresa al menos 3 letras o números.';
	const noResultsMessage = 'No se encontraron resultados.';

	if (data.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography
					color="text.secondary"
					variant="h5"
					className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center"
				>
					{hasSearch ? noResultsMessage : initialMessage}
				</Typography>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
			className="flex flex-col flex-auto w-full max-h-full"
		>
			<List className="w-full m-0 p-0">
				{data.map((item) => (
					<ContactListItem
						key={item.id}
						contact={item}
					/>
				))}
			</List>
		</motion.div>
	);
}

export default ContactsList;

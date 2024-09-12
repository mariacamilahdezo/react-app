import { Typography, Stack, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { ordersApi } from 'app/store/apiInstances';
import { NavLink } from 'react-router-dom';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { useAppDispatch } from 'app/store/hooks';

function Templates({ orderId }) {
	const [templates, setTemplates] = useState(null);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const fetchTemplates = async () => {
			const response =
				await ordersApi.getMaintenanceOrderTemplates(orderId);
			setTemplates(response.data); // Save the data to the state
		};

		fetchTemplates();
	}, [orderId]);

	const handleCopy = async (faq) => {
		try {
			await navigator.clipboard.writeText(faq);
			dispatch(
				showMessage({
					message: 'Mensaje copiado al portapapeles',
					variant: 'success',
				}),
			);
		} catch (err) {
			console.error('Failed to copy text:', err);
			dispatch(
				showMessage({
					message: 'No se pudo copiar el mensaje al portapapeles',
					variant: 'error',
				}),
			);
		}
	};

	const formatTitle = (title) => {
		return title
			.replace(/_/g, ' ') // Remove dashes
			.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	if (templates) {
		return (
			<>
				{templates.templates.map((template, index) => (
					<Stack
						key={index}
						border={0.2}
						borderRadius={2}
						p={2}
						bgcolor="background.paper"
						borderColor="grey.300"
						alignItems="center"
						m={2}
						spacing={2}
						sx={{ width: '100%', overflow: 'hidden' }}
					>
						<Typography variant="h6">
							{formatTitle(templates.titulo[index])}
						</Typography>
						<Typography
							sx={{
								whiteSpace: 'pre-line',
								overflow: 'scroll',
								width: '100%', // Add width here
							}}
						>
							{template}
						</Typography>
						{templates.titulo[index] === 'contacto_template' &&
						templates.redirect_link ? (
							<NavLink
								to={templates.redirect_link[index]}
								className="button"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button
									variant="contained"
									style={{
										backgroundColor: 'rgb(37, 211, 102)',
									}}
								>
									<img
										src="/assets/images/logo/wpp.svg"
										alt="wpp"
										width="32"
										style={{ marginRight: '10px' }}
									/>
									<p style={{ color: 'white' }}>Contactar</p>
								</Button>
							</NavLink>
						) : (
							<Button
								variant="contained"
								color="primary"
								onClick={() => handleCopy(template)}
							>
								Copiar respuesta
							</Button>
						)}
					</Stack>
				))}
			</>
		);
	}
}

export default Templates;

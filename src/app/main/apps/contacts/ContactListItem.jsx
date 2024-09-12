import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';

/**
 * The contact list item.
 */
function ContactListItem(props) {
	const { contact } = props;
	return (
		<>
			<ListItemButton
				className="px-32 py-16"
				sx={{ bgcolor: 'background.paper' }}
				// component={NavLinkAdapter}
				// to={`/apps/contacts/${contact.id}`} // TODO: No where for now
			>
				<ListItemAvatar>
					<Avatar
						alt={contact.nombre}
						src={contact.avatar}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{
						root: 'm-0',
						primary: 'font-medium leading-5 truncate',
					}}
					primary={
						<Typography style={{ userSelect: 'text' }}>
							{contact.nombre}
						</Typography>
					}
					secondary={
						<>
							<Typography
								className="inline"
								component="span"
								variant="body2"
								color="text.secondary"
							>
								{contact.identificacion}
							</Typography>
							{contact.celular && (
								<Typography
									className="inline px-5 text-blue-900"
									component="span"
									variant="body2"
									color="text.secondary"
								>
									Cel: {contact.celular}
								</Typography>
							)}
							<Typography
								className="inline px-5 text-gray-500" // Add this line
								component="span"
								variant="body2"
							>
								ID: {contact.id}
							</Typography>
						</>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default ContactListItem;

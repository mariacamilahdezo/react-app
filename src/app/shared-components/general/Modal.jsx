import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import {
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Dialog,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

export default function BasicModal({ handleClose, deleteLabel, label }) {
	const dispatch = useDispatch();
	const { open, title, content } = useSelector((state) => state.dialog);

	return (
		<Dialog
			open={open}
			onClose={() => dispatch(closeDialog())}
		>
			<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{content}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => dispatch(closeDialog())}
					color="primary"
				>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}

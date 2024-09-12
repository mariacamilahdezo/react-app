// Fuse and funciontality imports
import Timeline from '@mui/lab/Timeline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';

// React imports and components
import { useEffect, useState } from 'react';

// Redux imports
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import {
	createNewInmuebleComments,
	getInmuebleCommentsById,
	selectInmuebleComments,
} from 'app/store/slices/inmueble-slice/inmuebleCommentsSlice';
import { selectUser } from 'app/store/slices/user-slices/userSlice';
import Comments from './Comments';

function CommentsHandler({ assetId }) {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const [reload, setReload] = useState(false);
	const [newComment, setNewComment] = useState({
		description: '',
		inmueble_id: '',
		author_id: '',
	});

	useEffect(() => {
		if (assetId && assetId !== 'new') {
			dispatch(getInmuebleCommentsById(assetId));
		}
	}, [dispatch, assetId, reload]);

	const inmuebleComments = useAppSelector(selectInmuebleComments).map(
		(comment) => ({
			...comment,
			created_time: new Date(comment.created_time),
		}),
	);
	const handleReload = () => {
		setReload((prev) => !prev);
		setNewComment((prevState) => ({ ...prevState, description: '' })); // Clear the comment field
	};

	const handleSubmit = async () => {
		if (!newComment.description.trim()) {
			dispatch(
				showMessage({
					message: 'El comentario no puede estar vacío',
					variant: 'error',
				}),
			);
			return;
		}

		try {
			newComment.inmueble_id = assetId;
			newComment.author_id = user.uid;

			await dispatch(createNewInmuebleComments(newComment));

			dispatch(
				showMessage({
					message: 'Comentario agregado correctamente',
					variant: 'success',
				}),
			);

			handleReload();
		} catch (error) {
			dispatch(
				showMessage({
					message: 'No se pudo enviar el comentario',
					variant: 'error',
				}),
			);
			console.error('Failed to submit comment:', error);
		}
	};

	return (
		<div>
			<Box
				display="flex"
				alignItems="center"
				marginBottom={3}
			>
				<Box
					marginRight={4}
					marginLeft={3}
					flex={1}
				>
					<TextField
						label="Comentarios"
						variant="outlined"
						multiline
						maxRows={6}
						fullWidth
						required
						value={newComment.description}
						onChange={(e) =>
							setNewComment({
								...newComment,
								description: e.target.value,
							})
						}
					/>
				</Box>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSubmit}
				>
					Submit
				</Button>
			</Box>
			<Timeline
				className="py-20"
				position="right"
				sx={{
					'& .MuiTimelineItem-root:before': {
						display: 'none',
					},
				}}
			>
				{inmuebleComments
					? inmuebleComments.map((item, index) => (
							<Comments
								last={inmuebleComments.length === index + 1}
								item={item}
								key={item.id}
							/>
						))
					: null}
			</Timeline>
		</div>
	);
}

export default CommentsHandler;

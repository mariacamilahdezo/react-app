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
	createNewOrderComments,
	getOrderCommentsById,
	selectOrderComments,
} from 'app/store/slices/order-slices/orderCommentsSlice';
import { selectUser } from 'app/store/slices/user-slices/userSlice';
import Comments from './Comments';

function CommentsHandler({ orderId }) {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const [reload, setReload] = useState(false);
	const [newComment, setNewComment] = useState({
		description: '',
		order_id: '',
		author_id: '',
	});

	useEffect(() => {
		if (orderId && orderId !== 'new') {
			dispatch(getOrderCommentsById(orderId));
		}
	}, [dispatch, orderId, reload]);

	const orderComments = useAppSelector(selectOrderComments).map(
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
			newComment.order_id = orderId;
			newComment.author_id = user.uid;

			await dispatch(createNewOrderComments(newComment));
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
				{orderComments.map((item, index) => (
					<Comments
						last={orderComments.length === index + 1}
						item={item}
						key={item.id}
					/>
				))}
			</Timeline>
		</div>
	);
}

export default CommentsHandler;

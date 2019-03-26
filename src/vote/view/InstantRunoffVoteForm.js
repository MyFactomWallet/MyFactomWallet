import React from 'react';
import _get from 'lodash/get';
import _flowRight from 'lodash/flowRight';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import { INSTANT_RUNOFF_CONFIG } from '../create/VOTE_CONSTANTS';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Paper from '@material-ui/core/Paper';

/**
 * Constants
 */
const abstainCheckboxPath = 'abstainCheckbox';
const itemsPath = 'items';
const selectedPath = 'selected';

const parentVotePath = 'vote';

const optionsPath = 'pollJSON.vote.config.options';
const minOptionsPath = 'pollJSON.vote.config.minOptions';
const maxOptionsPath = 'pollJSON.vote.config.maxOptions';
const abstentionPath = 'pollJSON.vote.config.allowAbstention';

class InstantRunoffVoteForm extends React.Component {
	render() {
		const {
			poll,
			parentIsSubmitting,
			parentReset,
			parentSetFieldValue,
		} = this.props;

		const options = _get(poll, optionsPath);
		const allowAbstain = _get(poll, abstentionPath);
		const minOptions = _get(poll, minOptionsPath);
		const maxOptions = _get(poll, maxOptionsPath);

		const items = options.map((option) => ({
			id: option,
			content: option,
		}));

		return (
			<Formik
				enableReinitialize
				initialValues={{
					reinitialize: parentReset,
					abstainCheckbox: false,
					items: items,
					selected: [],
				}}
				render={({ values, handleChange, setFieldValue }) => {
					return (
						<Grid container>
							<Grid item xs={12}>
								<Typography>Type: {INSTANT_RUNOFF_CONFIG.name}</Typography>
								<Typography>Minimum Options Allowed: {minOptions}</Typography>
								<Typography>Maximum Options Allowed: {maxOptions}</Typography>
							</Grid>
							<Grid item xs={12}>
								<br />
								<DragAndDrop
									formValues={values}
									disabled={
										_get(values, abstainCheckboxPath) || parentIsSubmitting
									}
									irvSetFieldValue={setFieldValue}
									parentSetFieldValue={parentSetFieldValue}
								/>
							</Grid>
							{allowAbstain && (
								<Grid item xs={12}>
									<Divider />
									<FormControlLabel
										control={
											<Checkbox
												name={abstainCheckboxPath}
												checked={_get(values, abstainCheckboxPath)}
												disabled={parentIsSubmitting}
												onChange={(e) => {
													handleChange(e);

													parentSetFieldValue(
														abstainCheckboxPath,
														e.target.checked
													);

													if (e.target.checked) {
														//reset drag and drop
														setFieldValue(itemsPath, items);
														setFieldValue(selectedPath, []);

														//clear vote
														parentSetFieldValue(parentVotePath, []);
													}
												}}
											/>
										}
										label="Abstain"
									/>
								</Grid>
							)}
						</Grid>
					);
				}}
			/>
		);
	}
}

InstantRunoffVoteForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	destClone.splice(droppableDestination.index, 0, removed);

	const result = {};
	result[droppableSource.droppableId] = sourceClone;
	result[droppableDestination.droppableId] = destClone;

	return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: 'none',
	padding: 16,
	margin: `0 0 8px 0`,
	overflowWrap: 'break-word',

	// change background colour if dragging
	background: isDragging ? 'mediumpurple' : 'lightgrey',

	// styles we need to apply on draggables
	...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
	//background: isDraggingOver ? 'lightblue' : 'white',
	width: 250,
	minHeight: 50,
	paddingBottom: 10,
});

class DragAndDrop extends React.Component {
	/**
	 * A semi-generic way to handle multiple lists. Matches
	 * the IDs of the droppable container to the names of the
	 * source arrays stored in the state.
	 */
	id2List = {
		droppable: 'items',
		droppable2: 'selected',
	};

	getList = (id) => _get(this.props.formValues, this.id2List[id]);

	onDragEnd = async (result) => {
		const { source, destination } = result;

		// dropped outside the list
		if (!destination) {
			return;
		}

		if (source.droppableId === destination.droppableId) {
			const items = reorder(
				this.getList(source.droppableId),
				source.index,
				destination.index
			);

			await this.props.irvSetFieldValue(
				this.id2List[source.droppableId],
				items
			);
		} else {
			const result = move(
				this.getList(source.droppableId),
				this.getList(destination.droppableId),
				source,
				destination
			);

			this.props.irvSetFieldValue(itemsPath, result.droppable);
			await this.props.irvSetFieldValue(selectedPath, result.droppable2);
		}

		// update commit form value
		this.props.parentSetFieldValue(
			parentVotePath,
			_get(this.props.formValues, selectedPath).map((value) => value.content)
		);
	};

	render() {
		const { formValues, disabled } = this.props;

		const items = _get(formValues, itemsPath);
		const selected = _get(formValues, selectedPath);

		const titleStyle = disabled ? { color: 'grey' } : { fontWeight: 500 };

		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<Grid container spacing={24}>
					<Grid item xs={6}>
						<Paper style={{ padding: 10 }}>
							<Typography gutterBottom style={titleStyle}>
								Available Options
							</Typography>
							<Droppable droppableId="droppable">
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										style={getListStyle(snapshot.isDraggingOver)}
									>
										{items.map((item, index) => (
											<Draggable
												key={item.id}
												draggableId={item.id}
												index={index}
												isDragDisabled={disabled}
											>
												{(provided, snapshot) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														style={getItemStyle(
															snapshot.isDragging,
															provided.draggableProps.style
														)}
													>
														{item.content}
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</Paper>
					</Grid>
					<Grid item xs={6}>
						<Paper style={{ padding: 10 }}>
							<Typography gutterBottom style={titleStyle}>
								Selected Options
							</Typography>

							<Droppable droppableId="droppable2">
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										style={getListStyle(snapshot.isDraggingOver)}
									>
										{selected.map((item, index) => (
											<Draggable
												key={item.id}
												draggableId={item.id}
												index={index}
												isDragDisabled={disabled}
											>
												{(provided, snapshot) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														style={getItemStyle(
															snapshot.isDragging,
															provided.draggableProps.style
														)}
													>
														{index + 1 + ': ' + item.content}
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</Paper>
					</Grid>
				</Grid>
				<br />
			</DragDropContext>
		);
	}
}

const enhancer = _flowRight(withStyles(styles));
export default enhancer(InstantRunoffVoteForm);

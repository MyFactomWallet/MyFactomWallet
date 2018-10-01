import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Formik, Field, FastField, Form, FieldArray } from 'formik';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import Clear from '@material-ui/icons/Clear';
import Person from '@material-ui/icons/Person';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import get from 'lodash/get';
import SectionHeader from '../Shared/SectionHeader';

const selectedListPath = 'formFields.selectedList';
const workingVoterIDPath = 'formFields.workingVoterID';
const workingWeightPath = 'formFields.workingWeight';
const participantsPath = 'participantsJSON';

function Voter(id, weight, name, role) {
	this.id = id;
	this.weight = weight;
	this.name = name;
	this.role = role;
}

class SelectParticipants extends React.Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}

	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	render() {
		const { eligibleVotersForm, classes, updateParticipants } = this.props;
		/* const standingParties = this.state.standingParties.map((voter) => (
			<ListItem key={voter.name} divider>
				<Person />
				<ListItemText
					primary={voter.name}
					secondary={'Weight: ' + voter.weight}
				/>
				<Typography variant="caption">{voter.role}</Typography>
			</ListItem>
		)); */

		return (
			<Formik
				initialValues={eligibleVotersForm}
				onSubmit={(values, actions) => {
					updateParticipants(values);
					this.props.handleNext();

					//setTimeout(() => {
					//	alert(JSON.stringify(values, null, 2));
					//	actions.setSubmitting(false);
					//}, 1000);
				}}
				render={({ values, handleChange, setFieldValue, isSubmitting }) => (
					<Grid container className={classes.pad}>
						<Grid item xs={12}>
							{/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
							<SectionHeader text="Select Voters" />
						</Grid>
						<Grid item xs={12}>
							<Form onKeyPress={this.handleKeyPress}>
								<FieldArray
									name={participantsPath}
									render={(arrayHelpers) => (
										<Grid container>
											<Grid item xs={12} container>
												<Grid item xs={4}>
													<FormControl component="fieldset">
														<RadioGroup
															name={selectedListPath}
															value={get(values, selectedListPath)}
															onChange={handleChange}
														>
															<FormControlLabel
																value="standing"
																control={<Radio />}
																label="Standing Parties"
															/>
															<FormControlLabel
																value="anos"
																control={<Radio />}
																label="Authority Node Operators"
															/>
															<FormControlLabel
																value="guides"
																control={<Radio />}
																label="Guides"
															/>
															<FormControlLabel
																value="custom"
																control={<Radio />}
																label="Custom List"
															/>
														</RadioGroup>
													</FormControl>
												</Grid>
												{get(values, selectedListPath) === 'custom' ? (
													<Grid item xs={4} className={classes.borders}>
														<Typography variant="body2" gutterBottom>
															Add Voter
														</Typography>
														<Typography gutterBottom>
															Voter ID:&nbsp;
															<Field type="number" name={workingVoterIDPath} />
														</Typography>
														<Typography gutterBottom>
															Weight:&nbsp;&nbsp;&nbsp;
															<Field type="number" name={workingWeightPath} />
														</Typography>
														<input
															type="button"
															onClick={() => {
																arrayHelpers.push({
																	voterID: get(values, workingVoterIDPath),
																	weight: get(values, workingWeightPath),
																});
																setFieldValue(workingVoterIDPath, '');
																setFieldValue(workingWeightPath, '');
															}}
															value="Add"
															disabled={
																!get(values, workingVoterIDPath) ||
																!get(values, workingWeightPath)
															}
														/>
													</Grid>
												) : (
													<Grid item xs={4} />
												)}
												{get(values, selectedListPath) === 'custom' ? (
													<Grid item xs={4} className={classes.padLoadVoters}>
														<div>
															<Typography variant="body2" gutterBottom>
																Load Voters
															</Typography>
															<Typography gutterBottom>
																File: <input disabled type="file" />
															</Typography>
															<Typography>
																Voter Chain ID: <input disabled type="text" />
															</Typography>
															<Typography gutterBottom>
																Authority Nodes:
																<input disabled type="checkbox" />
																<br />
																Guides: <input disabled type="checkbox" />
															</Typography>
															<button disabled>Load</button>
														</div>
													</Grid>
												) : (
													<Grid item xs={5} />
												)}
											</Grid>

											{get(values, selectedListPath) === 'custom' && (
												<Grid item xs={12}>
													<Paper
														elevation={10}
														className={classes.listContainer}
													>
														<Typography variant="subheading">
															Eligible Voter List
														</Typography>
														<List className={classes.list} dense>
															{get(values, participantsPath).length > 0 ? (
																get(values, participantsPath).map(
																	(voter, index) => (
																		<ListItem
																			key={index}
																			disableGutters
																			divider
																		>
																			<Person />
																			<ListItemText
																				primary={'Voter ID: ' + voter.voterID}
																				secondary={'Weight: ' + voter.weight}
																			/>
																			<IconButton
																				onClick={() => {
																					arrayHelpers.remove(index);
																				}}
																				aria-label="Clear"
																			>
																				<Clear />
																			</IconButton>
																		</ListItem>
																	)
																)
															) : (
																<ListItem disableGutters divider>
																	<ListItemText
																		primary={'No Voters have been added'}
																	/>
																</ListItem>
															)}
														</List>
													</Paper>
												</Grid>
											)}
											{get(values, selectedListPath) === 'standing' && (
												<Grid item xs={12}>
													{/* 	<Paper elevation={10} className={classes.listContainer}>
									<Typography variant="subheading">
										Standing Party List
									</Typography>
	
									<List className={classes.list} dense>
										{standingParties}
									</List>
								</Paper> */}
												</Grid>
											)}
											<Grid item xs={12} className={classes.stepperButtons}>
												<br />
												<Button disabled onClick={this.props.handleBack}>
													Back
												</Button>
												<Button
													variant="raised"
													color="primary"
													type="submit"
													disabled={isSubmitting}
												>
													Next
												</Button>
											</Grid>
										</Grid>
									)}
								/>
							</Form>
						</Grid>
					</Grid>
				)}
			/>
		);
	}
}

SelectParticipants.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	pad: {
		padding: '15px',
	},
	list: {
		overflow: 'auto',
		height: 350,
	},
	borders: {
		borderRightStyle: 'solid',
		borderRightColor: 'lightgray',
		borderRightWidth: '1px',
		borderLeftStyle: 'solid',
		borderLeftColor: 'lightgray',
		borderLeftWidth: '1px',
		padding: '10px',
	},
	padLoadVoters: {
		padding: '10px',
	},
	listContainer: {
		marginTop: '10px',
		padding: '15px',
	},
	stepperButtons: {
		marginLeft: '-15px',
	},
});

export default withStyles(styles)(SelectParticipants);

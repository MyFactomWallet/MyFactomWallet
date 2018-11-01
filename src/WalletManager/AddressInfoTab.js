import React from 'react';
import _isEmpty from 'lodash/isEmpty';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import AddressInfoHeader from './shared/AddressInfoHeader';
import AddressInfoForm from './AddressInfoForm';
import TransactionList from './TransactionList';

const AddressInfoTab = (props) => {
	return (
		<div className={props.classes.root}>
			<AddressInfoHeader />
			<br />
			<Grid container spacing={8}>
				<Grid item xs={6}>
					<AddressInfoForm />
				</Grid>
				<Grid item xs={6}>
					<TransactionList />
				</Grid>
			</Grid>
		</div>
	);
};

AddressInfoTab.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	root: { textAlign: 'left' },
});

export default withStyles(styles)(AddressInfoTab);

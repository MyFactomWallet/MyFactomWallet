import React from 'react';
import Grid from '@material-ui/core/Grid';
import AddressInfoForm from './AddressInfoForm';
import AddressInfoHeader from './shared/AddressInfoHeader';
import TransactionList from './TransactionList';

const AddressInfoTab = () => {
	return (
		<Grid container>
			<Grid item xs={12}>
				<AddressInfoHeader />
				<br />
			</Grid>
			<Grid item xs={6}>
				<AddressInfoForm />
			</Grid>
			<Grid item xs={6}>
				<TransactionList />
			</Grid>
		</Grid>
	);
};

export default AddressInfoTab;

import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CreateLedgerIdForm from './CreateLedgerIdForm';
import SetLedgerIdForm from './SetLedgerIdForm';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

class LedgerIdentityManager extends React.Component {
	state = {
		tabValue: 0,
	};

	handleChange = (event, tabValue) => {
		this.setState({ tabValue });
	};

	render() {
		const { classes } = this.props;

		return (
			<Grid container justify="center">
				<Grid item xs={8}>
					<Paper elevation={3} className={classes.paper}>
						<Grid item container xs={12} justify="center">
							<Typography variant="h5" gutterBottom>
								Ledger Identity Manager
							</Typography>
						</Grid>
						<Paper elevation={3} className={classes.paper}>
							<Tabs
								value={this.state.tabValue}
								onChange={this.handleChange}
								indicatorColor="primary"
								textColor="primary"
								centered
							>
								<Tab label="Create Identity" />
								<Tab label="Set Identity" />
							</Tabs>
							<br />
							{this.state.tabValue === 0 && <CreateLedgerIdForm />}
							{this.state.tabValue === 1 && <SetLedgerIdForm />}
						</Paper>
					</Paper>
				</Grid>
			</Grid>
		);
	}
}

LedgerIdentityManager.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({ paper: { minWidth: 565, padding: 16 } });

export default withStyles(styles)(LedgerIdentityManager);

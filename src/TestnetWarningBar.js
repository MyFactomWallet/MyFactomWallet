import React from 'react';
import PropTypes from 'prop-types';
import _flowRight from 'lodash/flowRight';
import { withNetwork } from './context/NetworkContext';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';

function TestnetWarningBar(props) {
	const {
		classes,
		networkController: { networkProps },
	} = props;

	if (networkProps.network === 'testnet') {
		return (
			<>
				<CssBaseline />
				<div className={classes.toolbarSpace} />
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar className={classes.toolbar}>
						<WarningIcon className={classes.warningIcon} />
						<Typography data-cy="testnetWarning" variant="h3">
							You are connected to the Factom <b>Testnet</b>
						</Typography>
						&nbsp;
						<WarningIcon className={classes.warningIcon} />
					</Toolbar>
				</AppBar>
			</>
		);
	} else {
		return null;
	}
}

TestnetWarningBar.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	appBar: {
		top: 'auto',
		bottom: 0,
		minHeight: 78,
		paddingTop: 9,
		backgroundColor: '#ffa000',
	},
	toolbar: {
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	warningIcon: {
		fontSize: 52,
	},
	toolbarSpace: {
		height: 85,
	},
});

const enhancer = _flowRight(withNetwork, withStyles(styles));
export default enhancer(TestnetWarningBar);

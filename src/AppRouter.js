import { HashRouter as Router, Route } from 'react-router-dom';
import _flowRight from 'lodash/flowRight';
import React, { Component } from 'react';
import { withWalletContext } from './context/WalletContext';
import WalletManager from './walletManager/WalletManager';
import AddInitialWallet from './addWallet/AddInitialWallet';
import Vote from './vote/listing/VoteListing';
import ViewVote from './vote/view/ViewVote';
import CreateVoteStepper from './vote/create/CreateVoteStepper';
import Typography from '@material-ui/core/Typography';
//import Help from './help/Help';
//import ManageVoterList from './vote/voterList/ManageVoterList.js';
//import LandingPage from './landingPage/LandingPage';
//import Header from './header/Header';

class AppRouter extends Component {
	state = { readyToManage: false };

	componentDidMount() {
		this.setState({
			readyToManage: !this.props.walletController.isWalletEmpty(),
		});
	}

	setReadyToManage = (value) => {
		this.setState({
			readyToManage: value,
		});
	};

	render() {
		const {
			walletController: { isWalletEmpty },
		} = this.props;

		return (
			<Router>
				<React.Fragment>
					<Route
						exact
						path="/"
						render={() =>
							this.state.readyToManage && !isWalletEmpty() ? (
								<WalletManager />
							) : (
								<AddInitialWallet setReadyToManage={this.setReadyToManage} />
							)
						}
					/>

					{/*
						<Route exact path="/vote" component={ComingSoon} />
						<Route
								exact
								path="/createVote"
								component={ComingSoon}
						/>
                	*/}

					<Route exact path="/vote" component={Vote} />
					<Route exact path="/viewVote" component={ViewVote} />
					<Route exact path="/createVote" component={CreateVoteStepper} />
					{/* 
					<Route exact path="/manageVoters" component={ManageVoterList} /> 
					<Route exact path="/help" component={Help} />
					<Route exact path="/" component={LandingPage} />
					<Route path="/wallet/manage/" component={WalletManager} />
					*/}
				</React.Fragment>
			</Router>
		);
	}
}

const ComingSoon = () => {
	return (
		<Typography variant="h5" align="center">
			Coming soon...
		</Typography>
	);
};

const enhancer = _flowRight(withWalletContext);

export default enhancer(AppRouter);

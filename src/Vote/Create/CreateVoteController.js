import React from 'react';

export class CreateVoteController extends React.Component {
	state = {
		pollConfiguration: {
			title: '',
			type: '',
			options: [],
			href: '',
			hash: '',
			commitStartDate: '',
			commitEndDate: '',
			revealStartDate: '',
			revealEndDate: '',
			minTurnout: false,
			minSupport: false,
			protocolVersion: '',
			pollAdminID: '',
		},
		examplePoll: {
			title: 'This is the Title of the Poll',
			type: 'Single Option Voting',
			href:
				'https://raw.githubusercontent.com/JacobEberhardt/ZoKrates/aa7e11/README.md',
			hash: 'F30A765AD6C5777E82EB2B64CFA53CDBB08D435546DD351880C13691867290B4',
			commitStartDate: '09/10/2018',
			commitEndDate: '09/11/2018',
			revealStartDate: '09/12/2018',
			revealEndDate: '09/13/2018',
			minTurnout: false,
			minSupport: false,
		},
	};

	updatePoll = (poll) => {
		this.setState({ pollConfiguration: poll });
	};

	render() {
		return this.props.children({
			...this.state,
			updatePoll: this.updatePoll,
		});
	}
}

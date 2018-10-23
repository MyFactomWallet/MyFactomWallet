import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Warning from '@material-ui/icons/Warning';

class ConfirmationDialogRaw extends React.Component {
	constructor(props) {
		super();
		this.state = {
			value: props.value,
		};
	}

	// TODO
	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.props.value) {
			this.setState({ value: nextProps.value });
		}
	}

	handleAgree = () => {
		this.props.onClose(this.state.value);
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	render() {
		const { classes, value, ...other } = this.props;

		return (
			<Dialog
				disableBackdropClick
				disableEscapeKeyDown
				aria-labelledby="confirmation-dialog-title"
				{...other}
			>
				<DialogTitle
					align="center"
					className={classes.dialogTitle}
					style={{ backgroundColor: '#f50057' }}
				>
					<Warning fontSize="large" />
				</DialogTitle>
				<DialogContent>
					<br />
					<Typography variant="h5" align="center">
						Important
					</Typography>
					<br />
					<Typography>
						<b>MyFactomWallet.com (MFW)</b> is a client-side interface wallet.
						We provide the user with access to the blockchain, but we do not
						store, control or have access to ANY user wallet or blockchain
						information including keys, transaction data, or passwords.
						Therefore,&nbsp;
						<b>
							MFW/we cannot reverse transactions, recover funds, or reset
							passwords.&nbsp;
						</b>
						MyFactomWallet.com is not a bank or a custodian. Your assets and
						your security are entirely your own responsibility. By creating your
						wallet though MyFactomWallet.com or by clicking 'accept' at the
						bottom, you agree to the following notices.
					</Typography>
					<Typography variant="h5" align="center">
						Notices
					</Typography>

					<ul>
						<li>
							<Typography>
								When you create a wallet on MyFactomWallet.com you generate a
								cryptographic set of numbers: your private keys/seed and your
								public key (address);
							</Typography>
						</li>
						<li>
							<Typography>
								The handling of your keys is solely your responsibility. It
								happens entirely on your computer, inside your browser;
							</Typography>
						</li>
						<li>
							<Typography>
								We never transmit, receive or store your private key, password,
								or seed;
							</Typography>
						</li>
						<li>
							<Typography>
								We do not charge a transaction fee (blockchain fees still
								apply);
							</Typography>
						</li>
						<li>
							<Typography>
								We are not a custodian and have no information about or control
								over your factoids or entry credits;
							</Typography>
						</li>
						<li>
							<Typography>
								You are simply using our interface to interact directly with the
								blockchain;
							</Typography>
						</li>
						<li>
							<Typography>
								If you send your public key (address) to someone, they can send
								you FCT or tokens;
							</Typography>
						</li>
						<li>
							<Typography>
								If you send your private key to someone, they now have full
								control of your account, and can withdraw your funds;
							</Typography>
						</li>
						<li>
							<Typography>
								This project is under active development; there is always the
								possibility something unexpected happens that causes your funds
								to be lost, including but not limited to third party domain
								attacks. Please do not invest more than you are willing to lose,
								and please be careful.We are not responsible for any loss;
							</Typography>
						</li>
						<li>
							<Typography>
								We are not a custodian. Your funds are stored on the blockchain
								and protected by your private key. As explained above, your
								private key is solely your responsibility and MyFactomWallet.com
								does not store or have access to any of your keys;
							</Typography>
						</li>
						<li>
							<Typography>
								Offered under MIT License Copyright © 2015-2018: THE SOFTWARE IS
								PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
								IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
								MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
								NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
								HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
								WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
								FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
								OTHER DEALINGS IN THE SOFTWARE. The above copyright notice and
								this permission notice shall be included in all copies or
								substantial portions of the Software
							</Typography>
						</li>
					</ul>
					<Typography variant="h5" align="center">
						Important Tips
					</Typography>

					<ul>
						<li>
							<Typography>
								Never hand-type your public or private address.
							</Typography>
						</li>
						<li>
							<Typography>
								Always send a small amount of Factoids first to ensure that the
								transaction is processed correctly and the Factoids end up in
								the correct address. After verifying this, you may send the full
								amount of Factoids.
							</Typography>
						</li>
						<li>
							<Typography>
								If you generated a new Factoid or Entry Credit address in
								MyFactomWallet.com; save and back up the associated SEED BEFORE
								you send any funds to it.
							</Typography>
						</li>
						<li>
							<Typography>
								Do not post your private key or seed on any social media,
								chat-platforms, email/sms it, or store it in any cloud storage
								service (Google Drive, Dropbox etc).
							</Typography>
						</li>
						<li>
							<Typography>
								Use a Hardware wallet for added protection (Ledger Nano S
								supported at this time).
							</Typography>
						</li>
						<li>
							<Typography>
								Regularly monitor the security of your computer operating system
								to ensure that it is not compromised by malicious software
								whereby unauthorized third parties may obtain your private key
								or seed.
							</Typography>
						</li>
						<li>
							<Typography>
								Ensure that you are not on a phishing site, but have landed on
								the correct page (verify that you are on
								https://www.myfactomwallet.com in the browser, and also check
								that the “lock” symbol is displayed in the Chrome address bar).
							</Typography>
						</li>
						<li>
							<Typography>
								The user must understand that MyFactomWallet.com/we CANNOT:
							</Typography>
							<ul>
								<li>Access your wallet or send your funds for you</li>
								<li>Recover or change your private key or seed</li>
								<li>Reverse, cancel, or refund any transactions</li>
								<li>Freeze FCT or Entry Credit addresses</li>
							</ul>
						</li>
					</ul>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleAgree} color="primary">
						Agree
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

ConfirmationDialogRaw.propTypes = {
	onClose: PropTypes.func,
	value: PropTypes.string,
};

const styles = (theme) => ({
	root: {
		width: '100%',
		maxWidth: 600,
		backgroundColor: theme.palette.background.paper,
	},
	paper: {
		width: '100%',
		maxHeight: 435,
	},
});

class ConfirmationDialog extends React.Component {
	state = {
		open: true,
		value: 'Done',
	};

	handleClose = (value) => {
		this.setState({ value, open: false });
	};

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<ConfirmationDialogRaw
					classes={{
						paper: classes.paper,
					}}
					open={this.state.open}
					onClose={this.handleClose}
					value={this.state.value}
				/>
			</div>
		);
	}
}

ConfirmationDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ConfirmationDialog);

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Warning from '@material-ui/icons/Warning';

function ConfirmationDialogRaw(props) {
	const { handleClose, ...other } = props;

	return (
		<Dialog
			disableBackdropClick
			disableEscapeKeyDown
			aria-labelledby="confirmation-dialog-title"
			{...other}
		>
			<DialogTitle align="center" style={{ backgroundColor: '#f50057' }}>
				<Warning fontSize="large" />
			</DialogTitle>
			<DialogContent>
				<br />
				<Typography variant="h5" align="center">
					Important
				</Typography>
				<br />
				<Typography>
					MyFactomWallet.com is a client-side interface wallet. We provide the
					user with access to the Factom blockchain, but we do not store,
					control or have access to ANY user wallet or blockchain information
					including keys or transaction data. Therefore,&nbsp;
					<b>we cannot reverse transactions or recover funds.</b>
					&nbsp; MyFactomWallet.com is not a bank or a custodian. Your assets
					and your security are entirely your own responsibility. By using
					MyFactomWallet.com and/or by clicking 'accept' at the bottom, you
					agree to the following notices:
				</Typography>
				<Typography variant="h5" align="center">
					Notices
				</Typography>
				<ul>
					<li>
						<Typography>
							This project is under active development; there is always the
							possibility something unexpected happens that causes your funds to
							be lost, including but not limited to third party domain attacks.{' '}
							<b>We are not responsible for any loss.</b>
						</Typography>
					</li>
					<li>
						<Typography>
							Never send funds from a mainnet address to a testnet address and
							vice versa. Sending Factoids to the testnet will likely result in
							a loss of factoids. You acknowledge that testnet Testoids and Test
							Credits have no value.
						</Typography>
					</li>
					<li>
						<Typography>
							When you create new Factoid or Entry Credit addresses on
							MyFactomWallet.com, a random 12-word cryptographic seed phrase is
							generated in the browser, and is used to generate new addresses
							and sign transactions.
						</Typography>
					</li>
					<li>
						<Typography>
							The handling of your private keys or seed phrase is solely your
							responsibility. It happens entirely on your computer, inside your
							browser.
						</Typography>
					</li>
					<li>
						<Typography>
							We never transmit, receive or store your private keys or seeds.
						</Typography>
					</li>
					<li>
						<Typography>
							We do not charge a transaction fee (blockchain fees still apply).
						</Typography>
					</li>
					<li>
						<Typography>
							We are not a custodian and have no information about or control
							over your Factoids or Entry Credits.
						</Typography>
					</li>
					<li>
						<Typography>
							You are simply using our interface to interact directly with the
							blockchain.
						</Typography>
					</li>
					<li>
						<Typography>
							If you provide your public key (address) to someone, they can
							transfer Factoids to you.
						</Typography>
					</li>
					<li>
						<Typography>
							If you provide your private key or seed phrase to a person or
							entity, then that person or entity has full control of your
							account, and may withdraw your funds.
						</Typography>
					</li>
					<li>
						<Typography>
							We are not a custodian. Your funds are stored on the blockchain
							and protected by your private key and/or seed phrase. As explained
							above, your private key is solely your responsibility and
							MyFactomWallet.com does not store or have access to any of your
							keys.
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
							WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
							OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
							DEALINGS IN THE SOFTWARE. The above copyright notice and this
							permission notice shall be included in all copies or substantial
							portions of the Software.
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
							transaction is processed correctly and the Factoids end up in the
							correct address. After verifying this, you may send the full
							amount of Factoids.
						</Typography>
					</li>
					<li>
						<Typography>
							If you generated a new Factoid or Entry Credit address in
							MyFactomWallet.com; save and back up the associated seed BEFORE
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
							Use a hardware wallet for added protection (Ledger Nano X/S
							supported at this time).
						</Typography>
					</li>
					<li>
						<Typography>
							Regularly monitor the security of your computer operating system
							to ensure that it is not compromised by malicious software whereby
							unauthorized third parties may obtain your private key or seed.
						</Typography>
					</li>
					<li>
						<Typography>
							Ensure that you are not on a phishing site, but have landed on the
							correct page (verify that you are on
							https://www.myfactomwallet.com in the browser, and also check that
							the “lock” symbol is displayed in the Chrome address bar).
						</Typography>
					</li>
					<li>
						<Typography>
							The user must understand that MyFactomWallet.com CANNOT:
						</Typography>
						<ul>
							<li>
								<Typography>
									Access your wallet or send your funds for you
								</Typography>
							</li>
							<li>
								<Typography>
									Recover or change your private key or seed
								</Typography>
							</li>
							<li>
								<Typography>
									Reverse, cancel, or refund any transactions
								</Typography>
							</li>
							<li>
								<Typography>Freeze FCT or Entry Credit addresses</Typography>
							</li>
						</ul>
					</li>
				</ul>
			</DialogContent>
			<DialogActions>
				<Button
					data-cy="disclaimer-accept"
					onClick={handleClose}
					color="primary"
				>
					Accept
				</Button>
			</DialogActions>
		</Dialog>
	);
}

ConfirmationDialogRaw.propTypes = {
	handleClose: PropTypes.func,
};

function ConfirmationDialog(props) {
	const [open, setOpen] = useState(true);

	function handleClose() {
		setOpen(false);
	}

	return <ConfirmationDialogRaw open={open} handleClose={handleClose} />;
}

export default ConfirmationDialog;

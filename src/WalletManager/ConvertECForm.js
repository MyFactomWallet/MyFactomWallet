import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { withFactomCli } from '../Context/FactomCliContext';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import WalletInfoHeader from './Shared/WalletInfoHeader';

import {
	isValidFctPrivateAddress,
	isValidEcPublicAddress,
} from 'factom/dist/factom-struct';
import { withWalletContext } from '../Context/WalletContext';

const entryCreditAmountPath = 'entryCreditAmount';
const recipientAddressPath = 'recipientAddress';
const myFctWalletAnchorElPath = 'myFctWalletAnchorEl';
const privateKeyPath = 'privateKey';

class ConvertECForm extends Component {
	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	render() {
		const { classes } = this.props;
		const {
			ecWallets,
			getActiveFctWallet,
			updateBalances,
		} = this.props.walletController;
		const activeFctWallet = getActiveFctWallet();

		const { factomCli } = this.props.factomCliController;

		return (
			<Formik
				initialValues={{
					entryCreditAmount: '',
					recipientAddress: '',
					myFctWalletAnchorEl: null,
					privateKey: '',
					transactionID: null,
				}}
				onSubmit={async (values, actions) => {
					const { entryCreditAmount, recipientAddress, privateKey } = values;

					const transaction = await factomCli.createEntryCreditPurchaseTransaction(
						privateKey,
						recipientAddress,
						entryCreditAmount
					);

					const txId = await factomCli.sendTransaction(transaction);
					actions.setFieldValue('transactionID', txId);

					updateBalances();
				}}
				validationSchema={Yup.object().shape({
					entryCreditAmount: Yup.string().required('Required'),
					recipientAddress: Yup.string().test(
						recipientAddressPath,
						'Invalid Address',
						isValidEcPublicAddress
					),
					privateKey: Yup.string().test(
						privateKeyPath,
						'Invalid Key',
						isValidFctPrivateAddress
					),
				})}
				render={({
					isSubmitting,
					errors,
					touched,
					values,
					setFieldValue,
					handleReset,
				}) => (
					<Form onKeyPress={this.handleKeyPress}>
						<WalletInfoHeader wallet={activeFctWallet} />
						<Field name={recipientAddressPath}>
							{({ field, form }) => (
								<TextField
									error={
										errors[recipientAddressPath] &&
										touched[recipientAddressPath]
											? true
											: false
									}
									{...field}
									label="Recipient EC address"
									fullWidth={true}
									type="text"
									placeholder="Enter Entry Credit address"
									disabled={isSubmitting}
								/>
							)}
						</Field>
						<Grid container justify="space-between">
							<Grid item>
								<ErrorMessage
									name={recipientAddressPath}
									render={(msg) => (
										<div className={classes.errorText}>{msg}</div>
									)}
								/>
							</Grid>
							<Grid item>
								<ECWalletMenu
									values={values}
									setFieldValue={setFieldValue}
									ecWallets={ecWallets}
									activeFctWallet={activeFctWallet}
								/>
								<Typography
									variant="caption"
									aria-owns={
										values[myFctWalletAnchorElPath] ? 'simple-menu' : null
									}
									aria-haspopup="true"
									onClick={(event) => {
										setFieldValue(myFctWalletAnchorElPath, event.currentTarget);
									}}
									className={classes.pointer}
								>
									Send to one of my addresses
								</Typography>
							</Grid>
						</Grid>

						<Field name={entryCreditAmountPath}>
							{({ field, form }) => (
								<TextField
									type="number"
									error={
										errors[entryCreditAmountPath] &&
										touched[entryCreditAmountPath]
											? true
											: false
									}
									{...field}
									placeholder="Enter Amount (EC)"
									label="Amount"
									fullWidth={true}
									disabled={isSubmitting}
								/>
							)}
						</Field>
						<Grid container justify="space-between">
							<Grid item>
								<ErrorMessage
									name={entryCreditAmountPath}
									render={(msg) => (
										<div className={classes.errorText}>{msg}</div>
									)}
								/>
							</Grid>
							<Grid item>
								<br />
							</Grid>
						</Grid>
						<Field name={privateKeyPath}>
							{({ field, form }) => (
								<TextField
									error={
										errors[privateKeyPath] && touched[privateKeyPath]
											? true
											: false
									}
									{...field}
									placeholder={
										'Enter Private Key for ' + activeFctWallet.nickname
									}
									label="Private Key"
									fullWidth={true}
									disabled={isSubmitting}
								/>
							)}
						</Field>
						<ErrorMessage
							name={privateKeyPath}
							render={(msg) => <div className={classes.errorText}>{msg}</div>}
						/>

						<br />
						<br />
						<br />

						{isSubmitting ? (
							<div>
								{values.transactionID !== null ? (
									<span>
										<Typography>
											<b>Transaction ID:</b> {values.transactionID}
										</Typography>
										<br />
										<Button
											type="button"
											className="outline"
											color="primary"
											variant="raised"
											onClick={handleReset}
											//disabled={!dirty || isSubmitting}
										>
											New Transaction
										</Button>
									</span>
								) : (
									<CircularProgress thickness={7} />
								)}
							</div>
						) : (
							<Button
								className={classes.sendButton}
								variant="raised"
								color="primary"
								type="submit"
								disabled={isSubmitting}
							>
								Convert FCT to EC
							</Button>
						)}

						<br />
						<br />
						<Typography>
							Please verify all details are correct before hitting send.
							<br />
							Nobody can reverse mistaken transactions.
						</Typography>
					</Form>
				)}
			/>
		);
	}
}

function ECWalletMenu(props) {
	const { values, setFieldValue, ecWallets, activeFctWallet } = props;

	const walletList = ecWallets
		.filter((wallet) => wallet.address !== activeFctWallet.address)
		.map((wallet, index) => (
			<MenuItem
				key={index}
				onClick={() => {
					setFieldValue(myFctWalletAnchorElPath, null);
					setFieldValue(recipientAddressPath, wallet.address);
				}}
			>
				{wallet.nickname}
			</MenuItem>
		));
	return (
		<Menu
			id="simple-menu"
			anchorEl={values[myFctWalletAnchorElPath]}
			open={Boolean(values[myFctWalletAnchorElPath])}
			onClose={() => {
				setFieldValue(myFctWalletAnchorElPath, null);
			}}
		>
			{walletList}
		</Menu>
	);
}

ConvertECForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = {
	sendButton: {
		width: '50%',
		height: '24px',
	},
	errorText: { color: 'red', fontSize: '12px', textAlign: 'left' },
	pointer: {
		cursor: 'pointer',
	},
};

const enhancer = _flowRight(
	withWalletContext,
	withFactomCli,
	withStyles(styles)
);

export default enhancer(ConvertECForm);

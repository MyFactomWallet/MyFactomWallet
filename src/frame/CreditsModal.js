import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';

function CreditsModal(props) {
	const { classes } = props;
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<div>
			<Button
				onClick={handleOpen}
				disableRipple
				style={{
					background: 'none',
					border: 'none',
					padding: 0,
					cursor: 'pointer',
					textTransform: 'none',
				}}
			>
				<Typography
					align={'left'}
					gutterBottom
					color={'textSecondary'}
					style={{ fontWeight: '550' }}
				>
					Credits
				</Typography>
			</Button>
			<Modal
				aria-labelledby="credits-modal"
				aria-describedby="credits-modal"
				open={open}
				onClose={handleClose}
			>
				<Paper className={classes.paper}>
					<Typography>
						<Link
							href="https://react-icons.netlify.com/#/icons/gi"
							target="_blank"
						>
							"GiAcorn" icon
						</Link>
						{' by '}
						<Link
							href="https://creativecommons.org/licenses/by/3.0/legalcode"
							target="_blank"
						>
							Creative Commons
						</Link>
					</Typography>
				</Paper>
			</Modal>
		</div>
	);
}

const styles = (theme) => ({
	paper: {
		position: 'absolute',
		boxShadow: theme.shadows[5],
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`,
		padding: '30px',
		maxWidth: '425px',
	},
});

export default withStyles(styles)(CreditsModal);

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { SVGLogo } from '../../component/logo/SVGLogo';
import FactomProtocolLogo from '../../component/logo/factomProtocolLogo.svg';
import Grid from '@material-ui/core/Grid';
import OpenInNew from '@material-ui/icons/OpenInNew';

class ExplorerLink extends React.Component {
	constructor() {
		super();
		this.state = {
			isHovered: false,
		};
		this.handleHover = this.handleHover.bind(this);
	}

	handleHover = () => {
		this.setState((prevState) => ({
			isHovered: !prevState.isHovered,
		}));
	};

	render() {
		const { classes, label, value, href, extend = false } = this.props;

		const valueClass =
			this.state.isHovered || extend
				? classes.value
				: classes.value + ' ' + classes.short;

		return (
			<Grid container alignItems="center" className={classes.root}>
				<Grid item>
					<SVGLogo
						className={classes.logo}
						src={FactomProtocolLogo}
						alt="Factom Protocol Logo"
					/>
				</Grid>
				<Grid item>
					<Typography className={classes.label}>
						&nbsp;{label}:&nbsp;
					</Typography>
				</Grid>
				<Grid item>
					<Typography
						onMouseEnter={this.handleHover}
						onMouseLeave={this.handleHover}
						className={valueClass}
					>
						{value}
					</Typography>
				</Grid>
				<Grid item>
					<a target="_blank" rel="noopener noreferrer" href={href}>
						<OpenInNew color="primary" className={classes.openInNew} />
					</a>
				</Grid>
			</Grid>
		);
	}
}

const styles = (theme) => ({
	openInNew: { fontSize: 15 },
	root: { color: 'black' },
	value: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	short: {
		maxWidth: '200px',
	},
	label: { fontWeight: 500 },
	logo: { height: 20 },
	tooltip: {
		maxWidth: 'none',
		fontSize: 12,
	},
});

export default withStyles(styles)(ExplorerLink);

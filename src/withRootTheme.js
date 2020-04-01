import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createMuiTheme({
	typography: {
		body1: {
			fontSize: '0.875rem',
			lineHeight: 1.43,
			letterSpacing: '0.01071em',
		},
	},
});

function withRootTheme(Component) {
	function WithRoot(props) {
		return (
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...props} />
			</MuiThemeProvider>
		);
	}

	return WithRoot;
}

export default withRootTheme;

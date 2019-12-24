import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createMuiTheme({
	palette: {
		primary: { main: '#0F609B' },
	},
});

function withRootTheme(Component) {
	function WithRoot(props) {
		// MuiThemeProvider makes the theme available down the React tree
		// thanks to React context.
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

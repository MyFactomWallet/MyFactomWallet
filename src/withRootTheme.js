import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createMuiTheme({
	palette: {},
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

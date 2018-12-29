import React from 'react';
import Typography from '@material-ui/core/Typography';

function SectionHeader({ disableGutterBottom, text, color }) {
	const textColor = {
		color: color ? color : null,
	};

	return (
		<Typography
			gutterBottom={!disableGutterBottom}
			variant="h6"
			style={textColor}
		>
			{text}
		</Typography>
	);
}

export default SectionHeader;

import React from 'react';
import Typography from '@material-ui/core/Typography';

function SectionHeader(props) {
	return (
		<Typography gutterBottom variant="h6">
			{props.text}
		</Typography>
	);
}

export default SectionHeader;

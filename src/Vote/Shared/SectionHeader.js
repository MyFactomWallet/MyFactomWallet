import React from 'react';
import Typography from '@material-ui/core/Typography';

function SectionHeader(props) {
	return (
		<Typography gutterBottom variant="title">
			{props.text}
		</Typography>
	);
}

export default SectionHeader;

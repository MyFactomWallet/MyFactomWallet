import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Field, FastField, ErrorMessage } from 'formik';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const FormSelectField = ({
	classes,
	disabled = false,
	error = false,
	isNotFast,
	label,
	name,
	onChange,
	options,
	minWidth,
}) => {
	const FieldType = isNotFast ? Field : FastField;

	return (
		<React.Fragment>
			<FieldType name={name}>
				{({ field }) => (
					<FormControl {...{ disabled, error }}>
						<InputLabel htmlFor={name}>{label}</InputLabel>
						<Select
							{...field}
							{...(onChange ? { onChange } : {})}
							style={{ minWidth }}
							inputProps={{
								id: name,
							}}
						>
							{options.map((value, index) => (
								<MenuItem key={index} value={value.value}>
									{value.text}
								</MenuItem>
							))}
						</Select>
						{/* <FormHelperText /> */}
					</FormControl>
				)}
			</FieldType>
			<ErrorMessage
				name={name}
				render={(msg) => <div className={classes.errorText}>{msg}</div>}
			/>
		</React.Fragment>
	);
};

const styles = (theme) => ({
	errorText: { color: 'red', fontSize: '13px' },
});

export default withStyles(styles)(FormSelectField);

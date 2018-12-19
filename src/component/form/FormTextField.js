import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Field, FastField, ErrorMessage } from 'formik';

const FormTextField = ({
	autoComplete = false,
	classes,
	disabled = false,
	displayError = true,
	error = false,
	fullWidth = false,
	isNotFast,
	label,
	maxLength,
	multiline,
	name,
	onChange,
	onKeyPress,
	spellCheck = false,
	type = 'text',
	validate,
	width,
}) => {
	const FieldType = isNotFast ? Field : FastField;
	return (
		<React.Fragment>
			<FieldType name={name} {...(validate ? { validate } : {})}>
				{({ field }) => (
					<TextField
						{...field}
						{...(onChange ? { onChange } : {})}
						{...{
							error,
							disabled,
							fullWidth,
							label,
							type,
							multiline,
							onKeyPress,
						}}
						inputProps={{
							autoComplete: autoComplete ? 'on' : 'off',
							maxLength,
							spellCheck,
						}}
						style={{ width }}
					/>
				)}
			</FieldType>
			{displayError && (
				<ErrorMessage
					name={name}
					render={(msg) => <div className={classes.errorText}>{msg}</div>}
				/>
			)}
		</React.Fragment>
	);
};

const styles = (theme) => ({
	errorText: { color: 'red', fontSize: '13px' },
});

export default withStyles(styles)(FormTextField);

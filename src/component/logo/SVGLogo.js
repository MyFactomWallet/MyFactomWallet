import React from 'react';

export const SVGLogo = ({ alt, className, onClick, src }) => {
	return <img alt={alt} className={className} onClick={onClick} src={src} />;
};

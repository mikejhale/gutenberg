/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getFontSize,
	getFontSizeClass,
	getFontSizeObjectByValue,
	FontSizePicker,
} from '../components/font-sizes';
import { cleanEmptyObject } from './utils';

export const FONT_SIZE_SUPPORT_KEY = '__experimentalFontSize';

/**
 * Filters registered block settings, extending attributes to include
 * `fontSize` and `fontWeight` attributes.
 *
 * @param  {Object} settings Original block settings
 * @return {Object}          Filtered block settings
 */
function addAttributes( settings ) {
	if ( ! hasBlockSupport( settings, FONT_SIZE_SUPPORT_KEY ) ) {
		return settings;
	}

	// Allow blocks to specify a default value if needed.
	if ( ! settings.attributes.fontSize ) {
		Object.assign( settings.attributes, {
			fontSize: {
				type: 'string',
			},
		} );
	}

	return settings;
}

/**
 * Override props assigned to save component to inject font size.
 *
 * @param  {Object} props      Additional props applied to save element
 * @param  {Object} blockType  Block type
 * @param  {Object} attributes Block attributes
 * @return {Object}            Filtered props applied to save element
 */
function addSaveProps( props, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, FONT_SIZE_SUPPORT_KEY ) ) {
		return props;
	}

	const { fontSize } = attributes;

	const fontSizeClass = getFontSizeClass( fontSize );
	const newClassName = classnames( props.className, fontSizeClass );
	props.className = newClassName ? newClassName : undefined;

	return props;
}

/**
 * Filters registered block settings to expand the block edit wrapper
 * by applying the desired styles and classnames.
 *
 * @param  {Object} settings Original block settings
 * @return {Object}          Filtered block settings
 */
function addEditProps( settings ) {
	if ( ! hasBlockSupport( settings, FONT_SIZE_SUPPORT_KEY ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return addSaveProps( props, settings, attributes );
	};

	return settings;
}

const hasFontSizeSupport = ( blockName ) =>
	hasBlockSupport( blockName, FONT_SIZE_SUPPORT_KEY );

/**
 * Inspector control panel containing the font size related configuration
 *
 * @param {Object} props
 *
 * @return {WPElement} Font size edit element.
 */
export function FontSizeEdit( props ) {
	const {
		name: blockName,
		attributes: { fontSize, style },
		setAttributes,
	} = props;

	const { fontSizes } = useSelect( ( select ) =>
		select( 'core/block-editor' ).getSettings()
	);

	if ( ! hasFontSizeSupport( blockName ) ) {
		return null;
	}

	const fontSizeObject = getFontSize(
		fontSizes,
		fontSize,
		style?.typography?.fontSize
	);
	const onChange = ( value ) => {
		const fontSizeSlug = getFontSizeObjectByValue( fontSizes, value ).slug;

		setAttributes( {
			style: cleanEmptyObject( {
				...style,
				typography: {
					...style?.typography,
					fontSize: fontSizeSlug ? undefined : value,
				},
			} ),
			fontSize: fontSizeSlug,
		} );
	};

	return (
		<FontSizePicker value={ fontSizeObject.size } onChange={ onChange } />
	);
}

addFilter(
	'blocks.registerBlockType',
	'core/font/addAttribute',
	addAttributes
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'core/font/addSaveProps',
	addSaveProps
);

addFilter( 'blocks.registerBlockType', 'core/font/addEditProps', addEditProps );

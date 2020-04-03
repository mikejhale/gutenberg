/**
 * WordPress dependencies
 */
import { __experimentalBlockNavigationList } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Panel, PanelBody } from '@wordpress/components';

export default function NavigationStructurePanel( { blocks } ) {
	return (
		<Panel>
			<PanelBody title={ __( 'Navigation structure' ) }>
				{ !! blocks.length && (
					<__experimentalBlockNavigationList
						blocks={ blocks }
						selectedBlockClientId={ blocks[ 0 ].clientId }
						selectBlock={ () => {} }
						showNestedBlocks
						showAppender
					/>
				) }
			</PanelBody>
		</Panel>
	);
}

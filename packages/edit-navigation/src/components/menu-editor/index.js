/**
 * WordPress dependencies
 */
import {
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import useNavigationBlocks from './use-navigation-blocks';
import BlockEditorPanel from './block-editor-panel';
import NavigationStructurePanel from './navigation-structure-panel';

export default function MenuEditor( { menuId, blockEditorSettings } ) {
	const [ blocks, setBlocks, saveBlocks ] = useNavigationBlocks( menuId );

	return (
		<div className="edit-navigation-menu-editor">
			<BlockEditorKeyboardShortcuts.Register />

			<BlockEditorProvider
				value={ blocks }
				onInput={ ( updatedBlocks ) => setBlocks( updatedBlocks ) }
				onChange={ ( updatedBlocks ) => setBlocks( updatedBlocks ) }
				settings={ {
					...blockEditorSettings,
					templateLock: 'all',
					hasFixedToolbar: true,
				} }
			>
				<BlockEditorKeyboardShortcuts />
				<NavigationStructurePanel blocks={ blocks } />
				<BlockEditorPanel menuId={ menuId } saveBlocks={ saveBlocks } />
			</BlockEditorProvider>
		</div>
	);
}

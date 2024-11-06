/**
 * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Alignment } from "@ckeditor/ckeditor5-alignment";
import { Bold, Italic, Strikethrough, Subscript, Superscript, Underline } from "@ckeditor/ckeditor5-basic-styles";
import type { EditorConfig } from "@ckeditor/ckeditor5-core";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { FontBackgroundColor, FontColor, FontSize } from "@ckeditor/ckeditor5-font";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { GeneralHtmlSupport } from "@ckeditor/ckeditor5-html-support";
import { Image, ImageInsert, ImageResize, ImageUpload } from "@ckeditor/ckeditor5-image";
import { Indent, IndentBlock } from "@ckeditor/ckeditor5-indent";
import { Link } from "@ckeditor/ckeditor5-link";
import { List } from "@ckeditor/ckeditor5-list";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { SelectAll } from "@ckeditor/ckeditor5-select-all";
import { Style } from "@ckeditor/ckeditor5-style";
import { Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar } from "@ckeditor/ckeditor5-table";
import { Undo } from "@ckeditor/ckeditor5-undo";
import { WordCount } from "@ckeditor/ckeditor5-word-count";
declare class Editor extends ClassicEditor {
    static builtinPlugins: (typeof Alignment | typeof Bold | typeof Essentials | typeof FontBackgroundColor | typeof FontColor | typeof FontSize | typeof GeneralHtmlSupport | typeof Heading | typeof Image | typeof ImageInsert | typeof ImageResize | typeof ImageUpload | typeof Indent | typeof IndentBlock | typeof Italic | typeof Link | typeof List | typeof Paragraph | typeof SelectAll | typeof Strikethrough | typeof Style | typeof Subscript | typeof Superscript | typeof Table | typeof TableCaption | typeof TableCellProperties | typeof TableColumnResize | typeof TableProperties | typeof TableToolbar | typeof Underline | typeof Undo | typeof WordCount)[];
    static defaultConfig: EditorConfig;
}
export default Editor;

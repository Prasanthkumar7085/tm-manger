/**
 * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";

import { Alignment } from "@ckeditor/ckeditor5-alignment";
import {
  Bold,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "@ckeditor/ckeditor5-basic-styles";
import type { EditorConfig } from "@ckeditor/ckeditor5-core";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import {
  FontBackgroundColor,
  FontColor,
  FontSize,
} from "@ckeditor/ckeditor5-font";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { GeneralHtmlSupport } from "@ckeditor/ckeditor5-html-support";
import {
  Image,
  ImageInsert,
  ImageResize,
  ImageUpload,
} from "@ckeditor/ckeditor5-image";
import { Indent, IndentBlock } from "@ckeditor/ckeditor5-indent";
import { Link } from "@ckeditor/ckeditor5-link";
import { List } from "@ckeditor/ckeditor5-list";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { SelectAll } from "@ckeditor/ckeditor5-select-all";
import { Style } from "@ckeditor/ckeditor5-style";
import {
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
} from "@ckeditor/ckeditor5-table";
import { Undo } from "@ckeditor/ckeditor5-undo";
import { WordCount } from "@ckeditor/ckeditor5-word-count";

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends ClassicEditor {
  public static override builtinPlugins = [
    Alignment,
    Bold,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontSize,
    GeneralHtmlSupport,
    Heading,
    Image,
    ImageInsert,
    ImageResize,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    List,
    Paragraph,
    SelectAll,
    Strikethrough,
    Style,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    Underline,
    Undo,
    WordCount,
  ];

  public static override defaultConfig: EditorConfig = {
    toolbar: {
      items: [
        "heading",
        "|",
        "fontSize",
        "|",
        "indent",
        "|",
        "fontColor",
        "fontBackgroundColor",
        "imageInsert",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "subscript",
        "superscript",
        "|",
        "alignment",
        "|",
        "numberedList",
        "bulletedList",
        "|",
        "link",
        "insertTable",
        "style",
        "|",
        "undo",
        "redo",
        "selectAll",
      ],
    },
    language: "en",
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableCellProperties",
        "tableProperties",
      ],
    },
  };
}

export default Editor;

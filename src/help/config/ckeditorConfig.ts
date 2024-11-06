import { colorCostants } from "./colorsConstants";

const editorConfiguration: any = {
  fontSize: {
    options: [
      9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    ],
  },
  fontColor: {
    colors: colorCostants,
    columns: 3,
    documentColors: 30,
  },
  fontBackgroundColor: {
    colors: colorCostants,
  },
  toolbar: {
    items: [
      "font", //!
      "lineheight", //!
      "heading",
      "|",
      "fontSize", //!
      "|",
      "indent",
      "|",
      "fontColor", //!
      "fontBackgroundColor", //!
      "imageInsert",
      "|",
      "bold",
      "italic",
      "underLine", //!
      "strikethrough", //!
      "subscript", //!
      "superscript", //!
      "|",
      "alignment", //!
      "|",
      "numberedList",
      "bulletedList",
      "|",
      "link",
      "insertTable",
      "|",
      "undo",
      "redo",
    ],
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableCellProperties",
      ],
    },
    language: "en",
    image: {
      toolbar: [
        "imageTextAlternative",
        "toggleImageCaption",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
      ],
    },
    qtBorder: "0",
  },
  indentBlock: {
    offset: 1,
    unit: "em",
  },
  alignment: {
    options: [
      { name: "left", className: "ck-text-align-left" },
      { name: "right", className: "ck-text-align-right" },
      { name: "center", className: "ck-text-align-center" },
      { name: "justify", className: "ck-text-align-justify" },
    ],
  },
  heading: {
    options: [
      {
        model: "paragraph",
        title: "Paragraph",
        class: "ck-heading_paragraph",
      },
      {
        model: "heading4",
        view: "h4",
        title: "Heading",
        class: "ck-heading_heading4",
      },
      {
        model: "heading5",
        view: "h5",
        title: "Sub-Heading",
        class: "ck-heading_heading5",
      },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
      {
        model: "heading10",
        view: "h10",
        title: "Page-Break",
        class: "ck-heading_heading10",
      },
      {
        model: "heading11",
        view: "h20",
        title: "End Of The Report",
        class: "ck-heading_heading11",
      },
    ],
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableCellProperties",
      "tableProperties",
    ],
    tableProperties: {
      borderColors: colorCostants,
      backgroundColors: colorCostants,
    },
    tableCellProperties: {
      borderColors: colorCostants,
      backgroundColors: colorCostants,
      padding: ["5px", "10px"],
    },
  },
  image: {
    toolbar: [
      "imageStyle:block",
      "imageStyle:side",
      "|",
      "toggleImageCaption",
      "imageTextAlternative",
      "|",
      "linkImage",
    ],
  },
};

export default editorConfiguration;

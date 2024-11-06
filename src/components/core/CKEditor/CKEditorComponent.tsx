import editorConfiguration from "@/help/config/ckeditorConfig";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { FileLoader } from "@ckeditor/ckeditor5-upload";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FC, useEffect, useState } from "react";

interface cKEditorComponentPropTypes {
  editorData: string;
  handleEditorChange: (newData: string) => void;
}

const CKEditorComponent: FC<cKEditorComponentPropTypes> = ({
  editorData,
  handleEditorChange,
}) => {
  const onCKEditorChange = (e: any, editor: any) => {
    const newData = editor?.getData();
    handleEditorChange(newData);
  };
  const uploadFileToS3 = async (response: any, file: any) => {};
  const getS3UrlFromFile = async (file: any) => {};

  function uploadAdapter(loader: FileLoader): any {
    // return {
    //   upload: () => {
    //     return new Promise(async (resolve, reject) => {
    //       try {
    //         const file = await loader.file;
    //         let url = await getS3UrlFromFile(file);
    //         url = "";
    //         resolve({
    //           default: url,
    //         });
    //       } catch (error) {
    //         reject("Hello");
    //       }
    //     });
    //   },
    //   abort: () => {},
    // };
  }

  function uploadPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      return uploadAdapter(loader);
    };
  }
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);
  if (mount) {
    return (
      <CKEditor
        editor={ClassicEditor}
        config={{ extraPlugins: [uploadPlugin], ...editorConfiguration }}
        data={editorData ? editorData : ""}
        onChange={onCKEditorChange}
      />
    );
  } else {
    return <></>;
  }
};

export default CKEditorComponent;

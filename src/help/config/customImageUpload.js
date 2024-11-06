import axios from "@/config/axios";
import * as PrivateAxios from "axios";

class MyUploadAdapter {
  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this.uploadFile(resolve, reject, file);
        })
    );
  }

  async uploadFile(resolve, reject, file) {
    try {
      let params = {
        file: file.name,
        file_type: file.type,
      };
      let s3BaseURL = "";
      if (process.env.NODE_ENV == "production") {
        s3BaseURL = process.env.VUE_APP_S3_PROD_BUCKET_URL;
      } else {
        s3BaseURL = process.env.VUE_APP_S3_BUCKET_URL;
      }
      this.loader.status = "reading";
      const { data } = await axios.post("upload-a-file/report-assets", params);
      this.loader.uploadedPercent = 30;
      if (data.success && data.data && data.data.target_url) {
        let pAxios = PrivateAxios.create({});
        this.loader.status = "uploading";
        await pAxios.put(data.data.target_url, file);
        this.loader.uploadedPercent = 80;
        let imageURL = `${s3BaseURL}/${data.data.slug}/${data.data.path}`;
        this.loader.uploaded = true;
        this.loader.uploadedPercent = 100;
        this.loader.status = "idle";
        resolve({
          default: imageURL,
        });
      } else {
        return reject(`Error in uploading file: ${file.name}`);
      }
    } catch (error) {
      console.error(error);
      console.error(error.message);
      return reject(`Error in uploading file: ${file.name}`);
    }
  }
}

// ...

export function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    return new MyUploadAdapter(loader);
  };
}

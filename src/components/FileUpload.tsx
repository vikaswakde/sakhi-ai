"use client";
import { uplaodToS3 } from "@/lib/s3";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb
        alert("please upload a smaller file");
        return;
      }

      try {
        const data = await uplaodToS3(file);
        console.log("data", data);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className: "border-dashed border-2 rounded-xl cursor-pointer",
        })}
      >
        <input {...getInputProps()} />
        <>
          <p className="mt-2 text-sm text-slate-400">
            Drag and Drop your Content Here
          </p>
        </>
      </div>
    </div>
  );
};

export default FileUpload;

"use client";
import { uplaodToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Inbox, Loader } from "lucide-react";

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb
        // alert("please upload a smaller file");
        toast.error("That's too big file bro!! try smaller 😄");
        return;
      }

      try {
        setUploading(true);
        const data = await uplaodToS3(file);
        console.log("data", data);

        if (!data?.file_key || !data?.file_name) {
          toast.error("Something went wrong");
          return;
        }

        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("chat created!");
          },
          onError: (err) => {
            toast.error("Error creating chat!");
            console.log(err);
          },
        });
      } catch (error) {
        toast.error("File upload Failed, I need to pay AWS bills 💰");
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl ">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            <Loader className="animate-spin w-10 h-10" />
            <p>Sending your file to GPT 🤖 </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">
              Drag and Drop your Content Here
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

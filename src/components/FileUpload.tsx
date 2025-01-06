"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// https://github.com/aws/aws-sdk-js-v3/issues/4126

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
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
        const data = await uploadToS3(file);
        mutate(data as { file_key: string; file_name: string }, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created!");
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            toast.error("Error creating chat");
            console.error(err);
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
    <div className="flex items-center  border border-violet-500/20 bg-violet-500/10 px-4 py-3 shadow-xl rounded-lg">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 border-gray-400 rounded-xl cursor-pointer  py-8 flex justify-center items-center flex-col w-full bg-white/50 text-purple-700 hover:bg-purple-100 transition duration-300 ease-in-out  shadow-lg",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            {/* loading state */}
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Sending your file to GPT 🤖...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500 " />
            <p className="mt-2 text-sm text-slate-400 transition-colors">
              Drop PDF Here
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

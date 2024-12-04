import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

export async function uplaodToS3(file: File) {
  return new Promise((resovle, reject) => {
    try {
      const s3 = new S3({
        region: "ap-south-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY!,
        },
      });

      const file_key =
        "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      };

      s3.putObject(
        params,
        (err: any, data: PutObjectCommandOutput | undefined) => {
          if (err) {
            return reject(err); // Reject the promise with the error
          }
          return resovle({
            file_key,
            file_name: file.name,
          });
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
  return url;
}

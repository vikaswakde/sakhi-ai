import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";

import Image from "next/image";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import { useAuth } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translte-x-1/2 -translte-y-1/2">
        <div className="flex flex-col items-center text-center">
          <h1>Upload PDF & Talk to it through Mitra</h1>
          {/* <UserButton afterSignOutUrl="/" /> */}
        </div>
        <div className="flex mt-2">
          {isAuth && (
            <>
              <Link href={"/"}>
                <Button>Go to Chats</Button>
              </Link>
              <div className="">Subscription Button</div>
            </>
          )}
        </div>
        <p className="max-w-xl mt-1 text-lg text-slate-600">
          Join passionate students , researchers & professionals to instanly
          answer questions & understand research with AI
        </p>
        <div>
          {isAuth ? (
            <FileUpload />
          ) : (
            // <Link href="/sign-in">Login to get Started </Link>
            <FileUpload />
          )}
        </div>
      </div>
    </div>
  );
}

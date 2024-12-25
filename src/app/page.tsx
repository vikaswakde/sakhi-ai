import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";

import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import { UserButton } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { ArrowRightIcon, LogInIcon } from "lucide-react";
import { eq } from "drizzle-orm";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-rose-100 to-teal-100 border relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <h1>Upload PDF & Talk to it through Mitra</h1>
          <UserButton afterSwitchSessionUrl="/" />
        </div>
        <div className="flex mt-2">
          {isAuth && firstChat && (
            <>
              <Link href={`chat/${firstChat.id}`}>
                <Button>
                  Go to Chats <ArrowRightIcon className="ml-2" />
                </Button>
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
            <>
              <Link href="/sign-in">
                <Button>
                  Login to get Started <LogInIcon className="w-4 h-4 ml-2" />
                </Button>{" "}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

export default function MobileSidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="md:hidden fixed top-4 right-4 z-50">
      <Button
        size="sm"
        onClick={toggleSidebar}
        className="bg-gray-600/50 backdrop-blur-md"
      >
        <MessageCircleIcon className="h-5 w-5 text-gray-100" />
      </Button>
    </div>
  );
}

import React from "react";

const page = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-xl md:flex">
      <div className="w-[20rem]">
        If you are seeing this page means, The auth provider is broken, need not
        to worry, You can contact me here, I will assist you personally
      </div>
      <a href="mailto: vikaswakdepc@gmail.com" className="pt-10 text-blue-500">
        Click to Send Mail
      </a>
    </div>
  );
};

export default page;

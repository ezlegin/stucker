import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return <div className="w-full max-w-7xl mx-auto py-4 h-full">{children}</div>;
};

export default layout;

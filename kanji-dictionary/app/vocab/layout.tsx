import MainLayout from "@/components/layout/MainLayout";
import { ReactNode } from "react";

const VocabLayout = ({ children }: { children: ReactNode }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default VocabLayout;

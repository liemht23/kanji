import MainLayout from "@/components/layout/MainLayout";
import { ReactNode } from "react";

const KanjiLayout = ({ children }: { children: ReactNode }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default KanjiLayout;

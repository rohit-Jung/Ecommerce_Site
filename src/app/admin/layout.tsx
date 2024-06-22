import { Metadata } from "next";
import React from "react";
import { AdminNav } from "@/components";

export const metadata: Metadata = {
  title: "E-commerce App Admin",
  description: "E-commerce App Admin Dashboard on Next",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
};

export default AdminLayout;

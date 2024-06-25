"use client";

import { FC } from "react";
import Container from "../Container";
import { categories } from "@/utils/Categories";
import Category from "./Category";
import { usePathname, useSearchParams } from "next/navigation";

interface CategoriesProps {}

const Categories: FC<CategoriesProps> = () => {
  const params = useSearchParams();
  const category = params?.get("category");

  const pathname = usePathname();

  const isMainPage = pathname === "/";

  if (!isMainPage) return null;

  return (
    <>
      <div className="bg-white">
        <Container>
          <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
            {categories.map((item) => (
              <Category
                icon={item.icon}
                label={item.label}
                key={item.label}
                selected={
                  category === item.label ||
                  (category === null && item.label === "All")
                }
              />
            ))}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Categories;

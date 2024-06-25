"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FC, useCallback } from "react";
import { IconType } from "react-icons";
import queryString from "query-string";

interface CategoryProps {
  label: string;
  icon: IconType;
  selected?: boolean;
}

const Category: FC<CategoryProps> = ({ label, icon: Icon, selected }) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    if (label == "All") {
      router.push("/");
    } else {
      let currentQuery = {};

      if (params) {
        currentQuery = queryString.parse(params.toString());
      }

      let updatedQuery: any = {};
      updatedQuery = { ...currentQuery, category: label };

      const url = queryString.stringifyUrl(
        {
          url: "/",
          query: updatedQuery,
        },
        {
          skipNull: true,
        }
      );

      router.push(url);
    }
  }, [label, params, router]);

  return (
    <>
      <div
        className={`flex items-center justify-center text-center gap-1 p-2 border-b-2 hover:text-slate-800 transition cursor-pointer ${
          selected
            ? "border-b-slate-800 text-slate-800"
            : "border-transparent text-slate-500"
        }`}
        onClick={handleClick}
      >
        <Icon size={20} />
        <div className="font-medium text-sm">{label}</div>
      </div>
    </>
  );
};

export default Category;

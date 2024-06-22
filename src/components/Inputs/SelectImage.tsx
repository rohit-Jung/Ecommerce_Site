"use client";

import { FC, useCallback } from "react";
import { ImageType } from "../Admin/AddProductForm";
import { useDropzone } from "react-dropzone";

interface SelectImageProps {
  item?: ImageType;
  handleFileChange: (value: File) => void;
}

const SelectImage: FC<SelectImageProps> = ({ item, handleFileChange }) => {
  const onDrop = useCallback((acceptedFile: File[]) => {
    if (acceptedFile.length > 0) {
      handleFileChange(acceptedFile[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png"] },
  });

  return (
    <>
      <div
        {...getRootProps()}
        className="border-2 border-slate-400 p-2 m-2 border-dashed cursor-pointer text-sm font-normal text-slate-400 flex items-center justify-center"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>+ {item?.color} Image</p>
        )}
      </div>
    </>
  );
};

export default SelectImage;

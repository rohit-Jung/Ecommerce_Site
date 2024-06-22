"use client";
import React, { useCallback, useEffect, useState } from "react";
import Heading from "../Heading";
import Input from "../Inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import TextArea from "../Inputs/TextArea";
import CustomCheckbox from "../Inputs/CustomCheckbox";
import { categories } from "@/utils/Categories";
import CategoryInput from "../Inputs/CategoryInput";
import { colors } from "@/utils/Colors";
import SelectColor from "../Inputs/SelectColor";
import Button from "../Button";
import toast from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import firebaseApp from "@/lib/firebase";
import axios from "axios";
import { useRouter } from "next/navigation";

export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null;
};

export type UploadImageType = {
  color: string;
  colorCode: string;
  image: string;
};

const AddProductForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>(null);
  const [isProductCreated, setIsProductCreated] = useState(false);
  const router = useRouter();

  // console.log("images>>>", images);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      inStock: false,
      brand: "",
      images: [],
    },
  });

  useEffect(() => {
    setCustomValue("images", images);
  }, [images]);

  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    setIsLoading(true);

    let uploadedImages: UploadImageType[] = [];

    if (!data.category) {
      setIsLoading(false);
      toast.error("Please select a category");
    }

    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      toast.error("Please select at least one image");
    }

    const handleImageUploads = async () => {
      toast("Creating product, Please wait !");

      try {
        for (const item of data.images) {
          if (item.image) {
            const fileName = new Date().getTime() + "-" + item.image.name;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);

            const uploadTask = uploadBytesResumable(storageRef, item.image);

            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  switch (snapshot.state) {
                    case "paused":
                      console.log("Upload is paused");
                      break;
                    case "running":
                      console.log("Upload is running");
                      break;
                  }
                },
                (error) => {
                  reject(error);
                },
                () => {
                  // Handle successful uploads on complete
                  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      uploadedImages.push({
                        ...item,
                        image: downloadURL,
                      });
                      console.log("File available at", downloadURL);
                      resolve();
                    })
                    .catch((error) => {
                      console.log(
                        "Error getting the download URL from firebase",
                        error
                      );
                      reject(error);
                    });
                }
              );
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Error uploading images to Firebase", error);
        return toast.error("Error uploading images to Firebase");
      }
    };

    //upload the image
    await handleImageUploads();
    const productData = { ...data, images: uploadedImages };
    // console.log(productData)

    //update the database
    axios
      .post("/api/product", productData)
      .then((response) => {
        toast.success("Product created successfully");
        setIsProductCreated(true);
        router.refresh();
      })
      .catch((error) => {
        console.log("error updating the database", error);
        toast.error("Error updating the database");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
  }, [isProductCreated]);

  const category = watch("category");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }

      return [...prev, value];
    });
  }, []);

  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        const filteredImage = prev.filter((item) => item.color !== value.color);
        return filteredImage;
      }
      return prev;
    });
  }, []);

  return (
    <>
      <Heading title="Add a Product" />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        required
        errors={errors}
      />
      <Input
        id="price"
        label="Price"
        disabled={isLoading}
        register={register}
        required
        type="number"
        errors={errors}
      />
      <Input
        id="brand"
        label="Brand"
        disabled={isLoading}
        register={register}
        required
        errors={errors}
      />
      <TextArea
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        required
        errors={errors}
      />
      <CustomCheckbox
        id="inStock"
        label="This product is already in stock"
        disabled={isLoading}
        register={register}
      />

      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select a category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
          {categories.map((item) => {
            if (item.label === "All") {
              return null;
            }
            return (
              <div key={item.label} className="col-span-1">
                <CategoryInput
                  onClick={(category) => setCustomValue("category", category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">
            Select the available product colors and upload their images.
          </div>

          <div className="text-sm">
            You must upload an image for each of the color selected otherwise
            your color selection will be ignored
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((item, index) => {
            return (
              <div key={index}>
                <SelectColor
                  key={index}
                  item={item}
                  addImageToState={addImageToState}
                  removeImageFromState={removeImageFromState}
                  isProductCreated={isProductCreated}
                />
              </div>
            );
          })}
        </div>
      </div>
      <Button
        label={isLoading ? "Loading... " : "Add Product"}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default AddProductForm;

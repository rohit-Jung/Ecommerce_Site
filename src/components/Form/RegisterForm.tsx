"use client";
import React, { useEffect, useState } from "react";
import Heading from "../Heading";
import Input from "../Inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";

interface RegisterFormProps {
  currentUser: SafeUser | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post("/api/register", data).then((response) => {
      toast.success("Registration Success!");

      signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.ok) {
            router.push("/cart");
            router.refresh();
            toast.success("LogIn Successfull");
          }
          if (callback?.error) {
            toast.error(callback.error);
          }
        })
        .catch(() => toast.error("Something went wrong! "))
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  useEffect(() => {
    if (currentUser) {
      router.push("/");
      router.refresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Heading title="Sign Up Form" />
      <Button
        label="Sign up with Google"
        outline
        icon={AiOutlineGoogle}
        onClick={() => {
          signIn("google");
        }}
      />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="email"
        required
      />
      <Input
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
      <Button
        label={isLoading ? "Loading" : "Sign Up"}
        onClick={handleSubmit(onSubmit)}
      />
      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/login" className=" underline text-slate-500">
          Log in
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;

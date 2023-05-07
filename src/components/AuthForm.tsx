"use client";


import { useCallback, useState, useEffect } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Input from "./input/Input";
import Button from "./Button";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import { signIn, useSession } from 'next-auth/react'; 
import { toast } from 'react-hot-toast'; 
import { useRouter } from 'next/navigation'; 


type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const { data: session, status } = useSession(); 
  const router = useRouter(); 
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  useEffect(() => {
    if(status === "authenticated") {
      router.push("/users")
      
    }

  }, [status, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      if (variant === "REGISTER") {
        await axios.post("api/register", data).then(() => signIn('credentials', {
          ...data,
          callbackUrl: "/users"
        }))
        toast.success("Successfully registered")
        
      }

      if (variant === "LOGIN") {
        signIn('credentials', {
          ...data,
          redirect:false,
          callbackUrl: "/users"
          
        }).then((callback) => {
          if(callback?.error) {
            toast.error("Invalid credentials")
          }

          if(callback?.ok && !callback?.error) {
            toast.success("Successfully signed In")
          }
        })
        
      }
    } catch (error) {
      toast.error("something went wrong"); 
    
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              errors={errors}
              id="name"
              label="Name"
              register={register}
              type="text"
              disabled={isLoading}
            />
          )}

          <Input
            errors={errors}
            id="email"
            label="Email"
            register={register}
            type="text"
            disabled={isLoading}
          />
          <Input
            errors={errors}
            id="password"
            label="password"
            register={register}
            disabled={isLoading}
          />

          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or Continue with
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN"
              ? "New to Messenger?"
              : "Already Have an Account"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create An Account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

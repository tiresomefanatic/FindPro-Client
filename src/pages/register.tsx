import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AutosizeTextarea } from "@/components/ui/autoResizeTextArea";
import MultipleSelector from "@/components/ui/multipleSelector";
import FixedCropper from "@/components/ImageCropper";
import { useEdgeStore } from "@/lib/edgeStore";
import { setIsAuthenticated, setLoggedInAt, setUser, setAccessToken } from "@/redux/authSlice";
import customAxios from "@/lib/customAxios";
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().optional(),
  location: z.string().optional(),
  languages: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  phoneNumber: z.string().optional(),
  profilePic: z.string().optional(),
});

export default function ProfileForm() {
  const { edgestore } = useEdgeStore();
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [userKiId, setUserKiId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [didProfileUpload, setDidProfileUpload] = useState(0);
  const [imageToBeUploaded, setImageToBeUploaded] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const userName = router.query.userName?.toString() ?? "";
  const userId = router.query.userId?.toString() ?? "";
  const accessToken = router.query.accessToken?.toString() ?? "";

  useEffect(() => {
    if (accessToken) {
      dispatch(setAccessToken(accessToken));
    }
  }, [accessToken, dispatch]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      location: "",
      languages: [],
      skills: [],
      phoneNumber: "",
    },
  });

  useEffect(() => {
    form.setValue("name", decodeURIComponent(userName));
    setUserKiId(userId);
  }, [form, userName, userId]);

  const { mutate: updateUserMutation } = useMutation({
    mutationFn: async (updateData: any) => {
      const response = await customAxios.put(
        `${baseUrl}/user/updateUser/${userKiId}`,
        updateData
      );
      return response.data;
    },
    onSuccess: (userData) => {
      dispatch(setIsAuthenticated(true));
      dispatch(setUser(userData));
      dispatch(setLoggedInAt(Date.now()));
      toast.success("Welcome! Your profile has been updated.");
      router.push('/');
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Authentication failed. Please log in again.");
          router.push('/');
        } else if (error.response?.status === 403) {
          toast.error("You don't have permission to update this profile.");
        } else {
          toast.error("An error occurred while updating your profile. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Error updating user profile:", error);
    },
  });

  const onSubmit = async () => {
    const formData = form.getValues();

    updateUserMutation({
      name: formData.name,
      bio: formData.bio,
      location: formData.location,
      languages: formData.languages,
      skills: formData.skills,
      phoneNumber: formData.phoneNumber,
      profilePic: profilePicUrl,
    });
  };

  const handleProfilePicUpload = async (croppedBlob: Blob) => {
    try {
      setIsUploading(true);

      const croppedFile = new File([croppedBlob], "cropped_image.png", {
        type: "image/png",
      });

      const res = await edgestore.profilePics.upload({
        file: croppedFile,
        onProgressChange: (progress) => {
          setUploadProgress(progress);
        },
      });

      if (!res.thumbnailUrl) {
        await setProfilePicUrl(res.url);
      } else {
        setProfilePicUrl(res.thumbnailUrl);
      }

      await setDidProfileUpload((prevCount) => prevCount + 1);
      await setImageToBeUploaded(URL.createObjectURL(croppedFile));
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("error uploading, try again");
    } finally {
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="flex justify-center items-center">
          {didProfileUpload === 0 ? (
            <Avatar key={profilePicUrl} className="w-24 h-24">
              <AvatarImage
                src={profilePicUrl}
                alt="@shadcn"
                onLoadingStatusChange={(status) => {
                  if (status === "loaded") {
                    console.log("Profile picture loaded 1 successfully");
                  } else if (status === "error") {
                    console.error("Failed to load 1 profile picture");
                  }
                }}
              />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          ) : (
            <Avatar key={imageToBeUploaded} className="w-24 h-24">
              <AvatarImage
                src={imageToBeUploaded}
                alt="@shadcn"
                onLoadingStatusChange={(status) => {
                  if (status === "loaded") {
                    console.log("Profile picture loaded 2 successfully");
                  } else if (status === "error") {
                    console.error("Failed to load 2 profile picture");
                  }
                }}
              />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          )}
        </div>

        {uploadProgress === 0 ? (
          <div className="flex justify-center items-center">
            {isUploading ? (
              <div>Loading...</div>
            ) : (
              <FixedCropper
                isGigImage={false}
                onCrop={handleProfilePicUpload}
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-0 place-items-center w-4/5 max-w-lg h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
             <p className="text-sm text-black-100">Uploading Image...</p>
            <Progress value={uploadProgress} className="w-full max-w-lg" />
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 123-456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <AutosizeTextarea
                      className="w-full resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select your location</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      {...field}
                      placeholder="Type a language and enter to add"
                      creatable
                      value={field.value?.map((language: string) => ({
                        value: language,
                        label: language,
                      }))}
                      onChange={(selected) => {
                        field.onChange(selected.map((option) => option.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Example: English, Spanish, French
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      {...field}
                      placeholder="Type a skill and enter to add"
                      creatable
                      value={field.value?.map((language: string) => ({
                        value: language,
                        label: language,
                      }))}
                      onChange={(selected) => {
                        field.onChange(selected.map((option) => option.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Example: JavaScript, React, Node.js
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-y-3">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
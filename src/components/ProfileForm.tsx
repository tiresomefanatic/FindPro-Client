"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AutosizeTextarea } from "@/components/ui/autoResizeTextArea";
import MultipleSelector from "@/components/ui/multipleSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FixedCropper from "@/components/ImageCropper";
import { useEdgeStore } from "@/lib/edgeStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import useAuth from "@/lib/useAuth";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LabelWithTooltip from "./LabelWithTooltip";
import customAxios from "@/lib/customAxios";
import { Textarea } from "./ui/textarea";
import { CircleAlert, Plus, TriangleAlert, User, X } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  portfolioLink: z.string().url().optional().or(z.literal("")),
  instagramLink: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  languages: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  phoneNumber: z
    .string()
    .min(1, {
      message: "Phone number is required.",
    })
    .min(10, {
      message: "Phone number must be at least 10 characters.",
    }),
  profilePic: z.string().optional(),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1, {
          message: "Question cannot be empty.",
        }),
        answer: z.string().min(1, {
          message: "Answer cannot be empty.",
        }),
      })
    )
    .optional(),
});

type ProfileFormProps = {
  userId: string | string[] | undefined;
  isBecomingSeller: boolean;
};

export default function ProfileForm({ userId }: ProfileFormProps) {
  const { edgestore } = useEdgeStore();
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [userKiId, setUserKiId] = useState("");
  const [isSeller, setIsSeller] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [didProfileUpload, setDidProfileUpload] = useState(0);
  const [imageToBeUploaded, setImageToBeUploaded] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [intendedRoute, setIntendedRoute] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessages, setAlertMessages] = useState<string[]>([]);

  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      portfolioLink: "",
      location: "",
      languages: [],
      skills: [],
      phoneNumber: "",
    },
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/${userId}`);
        const userData = response.data;

        form.setValue("name", userData.name);
        form.setValue("bio", userData.bio);
        form.setValue("portfolioLink", userData.portfolioLink || "");
        form.setValue("instagramLink", userData.instagramLink || "");
        form.setValue("location", userData.location);
        form.setValue("languages", userData.languages);
        form.setValue("skills", userData.skills);
        form.setValue("phoneNumber", userData.phoneNumber);
        form.setValue("faqs", userData.faqs);

        setUserKiId(userData._id);
        setProfilePicUrl(userData.profilePic);
        setIsSeller(userData.isSeller);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, form]);

  const {
    mutate: updateUserMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (updateData: any) => {
      const response = await customAxios.put(
        `${baseUrl}/user/updateUser/${userKiId}`,
        updateData,
        {
          // baseURL: baseUrl,
          // withCredentials: true,
        }
      );
      const userData = response.data;
      dispatch(setUser(userData));
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      router.back();
    },
    onError: (error) => {
      toast.error("Error updating user profile");
      console.error("Error updating user profile:", error);
    },
  });

  const {
    mutate: becomeSeller,
    isPending: isBecomingSeller,
    isError: isErrorBecomingSeller,
    error: errorBecomingSeller,
  } = useMutation({
    mutationFn: async () => {
      const response = await customAxios.put(
        `${baseUrl}/user/become-seller/${userKiId}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setUser(data));
      toast.success("You are now a seller!");
    },
    onError: (error) => {
      toast.error("Error becoming a seller");
      console.error("Error becoming a seller:", error);
    },
  });

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        setIsFormDirty(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async () => {
    try {
      const formData = form.getValues();
      console.log("formdata", formData);

      // Validate the form data against the schema
      const validatedData = formSchema.parse(formData);

      await updateUserMutation({
        name: validatedData.name,
        bio: validatedData.bio,
        portfolioLink: validatedData.portfolioLink,
        instagramLink: validatedData.instagramLink,
        location: validatedData.location,
        languages: validatedData.languages,
        skills: validatedData.skills,
        phoneNumber: validatedData.phoneNumber,
        profilePic: profilePicUrl,
        faqs: validatedData.faqs,
      });
      setIsFormDirty(false);

      console.log("User data updated successfully");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const validationErrors = error.errors;
        console.error("Validation errors:", validationErrors);
        // Display validation error messages to the user or perform any necessary actions
      } else {
        // Handle other errors
        console.error("Error updating user data:", error);
        // Handle the error, display an error message, or perform any necessary actions
      }
    }
  };

  const handleProfilePicUpload = async (croppedBlob: Blob) => {
    try {
      console.log("reaching upload fucntion");
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

      console.log(res);

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
      setIsFormDirty(true);
    }
  };

  const validateBecomeSeller = (): {
    isDisabled: boolean;
    errors: {
      name: boolean;
      bio: boolean;
      languages: boolean;
      skills: boolean;
      phoneNumber: boolean;
      profilePic: boolean;
    };
  } => {
    const formData = form.getValues();

    const errors = {
      name: !formData.name,
      bio: !formData.bio,
      languages: !formData.languages || formData.languages.length === 0,
      skills: !formData.skills || formData.skills.length === 0,
      phoneNumber: !formData.phoneNumber,
      profilePic: !profilePicUrl || profilePicUrl === "",
    };

    const isDisabled = Object.values(errors).some((error) => error);

    return { isDisabled, errors };
  };

  const handleBecomeSeller = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { isDisabled, errors } = validateBecomeSeller();

    if (isDisabled) {
      const errorMessages: string[] = [];

      if (errors.name) errorMessages.push("Name is required");
      if (errors.bio) errorMessages.push("Bio is required");
      if (errors.languages)
        errorMessages.push("At least one language is required");
      if (errors.skills) errorMessages.push("At least one skill is required");
      if (errors.phoneNumber) errorMessages.push("Phone number is required");
      if (errors.profilePic) errorMessages.push("Profile Picture is required");

      setAlertMessages(errorMessages);
      setShowAlert(true);
      return;
    }

    try {
      const formData = form.getValues();
      console.log("formdata", formData);

      // Validate the form data against the schema
      const validatedData = formSchema.parse(formData);

      await updateUserMutation(
        {
          name: validatedData.name,
          bio: validatedData.bio,
          location: validatedData.location,
          languages: validatedData.languages,
          skills: validatedData.skills,
          phoneNumber: validatedData.phoneNumber,
          profilePic: profilePicUrl,
        },
        {
          onSuccess: () => {
            setIsFormDirty(false);

            becomeSeller();
          },
          onError: (error) => {
            console.error("Error updating gig:", error);
            toast.error("Error updating gig");
          },
        }
      );

      console.log("You are now a seller successfully");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const validationErrors = error.errors;
        console.error("Validation errors:", validationErrors);
        // Display validation error messages to the user or perform any necessary actions
      } else {
        // Handle other errors
        console.error("Error becoming seller:", error);
        // Handle the error, display an error message, or perform any necessary actions
      }
    }
  };

  // Handle route changes
  useEffect(() => {
    const handleRouteChange = (
      url: string,
      { shallow }: { shallow: boolean }
    ) => {
      if (isFormDirty && !isAlertOpen && !shallow) {
        setIsAlertOpen(true);
        setIntendedRoute(url);
        router.events.emit("routeChangeError", "routeChange aborted.", url, {
          shallow,
        });
        throw "routeChange aborted.";
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [isFormDirty, isAlertOpen, router.events]);

  const handleAddQuestionAnswer = () => {
    appendFaq({ question: "", answer: "" });
  };

  const handleRemoveQuestionAnswer = (index: number) => {
    removeFaq(index);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
        {/* Left column */}
        <div className="lg:col-span-4 mb-8 lg:mb-0">
          <div className="sticky top-24">
            <Card className="rounded-xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-center items-center mb-6">
                  {didProfileUpload === 0 ? (
                    <Avatar key={profilePicUrl} className="w-24 h-24">
                      <AvatarImage
                        src={profilePicUrl}
                        alt="@shadcn"
                        onLoadingStatusChange={(status) => {
                          if (status === "loaded") {
                            console.log(
                              "Profile picture loaded 1 successfully"
                            );
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
                            console.log(
                              "Profile picture loaded 2 successfully"
                            );
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
                      <div className="">
                        <FixedCropper
                          isGigImage={false}
                          onCrop={handleProfilePicUpload}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1">
                    <p className="text-sm text-black-100">Uploading Image...</p>
                    <Progress
                      value={uploadProgress}
                      className="w-full max-w-lg"
                    />
                  </div>
                )}

                <Form {...form}>
                  <form className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Type in your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Hyderabad">
                                Hyderabad
                              </SelectItem>
                              <SelectItem value="Bengaluru">
                                Bengaluru
                              </SelectItem>
                              <SelectItem value="Mumbai">Mumbai</SelectItem>
                              <SelectItem value="Chennai">Chennai</SelectItem>
                              <SelectItem value="Delhi">Delhi</SelectItem>
                            </SelectContent>
                          </Select>
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
                                field.onChange(
                                  selected.map((option) => option.value)
                                );
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                <div className="flex justify-end my-6 rounded-full">
                  <div className="space-x-4">
                    <Button
                      type="submit"
                      variant="default"
                      className="rounded-full"
                      onClick={form.handleSubmit(onSubmit)}
                    >
                      Update Profile
                    </Button>
                    {!isSeller && (
                      <button
                        onClick={handleBecomeSeller}
                        className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] mt-1 shadow-md"
                      >
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black backdrop-blur-3xl hover:bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:text-white">
                          Become a Seller
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-8">
          <Card className="rounded-xl shadow-lg">
            <CardContent className="p-6">
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {" "}
                          <LabelWithTooltip
                            label="Bio"
                            tooltipText="Write a brief description about yourself, your skills, and your experience."
                            tooltipImage="/BioTooltip.png"
                          />
                        </FormLabel>
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
                    name="portfolioLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio Link</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://yourportfolio.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Add a link to your portfolio website (recommended)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagramLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram Link</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://instagram.com/yourProfilePageLink"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Add a link to your Instagram profile (recommended)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <LabelWithTooltip
                            label="Skills"
                            tooltipText="Add your professional skills. These will help clients find you for relevant projects."
                            tooltipImage="/SkillsTooltip.png"
                          />
                        </FormLabel>
                        <FormControl>
                          <MultipleSelector
                            {...field}
                            placeholder="Type a skill and enter to add"
                            creatable
                            value={field.value?.map((skill: string) => ({
                              value: skill,
                              label: skill,
                            }))}
                            onChange={(selected) => {
                              field.onChange(
                                selected.map((option) => option.value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Example: JavaScript, React, Node.js
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  {/* FAQ Section */}
                  <div className="space-y-4">
                    <div className="flex flex-row">
                      {" "}
                      <h1 className="text-xl font-bold">Questions & Answers</h1>
                      <LabelWithTooltip
                        //label="Question & Answers"
                        tooltipText="Add sets of frequently asked questions so customers can get a better idea about you"
                        tooltipImage="/FAQTooltip.png"
                      />
                    </div>

                    {faqFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="space-y-2 border border-slate-300 p-4"
                      >
                        <FormField
                          control={form.control}
                          name={`faqs.${index}.question`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter question"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`faqs.${index}.answer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Answer</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter answer"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveQuestionAnswer(index)}
                        >
                          <X color="red" /> Remove this set
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddQuestionAnswer}
                    >
                      <Plus /> Add Question-Answer Set
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. If you leave now, your changes will be
              lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              Stay
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsFormDirty(false);
                if (intendedRoute) {
                  router.push(intendedRoute);
                } else {
                  router.back();
                }
              }}
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex flex-row items-center">
                <TriangleAlert size={36} color="red" className="mr-1" />
                <h6>Fill all required fields to become a seller </h6>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mt-4">
                {alertMessages.map((message, index) => (
                  <div key={index} className="flex flex-row items-center">
                    <CircleAlert color="red" />
                    <p
                      key={index}
                      className="text-md text-semibold text-black ml-2"
                    >
                      {message}
                    </p>
                  </div>
                ))}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

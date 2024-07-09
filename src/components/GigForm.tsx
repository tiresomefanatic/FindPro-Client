"use client";
import * as React from "react";
import Image from "next/image";
import { GigSlideshow } from "@/components/GigSlideshow";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AutosizeTextarea } from "./ui/autoResizeTextArea";
import { toast } from "sonner";

import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useEdgeStore } from "@/lib/edgeStore";

import { RootState } from "@/redux/rootReducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import DragNDropUploader from "./DragNDropUploader";
import { setImages } from "@/redux/portfolioMediaSlice";
import customAxios from "@/lib/customAxios";

// Define the form schema using Zod
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
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
  packages: z.array(
    z.object({
      name: z.enum(["Basic", "Premium", "Custom"]),
      title: z.string(),
      per: z.string(),
      price: z.string(),
      description: z.string(),
    })
  ),
  portfolioMedia: z
    .array(
      z.object({
        uid: z.string(),
        src: z.string(),
      })
    )
    .optional(),
  status: z.string().optional(),
});

export default function GigForm({
  isNewGig,
  gigId,
}: {
  isNewGig: boolean;
  gigId: string;
}) {
  const router = useRouter();
  //const { gigId } = router.query;
  // const isNewGig = router.pathname === "/createGigPage";
  const dispatch = useDispatch<AppDispatch>();

  const queryClient = useQueryClient();

  const { edgestore } = useEdgeStore();

  // States used to track when to show "Are you sure, changes will be lost" Alert
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [intendedRoute, setIntendedRoute] = useState<string | null>(null);
  const [isPortfolioMediaInitialized, setIsPortfolioMediaInitialized] =
    useState(false);

  // The final array of image urls that will be uploaded to backend
  const portfolioMediaState = useSelector(
    (state: RootState) => state.portfolioMedia.images
  );

  const uploadedUrls = useSelector(
    (state: RootState) => state.portfolioMedia.confirmUploadUrls
  );

  // For Go Live Alert Message
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessages, setAlertMessages] = useState<string[]>([]);
  console.log("isformdirty", isFormDirty);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  //Fetch backend call to set initial form data
  const {
    data: gigData,
    isLoading: isGigLoading,
    error: gigError,
  } = useQuery({
    queryKey: ["gig", gigId],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/gigs/getGigById/${gigId}`);
      return response.data;
    },
  });

  //To update the gig
  const {
    mutate: updateGigMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (updateData: Partial<z.infer<typeof formSchema>>) => {
      const response = await customAxios.put(
        `${baseUrl}/gigs/${gigId}`,
        updateData,
        {
          // baseURL: baseUrl, // Set your API base URL, does not work without it
          // withCredentials: true, // To let axios send cookies in header
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gig"] });
    },
  });

  // make live mutation
  const {
    mutate: makeGigLiveMutation,
    isPending: isMakingLive,
    isError: isMakeLiveError,
    error: makeLiveError,
  } = useMutation({
    mutationFn: async () => {
      const response = await customAxios.put(
        `${baseUrl}/gigs/make-gig-live/${gigId}`
      );
      return response.data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["gig"] });
      // queryClient.setQueryData(['gig', { id: data._id}], data)

      await setIsFormDirty(false);
    },
    onError: (error) => {
      console.error("Error making gig live:", error);
      toast.error("Error making gig live");
    },
  });

  //make draft mutation
  const {
    mutate: makeGigDraftMutation,
    isPending: isMakingDraft,
    isError: isMakeDraftError,
    error: makeDraftError,
  } = useMutation({
    mutationFn: async () => {
      await customAxios.put(`${baseUrl}/gigs/make-gig-draft/${gigId}`);
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["gig"] });
      //queryClient.setQueryData(['gig', { status: 'isDraft' }], data)

      await setIsFormDirty(false);
      toast.success("Gig is now a draft!");
    },
    onError: (error) => {
      console.error("Error making gig draft:", error);
      toast.error("Error making gig draft");
    },
  });

  // Defining the form for react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: gigData?.title || "",
      description: gigData?.description || "",
      category: gigData?.category || "",
      subCategory: gigData?.subCategory || "",
      faqs: gigData?.faqs || [],
      packages: gigData?.packages || [
        { name: "Basic", title: "", per: "", price: "", description: "" },
        { name: "Premium", title: "", per: "", price: "", description: "" },
        { name: "Custom", title: "", per: "", price: "", description: "" },
      ],
      portfolioMedia: gigData?.portfolioMedia || [],
    },
  });

  //Set initial data
  useEffect(() => {
    if (gigData) {
      form.reset({
        title: gigData.title,
        description: gigData.description,
        category: gigData.category,
        subCategory: gigData.subCategory,
        faqs: gigData.faqs,
        packages: gigData.packages,
      });
      dispatch(setImages(gigData.portfolioMedia || []));
      setIsPortfolioMediaInitialized(true); // Set the flag to true after setting initial data
    }
  }, [gigData, form, dispatch]);

  //To check for form changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        setIsFormDirty(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // To check for changes made to the images(removed an image or reordered the images), this makes the form dirty so that alert can be shown if leaving wihout saving changes
  useEffect(() => {
    if (isPortfolioMediaInitialized && portfolioMediaState) {
      // Check if portfolioMedia state has changed
      if (
        portfolioMediaState.length !== gigData?.portfolioMedia.length ||
        portfolioMediaState.some(
          (media, index) => media.src !== gigData?.portfolioMedia[index].src
        )
      ) {
        setIsFormDirty(true);
      }
    }
  }, [
    portfolioMediaState,
    isPortfolioMediaInitialized,
    gigData?.portfolioMedia,
  ]);

  const [isUploading, setIsUploading] = useState(false);

  const handleUploadStatusChange = (
    uploading: boolean | ((prevState: boolean) => boolean)
  ) => {
    setIsUploading(uploading);
  };

  // for routing
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

  const [shouldRoute, setShouldRoute] = useState(false);

  //for routing AFTER isFormDirty state update
  useEffect(() => {
    if (shouldRoute) {
      router.back();
    }
  }, [shouldRoute, gigId, router]);

  // Main form submisson
  const handleUpdateGig = async () => {
    console.log("Starting handleUpdateGig function");
    const formData = form.getValues();

    try {
      console.log("Starting sequential URL confirmations");
      await uploadedUrls.reduce(
        (acc: Promise<void>, url: string) =>
          acc.then(async () => {
            console.log(`Attempting to confirm upload for ${url}`);
            try {
              await edgestore.publicFiles.confirmUpload({ url });
              console.log(`Successfully confirmed upload for ${url}`);
            } catch (error) {
              console.error(`Failed to confirm upload for ${url}:`, error);
              throw new Error(`Failed to confirm upload for ${url}`);
            }
          }),
        Promise.resolve()
      );

      console.log(
        "All uploads confirmed sequentially, proceeding to updateGigMutation"
      );

      console.log("Calling updateGigMutation");
      await updateGigMutation({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        faqs: formData.faqs,
        packages: formData.packages,
        portfolioMedia: portfolioMediaState,
      });
      console.log("updateGigMutation completed successfully");

      await setIsFormDirty(false);
      console.log("Form marked as not dirty");
      toast.success("Gig Updated Successfully");
      setShouldRoute(true);
      console.log("Should route flag set to true");
    } catch (error) {
      console.error("Error in handleUpdateGig:", error);
      toast.error("Error Updating Gig");
    }
    console.log("handleUpdateGig function completed");
  };

  //Validating data before making the gig live
  const validateGoLive = (): {
    isDisabled: boolean;
    errors: {
      title: boolean;
      description: boolean;
      portfolioMedia: boolean;
      basicPackage: {
        title: boolean;
        per: boolean;
        price: boolean;
        description: boolean;
      };
      category: boolean;
      subCategory: boolean;
    };
  } => {
    const formData = form.getValues();

    const errors = {
      title: !formData.title,
      description: !formData.description,
      portfolioMedia: portfolioMediaState.length === 0,
      basicPackage: {
        title: !formData.packages[0].title,
        per: !formData.packages[0].per,
        price: !formData.packages[0].price,
        description: !formData.packages[0].description,
      },
      category: !formData.category,
      subCategory: !formData.subCategory,
    };

    const isDisabled = Object.values(errors).some((error) => {
      if (typeof error === "object") {
        return Object.values(error).some((value) => value);
      }
      return error;
    });

    return { isDisabled, errors };
  };

  const handleGoLive = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Starting handleGoLive function");
    const formData = form.getValues();

    const { isDisabled, errors } = validateGoLive();

    if (isDisabled) {
      const errorMessages: string[] = [];

      if (errors.title) errorMessages.push("Title is empty");
      if (errors.description) errorMessages.push("Description is empty");
      if (errors.portfolioMedia) errorMessages.push("Portfolio Media is empty");
      if (errors.basicPackage.title)
        errorMessages.push("Basic Package: Title is empty");
      if (errors.basicPackage.per)
        errorMessages.push("Basic Package: Per is empty");
      if (errors.basicPackage.price)
        errorMessages.push("Basic Package: Price is empty");
      if (errors.basicPackage.description)
        errorMessages.push("Basic Package: Description is empty");
      if (errors.category) errorMessages.push("Category is empty");
      if (errors.subCategory) errorMessages.push("Subcategory is empty");

      setAlertMessages(errorMessages);
      setShowAlert(true);
      console.log("Validation failed, showing alert");
      return;
    }

    try {
      console.log("Starting sequential URL confirmations");
      await uploadedUrls.reduce(
        (acc: Promise<void>, url: string) =>
          acc.then(async () => {
            console.log(`Attempting to confirm upload for ${url}`);
            try {
              await edgestore.publicFiles.confirmUpload({ url });
              console.log(`Successfully confirmed upload for ${url}`);
            } catch (error) {
              console.error(`Failed to confirm upload for ${url}:`, error);
              throw new Error(`Failed to confirm upload for ${url}`);
            }
          }),
        Promise.resolve()
      );

      console.log(
        "All uploads confirmed sequentially, proceeding to updateGigMutation"
      );

      await updateGigMutation({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        faqs: formData.faqs,
        packages: formData.packages,
        portfolioMedia: portfolioMediaState,
      });
      console.log("updateGigMutation completed successfully");

      console.log("Calling makeGigLiveMutation");
      await makeGigLiveMutation();
      console.log("makeGigLiveMutation completed successfully");

      await setIsFormDirty(false);
      console.log("Form marked as not dirty");
      toast.success("Gig is now live!");
      setShouldRoute(true);
    } catch (error) {
      console.error("Error in handleGoLive:", error);
      toast.error("Error updating gig status");
    }
    console.log("handleGoLive function completed");
  };

  const handleMakeDraft = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = form.getValues();

    try {
      await updateGigMutation(
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          subCategory: formData.subCategory,
          faqs: formData.faqs,
          packages: formData.packages,
          portfolioMedia: portfolioMediaState,
        },
        {
          onSuccess: () => {
            // Make the gig live after the updateGigMutation is successful
            makeGigDraftMutation();
          },
          onError: (error) => {
            console.error("Error updating gig:", error);
            toast.error("Error updating gig");
          },
        }
      );

      await setIsFormDirty(false);
      //toast.success("Gig is no longer live!");
    } catch (error) {
      console.error("Error updating gig status:", error);
      toast.error("Error updating gig status");
    }
  };

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const handleAddQuestionAnswer = () => {
    appendFaq({ question: "", answer: "" });
  };

  const handleRemoveQuestionAnswer = (index: number) => {
    removeFaq(index);
  };

  if (isGigLoading) {
    return (
      <div className="flex justify-center items-center ">
        <div className="h-10 w-10  animate-spin rounded-full border-4 border-gray-200 border-t-black" />
      </div>
    );
  }

  if (gigError) {
    return <div>Error: {gigError.message}</div>;
  }
  //error check the form
  //const onInvalid = (errors) => console.error(errors)

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <section className="bg-white dark:bg-background py-8 lg:py-16">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              handleUpdateGig
              // onInvalid //for error checking the form
            )}
            className="space-y-8 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8">
                {/* Gig details */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter gig title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Upload */}
                <div className="bg-gray-100 p-3 my-2">
                  <h4>Upload Images and drag to reorder or delete</h4>

                  <div className="flex justify-center items-center">
                    <DragNDropUploader
                      onUploadStatusChange={handleUploadStatusChange}
                    />
                  </div>
                </div>

                {/* Gig description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        {/* <Textarea
                            placeholder="Enter gig description"
                            className="flex w-full resize-none"
                            {...field}
                          /> */}
                        <AutosizeTextarea
                          placeholder="Enter Gig Description"
                          className="w-full min-h-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // handleUpdateGig("category", value);
                        }}
                        defaultValue={gigData?.category || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            <SelectItem value="Video Production">
                              Video Production
                            </SelectItem>
                            <SelectItem value="Video Editing">
                              Video Editing
                            </SelectItem>
                            <SelectItem value="Music">Music</SelectItem>
                            <SelectItem value="Writers">Writers</SelectItem>
                            <SelectItem value="Photographers">
                              Photographers
                            </SelectItem>
                            <SelectItem value="Visual Graphics">
                              Visual Graphics
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subcategory */}
                <FormField
                  control={form.control}
                  name="subCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          //handleUpdateGig("subCategory", value);
                        }}
                        defaultValue={gigData?.subCategory || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Subcategories</SelectLabel>
                            {form.watch("category") === "Video Production" && (
                              <>
                                <SelectItem value="WeddingFilms">
                                  Wedding Films
                                </SelectItem>
                                <SelectItem value="Social Media Videos">
                                  Social Media Videos
                                </SelectItem>
                                <SelectItem value="Music Videos">
                                  Music Videos
                                </SelectItem>
                                <SelectItem value="Influencer Collabs">
                                  Influencer Collabs
                                </SelectItem>
                              </>
                            )}
                            {form.watch("category") === "Video Editing" && (
                              <>
                                <SelectItem value="Color Correction">
                                  Color Collection
                                </SelectItem>
                                <SelectItem value="Instagram Videos">
                                  Instagram Videos
                                </SelectItem>
                                <SelectItem value="Wedding Video Editors">
                                  Wedding Video Editors
                                </SelectItem>
                                <SelectItem value="Music Videos">
                                  Music Videos
                                </SelectItem>
                                <SelectItem value="Youtube Videos">
                                  YouTube Videos
                                </SelectItem>
                                <SelectItem value="Commercials">
                                  Commercials
                                </SelectItem>
                              </>
                            )}
                            {form.watch("category") === "Music" && (
                              <>
                                <SelectItem value="Sync Sound">
                                  Sync Sound
                                </SelectItem>
                                <SelectItem value="Dubbing Artist">
                                  Dubbing Artist
                                </SelectItem>
                                <SelectItem value="SFX Editing">
                                  SFX Editing
                                </SelectItem>
                                <SelectItem value="Mixing and Mastering">
                                  Mixing and Mastering
                                </SelectItem>
                                <SelectItem value="Music Direction">
                                  Music Direction
                                </SelectItem>
                              </>
                            )}
                            {form.watch("category") === "Writers" && (
                              <>
                                <SelectItem value="Content Writers">
                                  Content Writers
                                </SelectItem>
                                <SelectItem value="Script Writers">
                                  Script Writers
                                </SelectItem>
                              </>
                            )}
                            {form.watch("category") === "Photographers" && (
                              <>
                                <SelectItem value="Fashion Photographers">
                                  Fashion Photographers
                                </SelectItem>
                                <SelectItem value="Event Photographers">
                                  Event Photographers
                                </SelectItem>
                              </>
                            )}
                            {form.watch("category") === "Visual Graphics" && (
                              <>
                                <SelectItem value="Social Media Animations">
                                  Social Media Animations
                                </SelectItem>
                                <SelectItem value="Logo and Subtitles">
                                  Logo and Subtitles
                                </SelectItem>
                                <SelectItem value="Illustrators">
                                  Illustrators
                                </SelectItem>
                                <SelectItem value="Intros and Outros">
                                  Intros and Outros
                                </SelectItem>
                                <SelectItem value="VFX and Motion Graphics">
                                  VFX and Motion Graphics
                                </SelectItem>
                              </>
                            )}
                            {/* Add more subcategory options based on the selected category */}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Question-Answer Sets */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">
                    Questions & Answers
                  </h3>
                  {faqFields.map((field, index) => (
                    <div key={field.id} className="mb-4">
                      <FormField
                        control={form.control}
                        name={`faqs.${index}.question`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter question" {...field} />
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
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant='outline'
                        onClick={() => handleRemoveQuestionAnswer(index)}
                        className="mt-2"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <div className="space-x-2">
                    <Button
                      type="button"
                      variant='outline'
                      onClick={handleAddQuestionAnswer}
                      className="px-4 mb-4"
                    >
                      Add Question-Answer Set
                    </Button>
                  </div>
                </div>

                {/* Pricing Plans */}

                <h3 className="text-2xl font-bold mb-4">Pricing Plans</h3>
                <Form {...form}>
                  {["Basic", "Premium", "Custom"].map((plan, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                    >
                      <h4 className="text-xl font-semibold mb-2 md:col-span-4">
                        {plan}
                      </h4>
                      <FormField
                        control={form.control}
                        name={`packages.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter package title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`packages.${index}.per`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Per</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter per unit" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`packages.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter price" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`packages.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter package description"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </Form>
                {/* {Save Changes button} */}
                <div className="flex justify-start">
                  <Button
                    type="submit"
                    // onClick={handleUpdateGig}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    {isNewGig ? "Create New Gig" : "Save All Changes"}
                  </Button>
                </div>
                <div className="flex justify-start">
                  {gigData?.status === "isDraft" ? (
                    <div className="flex flex-col">
                      <p className="mb-2">
                        Save changes and make this gig live
                      </p>
                      <Button
                        onClick={handleGoLive}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        Make Gig Live
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <p className="mb-2 text-center">
                        Remove Live and make draft
                      </p>
                      <Button
                        onClick={handleMakeDraft}
                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                      >
                        Make Gig Draft
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {isPending && <p>Updating gig...</p>}
              {isError && <p>Error updating gig: {error.message}</p>}
            </div>
          </form>
        </Form>
      </section>
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
            <AlertDialogCancel
              onClick={() => {
                setIsAlertOpen(false);
              }}
            >
              Stay
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsFormDirty(false);
                if (intendedRoute) {
                  router.push(intendedRoute); // Navigate to the intended route
                } else {
                  router.back(); // Go back if no intended route is set
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
              You cannot make this Gig live without these fields
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="error-messages">
                {alertMessages.map((message, index) => (
                  <p key={index}>{message}</p>
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

      <style jsx>{`
        .error-messages p {
          margin-bottom: 0.5rem;
          color: red;
        }
      `}</style>
    </div>
  );
}

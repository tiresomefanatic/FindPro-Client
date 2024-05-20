"use client"
import * as React from "react";
import Image from "next/image";
import { GigSlideshow } from "@/components/GigSlideshow";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { on } from "stream";
import { useEffect, useState } from "react";

// Define the form schema using Zod
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string(),
  category: z.string(),
  subCategory: z.string(),
  faqs: z.array(
    z.object({
      question: z.string().min(1, {
        message: "Question cannot be empty.",
      }),
      answer: z.string().min(1, {
        message: "Answer cannot be empty.",
      }),
    })
  ),
  packages: z.array(
    z.object({
      name: z.enum(["Basic", "Premium", "Custom"]),
      per: z.string(),
      price: z.string(),
      description: z.string(),
    })
  ),
});

export default function GigForm({ isNewGig, gigId }: { isNewGig: boolean, gigId: string }) {
  const router = useRouter();
  //const { gigId } = router.query;
 // const isNewGig = router.pathname === "/createGigPage";

  const queryClient = useQueryClient();

  const [isFormDirty, setIsFormDirty] = useState(false);
 const [isAlertOpen, setIsAlertOpen] = useState(false);


  const { data: gigData, isLoading: isGigLoading, error: gigError } = useQuery({
    queryKey: ["gig", gigId],
    queryFn: async () => {
      const response = await axios.get(`/api/gigs/${gigId}`);
      return response.data;
    },
    enabled: !!gigId,
  });
 


  const {
    mutate: updateGigMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (updateData: Partial<z.infer<typeof formSchema>>) => {
      const response = await axios.put(
        `/api/gigs/updateGig?gigId=${gigId}`,
        updateData
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["gig", data._id], data);
    },
  });

  // Define the form using react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: gigData?.title || "",
      description: gigData?.description || "",
      category: gigData?.category || "",
      subCategory: gigData?.subCategory || "",
      faqs: gigData?.faqs || [],
      packages: gigData?.packages || [
        { name: "basic", per: "", price: "", description: "" },
        { name: "premium", per: "", price: "", description: "" },
        { name: "custom", per: "", price: "", description: "" },
      ],
    },
  });
  


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
    }
  }, [gigData, form]);

 

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        setIsFormDirty(true);
      }
    });
  
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (isFormDirty && !isAlertOpen) {
        router.events.emit("routeChangeError");
        setIsAlertOpen(true);
        throw "Abort route change. Please ignore this error.";
      }
    };
  
    router.events.on("routeChangeStart", handleRouteChange);
  
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [isFormDirty, isAlertOpen, router.events]);


  const handleUpdateGig = (
    field: keyof z.infer<typeof formSchema>,
    value: any
  ) => {
    updateGigMutation({ [field]: value });
  };

  const handleAddQuestionAnswer = () => {
    form.setValue("faqs", [
      ...form.getValues("faqs"),
      { question: "", answer: "" },
    ]);
  };

  const handleRemoveQuestionAnswer = (index: number) => {
    const faqs = form.getValues("faqs");
    form.setValue(
      "faqs",
      faqs.filter((_, i) => i !== index)
    );
  };

  const handleSaveQuestionAnswers = () => {
    const filteredQuestionAnswers = form
      .getValues("faqs")
      .filter((qa) => qa.question.trim() !== "" && qa.answer.trim() !== "");

    if (filteredQuestionAnswers.length === form.getValues("faqs").length) {
      handleUpdateGig("faqs", filteredQuestionAnswers);
    } else {
      console.log(
        "Please fill in all question and answer fields before saving."
      );
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      updateGigMutation({
        title: data.title,
        description: data.description,
        category: data.category,
        subCategory: data.subCategory,
        faqs: data.faqs,
        packages: data.packages,
      });
      console.log("Gig updated successfully");
    } catch (error) {
      console.error("Error updating gig:", error);
    }
  };

  if (isGigLoading) {
    return <div>Loading...</div>;
  }

  if (gigError) {
    return <div>Error: {gigError.message}</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <section className="bg-white dark:bg-background py-8 lg:py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-12 lg:gap-8">
            <div className="xl:col-span-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(() => {onSubmit})}
                  className="space-y-8"
                >
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
                  {/* <Button
                    variant="gooeyLeft"
                    onClick={() =>
                      handleUpdateGig("title", form.getValues("title"))
                    }
                    className="mb-8"
                  >
                    Save Title
                  </Button> */}

                  {/* Seller info */}
                  <div className="flex items-center mb-6">
                    <Image
                      src="/avatars/simran.jpg"
                      alt="Simran"
                      width={50}
                      height={50}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-medium">Simran</h3>
                      <p className="text-gray-500">
                        Pakistan | I speak English | 107 orders completed
                      </p>
                    </div>
                  </div>

                  {/* Slideshow */}
                  <div className="mb-8 relative z-0">
                    <GigSlideshow />
                  </div>

                  {/* Gig description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter gig description"
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <Button
                    onClick={() =>
                      handleUpdateGig(
                        "description",
                        form.getValues("description")
                      )
                    }
                    className="mb-8"
                  >
                    Save Description
                  </Button> */}

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
                          defaultValue={gigData?.category || ""}                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Categories</SelectLabel>
                              <SelectItem value="video-production">
                                Video Production
                              </SelectItem>
                              <SelectItem value="video-editing">
                                Video Editing
                              </SelectItem>
                              <SelectItem value="sound">Sound</SelectItem>
                              <SelectItem value="writers">Writers</SelectItem>
                              <SelectItem value="photographers">
                                Photographers
                              </SelectItem>
                              <SelectItem value="visual-graphics">
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
                              {form.watch("category") ===
                                "video-production" && (
                                <>
                                  <SelectItem value="wedding-films">
                                    Wedding Films
                                  </SelectItem>
                                  <SelectItem value="social-media-videos">
                                    Social Media Videos
                                  </SelectItem>
                                  <SelectItem value="music-videos">
                                    Music Videos
                                  </SelectItem>
                                  <SelectItem value="influencer-collabs">
                                    Influencer Collabs
                                  </SelectItem>
                                </>
                              )}
                              {form.watch("category") ===
                                "video-editing" && (
                                <>
                                  <SelectItem value="color-collection">
                                    Color Collection
                                  </SelectItem>
                                  <SelectItem value="instagram-videos">
                                    Instagram Videos
                                  </SelectItem>
                                  <SelectItem value="wedding-video-editors">
                                    Wedding Video Editors
                                  </SelectItem>
                                  <SelectItem value="music-videos">
                                    Music Videos
                                  </SelectItem>
                                  <SelectItem value="youtube-videos">
                                    YouTube Videos
                                  </SelectItem>
                                  <SelectItem value="commercials">
                                    Commercials
                                  </SelectItem>
                                </>
                              )}
                              {form.watch("category") === "sound" && (
                                <>
                                  <SelectItem value="sync-sound">
                                    Sync Sound
                                  </SelectItem>
                                  <SelectItem value="dubbing-artist">
                                    Dubbing Artist
                                  </SelectItem>
                                  <SelectItem value="sfx-editing">
                                    SFX Editing
                                  </SelectItem>
                                  <SelectItem value="mixing-and-mastering">
                                    Mixing and Mastering
                                  </SelectItem>
                                  <SelectItem value="music-direction">
                                    Music Direction
                                  </SelectItem>
                                </>
                              )}
                              {form.watch("category") === "writers" && (
                                <>
                                  <SelectItem value="content-writers">
                                    Content Writers
                                  </SelectItem>
                                  <SelectItem value="script-writers">
                                    Script Writers
                                  </SelectItem>
                                </>
                              )}
                              {form.watch("category") ===
                                "photographers" && (
                                <>
                                  <SelectItem value="fashion-photographers">
                                    Fashion Photographers
                                  </SelectItem>
                                  <SelectItem value="event-photographers">
                                    Event Photographers
                                  </SelectItem>
                                </>
                              )}
                              {form.watch("category") ===
                                "visual-graphics" && (
                                <>
                                  <SelectItem value="social-media-animations">
                                    Social Media Animations
                                  </SelectItem>
                                  <SelectItem value="logo-and-subtitles">
                                    Logo and Subtitles
                                  </SelectItem>
                                  <SelectItem value="illustrators">
                                    Illustrators
                                  </SelectItem>
                                  <SelectItem value="intros-and-outros">
                                    Intros and Outros
                                  </SelectItem>
                                  <SelectItem value="vfx-and-motion-graphics">
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
                    {form.getValues("faqs").map((_, index) => (
                      <div key={index} className="mb-4">
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
                                  className="w-full"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          onClick={() => handleRemoveQuestionAnswer(index)}
                          className="mt-2"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="space-x-2">
                      <Button
                        onClick={handleAddQuestionAnswer}
                        className="px-4 mb-4"
                      >
                        Add Question-Answer Set
                      </Button>
                      {/* <Button
                        onClick={handleSaveQuestionAnswers}
                        className="px-4 mb-4"
                      >
                        Save Question-Answer Sets
                      </Button> */}
                    </div>
                  </div>
                  <Button
        type="button"
        onClick={() => {
          const formData = form.getValues();
          handleUpdateGig("title", formData.title);
          handleUpdateGig("description", formData.description);
          handleUpdateGig("category", formData.category);
          handleUpdateGig("subCategory", formData.subCategory);
          handleUpdateGig("faqs", formData.faqs);
          handleUpdateGig("packages", formData.packages);
        }}
      >
               {isNewGig ? "Create New Gig" : "Save All Changes"}

      </Button>
                </form>
              </Form>
            </div>
            {/* Pricing Plans */}
            <div className="xl:col-span-4">
              <h3 className="text-2xl font-bold mb-4">Pricing Plans</h3>
              <Form {...form}>
                {["Basic", "Premium", "Custom"].map((plan, index) => (
                  <div key={index} className="mb-8">
                    <h4 className="text-xl font-semibold mb-2">{plan}</h4>
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
                        <FormItem>
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
                {/* <Button
                  onClick={() =>
                    handleUpdateGig("packages", form.getValues("packages"))
                  }
                >
                  Save Pricing Plans
                </Button> */}
              </Form>
            </div>
            
          </div>

          {isPending && <p>Updating gig...</p>}
          {isError && <p>Error updating gig: {error.message}</p>}
        </div>
      </section>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
      <AlertDialogDescription>
        You have unsaved changes. If you leave now, your changes will be lost.
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
          router.push(router.asPath);
        }}
      >
        Leave
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  );
}

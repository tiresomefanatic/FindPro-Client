"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/components/ui/command"
import { AutosizeTextarea } from "@/components/ui/autoResizeTextArea";
import MultipleSelector, { Option } from "@/components/ui/multipleSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FixedCropper from "@/components/ImageCropper";
import { useEdgeStore } from "@/lib/edgeStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/router';
import {toast} from 'sonner'
import axios from "axios";
import { useDispatch } from "react-redux";
import { setIsAuthenticated, setLoggedInAt, setUser } from "@/redux/authSlice";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  location: z.string().optional(),
  languages: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  phoneNumber: z.string().optional(),
  profilePic: z.string().optional()
});

export default function ProfileForm() {

 const { edgestore } = useEdgeStore();
 const [profilePicUrl, setProfilePicUrl] = useState('')
 const [userKiId, setUserKiId] = useState('')

 const router = useRouter();
 const dispatch = useDispatch();
 
 
 const userName = router.query.userName?.toString() ?? '';
 const userId = router.query.userId?.toString() ?? '';


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
    form.setValue('name', decodeURIComponent(userName));
    setUserKiId(userId)
  }, [form, userName]);

  const { mutate: updateUserMutation, isPending, isError, error } = useMutation({
    mutationFn: async (updateData: Partial<z.infer<typeof formSchema>>) => {
      const response = await axios.put(`${baseUrl}/user/updateUser/${userKiId}`, updateData, {
        baseURL: baseUrl, // Set API base URL, does not work without it
        withCredentials: true,
      });
      const { isAuthenticated, userData } = response.data;
    },
    onSuccess: (isAuthenticated: any, userData) => {
      dispatch(setIsAuthenticated(isAuthenticated));
        dispatch(setUser(userData));
        dispatch(setLoggedInAt(Date.now()));
      toast.success('Welcome');
      router.push('/'); 
    },
    onError: (error) => {
      toast.error('Error updating user profile');
      console.error('Error updating user profile:', error);
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
      profilePic: profilePicUrl
    });
  }
  

  const handleProfilePicUpload = async (croppedBlob: Blob) => {
  

    const uploadPromises = [
      (async () => {
        const croppedFile = new File([croppedBlob], "cropped_image.png", { type: "image/png" });
        const res = await edgestore.profilePics.upload({
          file: croppedFile,
          options: {
            temporary: true,
          },
          onProgressChange: (progress) => {
           // setUploadProgress(progress);
          },
        });
        console.log(res);
        setProfilePicUrl(res.url);

        return {
         // uid: generateUniqueId(),
         // src: res.url,
        };
      })(),
    ];

    const uploadedImages = await Promise.all(uploadPromises);
   // dispatch(setImages([...images, ...uploadedImages]));

   // setUploadProgress(0);
   // setDisableDropBox(false);
  };


  const frameworks= [
    { label: 'Hyderabad', value: 'Hyderabad' },
    { label: 'Bengaluru', value: 'Bengaluru' },
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'Delhi', value: 'Delhi' },
    { label: 'Chennai', value: 'Chennai' },
    ];
    const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <div>
    <Avatar>
      <AvatarImage src="https://files.edgestore.dev/b4qgt9tvc94ovz0g/publicFiles/_public/856330eb-8093-4651-9a8a-098a8a3ec1d7.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <FixedCropper isGigImage={false} onCrop={handleProfilePicUpload} />
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
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <AutosizeTextarea className="w-full resize-none" {...field} />
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
              <FormControl>
             
             
              <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>

              </FormControl>
              <FormDescription>
            
              </FormDescription>
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
                  // defaultOptions={OPTIONS}
                  placeholder="Type something that does not exist in dropdowns..."
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
                  // defaultOptions={OPTIONS}
                  placeholder="Type something that does not exist in dropdowns..."
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

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 123-456-7890" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  );
}

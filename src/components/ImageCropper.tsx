"use client";

import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { useEdgeStore } from "../lib/edgeStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


interface FixedCropperProps {
  isGigImage: boolean;
  onCrop: (croppedBlob: Blob) => void;
}

const FixedCropper: React.FC<FixedCropperProps> = ({ isGigImage, onCrop }) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [cropper, setCropper] = useState<Cropper | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const { edgestore } = useEdgeStore();
  const [isCropping, setIsCropping] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[] , fileRejections: FileRejection[],) => {
    

    const reader = new FileReader();
    if (fileRejections.length > 0) {
        toast.error("Can only upload one file at once");
        return;
      }
    reader.onload = () => {
      setImage(reader.result as string);
      setFile(acceptedFiles[0]);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
        'image/*' : ['.jpeg', '.png', '.jpg', '.svg' ]
      }
  });

  const cropImage = async () => {
    if (cropper && file) {
      // Get the original image dimensions
      setIsCropping(true)
      const originalWidth = cropper.getImageData().naturalWidth;
      const originalHeight = cropper.getImageData().naturalHeight;

      // Calculate the dimensions for the cropped canvas
      const size = Math.min(originalWidth, originalHeight);
      const croppedWidth = size;
      const croppedHeight = size;

      const canvas = cropper.getCroppedCanvas({
        width: croppedWidth,
        height: croppedHeight,
        fillColor: "#00",
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      // Convert the canvas to a circle
      if (!isGigImage) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.globalCompositeOperation = "destination-in";
          ctx.beginPath();
          ctx.arc(
            croppedWidth / 2,
            croppedHeight / 2,
            croppedWidth / 2,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
      }

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob as Blob);
        }, file.type);
      });
      
      // Create a new File object with the cropped image data
      const croppedFile = new File([blob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });
      
      onCrop(croppedFile);
      setIsCropping(false)
      

    }
  };

  const aspectRatio = !isGigImage ? 1 : 16 / 9;

  return (
    <div >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline'>
            {!isGigImage ? "Edit Profile Pic" : "Upload an Image"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop and Upload Image</DialogTitle>
            <DialogDescription>
              Drag and drop an image, or click to select an image. Adjust the
              cropping area and click Upload to crop and upload the image.
            </DialogDescription>
          </DialogHeader>
          <div
            {...getRootProps()}
            style={{ border: "2px dashed gray", padding: "20px" }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <p>Drag and drop an image here, or click to select an image</p>
            )}
          </div>
          {image && (
            <div>
              <Cropper
                src={image}
                style={{ height: 400, width: "100%" }}
                aspectRatio={aspectRatio}
                 viewMode={1}
                minCropBoxWidth={200}
                minCropBoxHeight={200}
                autoCropArea={1}
                dragMode="move"
                cropBoxMovable={false}
                cropBoxResizable={false}
                zoomable={true}
               // scalable={true}
                guides={true}
                responsive={true}
                onInitialized={(instance) => setCropper(instance)}
              />
            </div>
          )}
          {!isGigImage && (
            <style>{`
           .cropper-crop-box, .cropper-view-box {
            border-radius: 50%;
        }
        .cropper-view-box {
            box-shadow: 0 0 0 1px #39f;
            outline: 0;
        }
        .cropper-face {
          background-color:inherit !important;
        }
        
        .cropper-dashed, .cropper-line {
          display:none !important;
        }
        .cropper-view-box {
          outline:inherit !important;
        }
        
        .cropper-point.point-se {
          top: calc(85% + 1px);
          right: 14%;
        }
        .cropper-point.point-sw {
          top: calc(85% + 1px);
          left: 14%;
        }
        .cropper-point.point-nw {
          top: calc(15% - 5px);
          left: 14%;
        }
        .cropper-point.point-ne {
          top: calc(15% - 5px);
          right: 14%;
        }
          `}</style>
          )}
          {isCropping ? <div>cropping....</div> : <Button onClick={cropImage} disabled={!image}>
            {!isGigImage ? "Edit Profile Pic" : "Upload Gig"}
          </Button> }
          
        </DialogContent>
        <DialogFooter></DialogFooter>
      </Dialog>
    </div>
  );
};

export default FixedCropper;

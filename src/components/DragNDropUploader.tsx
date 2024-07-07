import {
  createContext,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";
import { useSelector, useDispatch } from "react-redux";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DragHandleButton } from "@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button";
import { RootState } from "../redux/store";
import {
  swapImages,
  removeImage,
  addConfirmUploadUrls,
  removeConfirmUploadUrl,
  setImages,
} from "../redux/portfolioMediaSlice";
import { useEdgeStore } from "@/lib/edgeStore";
import { Progress } from "./ui/progress";
import { useDropzone } from "react-dropzone";
import { Trash2 } from "lucide-react";
import FixedCropper from "./ImageCropper";

//for drag and drop
function getInstanceId() {
  return Symbol("instance-id");
}

// Function to generate a unique ID for each image item
const generateUniqueId = (): string => {
  return Math.random().toString(36).slice(2, 11);
};

//for drag and drop
const InstanceIdContext = createContext<symbol | null>(null);

//single image item component
const Item = memo(function Item({ id, src }: { id: string; src: string }) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [state, setState] = useState<"idle" | "dragging" | "over">("idle");


  const instanceId = useContext(InstanceIdContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return combine(
      draggable({
        element: el,
        getInitialData: () =>
          ({ type: "grid-item", id, src, instanceId } as const),
        onDragStart: () => setState("dragging"),
        onDrop: () => setState("idle"),
      }),
      dropTargetForElements({
        element: el,
        getData: () => ({ id, src }),
        getIsSticky: () => true,
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId &&
          source.data.type === "grid-item" &&
          source.data.id !== id,
        onDragEnter: () => setState("over"),
        onDragLeave: () => setState("idle"),
        onDrop: ({ source }) => {
          setState("idle");
          const sourceId = source.data.id;
          if (typeof sourceId === "string") {
            dispatch(swapImages({ sourceId, targetId: id }));
          }
        },
      })
    );
  }, [instanceId, id, src, dispatch]);

  // To prevent right-click menu from opening when holding on the Image-Item. Image item needs to be held for half-a-sec for it to be draggable, but holding for half-a-sec on touchscreens opens rightclick menu
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const itemStyles = `object-cover overflow-hidden w-32 h-32 box-border bg-white p-1 rounded shadow transition-all duration-300 ease-in-out ${
    state === "idle" ? "hover:bg-gray-100 hover:shadow-lg" : ""
  } ${state === "dragging" ? "filter grayscale opacity-50" : ""} ${
    state === "over"
      ? "transform scale-110 rotate-6 filter brightness-110 shadow-lg"
      : ""
  }touch-none m-4`;
  //Keep <DragHandleButton/> without it images are buggy to drag because of browser's in-built behaviour of opening right-click menu and other hold-to-reveal-menus
  return (
    <div ref={ref} className={itemStyles} onContextMenu={handleContextMenu}>
      <DragHandleButton label="Reorder" className=" m-1" />

      <img src={src} className="w-32 h-16 object-cover"> 
      
      
      </img>
    </div>
  );
});

const TrashIcon = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const confirmUploadUrls = useSelector(
    (state: RootState) => state.portfolioMedia.confirmUploadUrls
  );
  const [isOver, setIsOver] = useState(false);
  const { edgestore } = useEdgeStore();


  const handleDelete = useCallback(async (urlToDelete: string) => {
    console.log('Deleting...');
    await edgestore.publicFiles.delete({
      url: urlToDelete,
    });
  }, [edgestore]);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return combine(
      dropTargetForElements({
        element: el,
        getData: () => ({}),
        canDrop: ({ source }) => source.data.type === "grid-item",
        onDragEnter: () => setIsOver(true),
        onDragLeave: () => setIsOver(false),
        onDrop: ({ source }) => {
          const itemId = source.data.id;

          if (typeof itemId === "string") {
            dispatch(removeImage(itemId));
            const itemSrc = source.data.src;

            if (
              typeof itemSrc === "string" &&
              confirmUploadUrls.includes(itemSrc)
            ) {
              dispatch(removeConfirmUploadUrl(itemSrc));
            }
            
            handleDelete(itemSrc as string)
          
          }
          setIsOver(false);
        },
      }),
      monitorForElements({
        onDragStart: () => setIsOver(false),
        onDrop: () => setIsOver(false),
      })
    );
  }, [dispatch, confirmUploadUrls, handleDelete]);

  return (
    <div
      ref={ref}
      className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${
        isOver ? "bg-red-500" : "bg-white"
      }`}
    >
      <Trash2
        className={`w-6 h-6 ${isOver ? "text-white" : "text-gray-500"}`}
      />
    </div>
  );
};

interface DragNDropUploaderProps {
  onUploadStatusChange: (isUploading: boolean) => void;
}

export default function DragNDropUploader({ onUploadStatusChange }: DragNDropUploaderProps) {
  const images = useSelector((state: RootState) => state.portfolioMedia.images);
  const dispatch = useDispatch();
  const { edgestore } = useEdgeStore();
  const confirmUploadUrls = useSelector(
    (state: RootState) => state.portfolioMedia.confirmUploadUrls
  );

  //console.log("images", images);
  //console.log("confirm upload urls", confirmUploadUrls);

  //to render progress bar
  const [uploadProgress, setUploadProgress] = useState(0);
  //to disable the DropZone while uploading
  const [disableDropBox, setDisableDropBox] = useState(false);
  const [isUploading , setIsUploading] = useState(false)

  useEffect(() => {
    onUploadStatusChange(isUploading);
  }, [isUploading, onUploadStatusChange]);


  const onCrop = async (croppedBlob: Blob) => {
    setDisableDropBox(true);
    setIsUploading(true)

    const uploadPromises = [
      (async () => {
        const croppedFile = new File([croppedBlob], "cropped_image.png", { type: "image/png" });
        const res = await edgestore.publicFiles.upload({
          file: croppedFile,
          options: {
            temporary: true,
          },
          onProgressChange: (progress) => {
            setUploadProgress(progress);
          },
        });
        console.log(res);
        dispatch(addConfirmUploadUrls(res.url));

        return {
          uid: generateUniqueId(),
          src: res.url,
        };
      })(),
    ];

    const uploadedImages = await Promise.all(uploadPromises);
    dispatch(setImages([...images, ...uploadedImages]));

    setUploadProgress(0);
    setDisableDropBox(false);
    setIsUploading(false)
  };

  const [instanceId] = useState(getInstanceId);

  return (
    <div className="w-full h-full gap-8 mt-2.5">
      <InstanceIdContext.Provider value={instanceId}>
        <div className="flex w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 place-items-center bg-gray-100 gap-2 w-full">
            {images.map(({ uid, src }) => (
              <Item id={uid} src={src} key={uid} />
            ))}
          </div>
        </div>
      </InstanceIdContext.Provider>
     {images.length>0 && ( <TrashIcon />)}
     

      {uploadProgress === 0 ? (
   <div className="w-full">
    {isUploading ? <div>Loading...</div> : 
        <FixedCropper isGigImage={true} onCrop={onCrop} />
      }
        </div>
      ) : (
        <div className="bg-red-100">
          <p className="text-md text-gray-400 bg-green-300">Uploading Files...</p>
          <Progress value={uploadProgress} className="w-full max-w-lg" />
        </div>
      )}
    </div>
  );
}

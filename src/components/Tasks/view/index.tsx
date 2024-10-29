import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  addPostCommentsAPI,
  getCommentsAPI,
  getSingleTaskAPI,
  getTagsAPI,
} from "@/lib/services/tasks";
import { useQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { capitalizeWords } from "@/lib/helpers/CapitalizeWords";

const TaskView = () => {
  const navigate = useNavigate();
  const { taskId } = useParams({ strict: false });
  const [commentsData, setCommentsData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [viewData, setViewData] = useState<any>();
  const [tagsData, setTagsData] = useState<any>();
  console.log(tagsData, "task");

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["getSingleTask", taskId],
    queryFn: async () => {
      const response = await getSingleTaskAPI(taskId);
      const taskData = response?.data?.data;

      try {
        if (response?.status === 200 || response?.status === 201) {
          setViewData(taskData);
        } else {
          throw new Error("Failed to fetch task");
        }
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
        throw err;
      }
    },
    enabled: Boolean(taskId),
  });
  const { isFetching } = useQuery({
    queryKey: ["gettags", taskId],
    queryFn: async () => {
      const response = await getTagsAPI(taskId);
      const tagsData = response?.data?.data;
      try {
        if (response?.status === 200 || response?.status === 201) {
          setTagsData(tagsData);
        } else {
          throw new Error("Failed to fetch task");
        }
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
        throw err;
      }
    },
  });

  const addComment = async () => {
    setLoading(true);
    try {
      const payload = {
        task_id: taskId,
        message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const response = await addPostCommentsAPI(taskId, payload);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message || "Comment added successfully");
        // Optionally, refresh comments here after adding
        // await getAllComments();
        setMessage(""); // Clear the message input after adding a comment
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const title = viewData?.project_description;
  const shouldShowDescriptionTooltip = title && title.length > 30;
  const truncatedDescription = shouldShowDescriptionTooltip
    ? `${title.substring(0, 30)}...`
    : title;

  return (
    <div className="p-4 flex flex-col space-y-6 md:space-y-0 md:flex-row md:space-x-6">
      {/* Left Section - Task Details */}
      <div className="md:w-2/3 w-full bg-white rounded-lg shadow-md p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="">
            <h1 className="text-2xl font-semibold">
              {capitalizeWords(viewData?.title)}
            </h1>
            <p className="text-gray-500">Project</p>
            <p className="font-semibold text-gray-800">
              {viewData?.project_title}
            </p>
            <p className="font-sm text-gray-800">
              {capitalizeWords(viewData?.project_description)}
            </p>
          </div>
          <div className="text-blue-500 bg-gray-100 px-3 py-1 rounded-md">
            Tags
          </div>
          <div className="flex space-x-2">
            {tagsData && tagsData.length > 0 ? (
              tagsData.map((tag: any, idx: any) => (
                <Badge key={idx} className="bg-pink-400" variant="outline">
                  {tag.title}
                </Badge>
              ))
            ) : (
              <p>--</p>
            )}
          </div>
        </div>

        {/* Assigned To Section */}
        <div>
          <h2 className="font-semibold">Assigned To</h2>
          <div className="mt-2">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3">S No</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Loop through each member */}
                {[
                  { name: "Pavan", role: "Manager" },
                  { name: "Gowtham", role: "Member" },
                  { name: "Sudhakar", role: "Member" },
                ].map((person, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-3">{`0${idx + 1}`}</td>
                    <td className="py-2 px-3 flex items-center space-x-2">
                      <img
                        className="w-8 h-8 rounded-full"
                        src="https://i.pravatar.cc/150?img=4"
                        alt="Avatar"
                      />
                      <span>{person.name}</span>
                      <span className="text-green-600 ml-2">{person.role}</span>
                    </td>
                    <td className="py-2 px-3">
                      <button className="text-red-500">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attachments Section */}
        <div>
          <h2 className="font-semibold">Attachments</h2>
          <div className="mt-2 space-y-2">
            {/* Loop through each attachment */}
            {Array(6)
              .fill("user-journey-01.pdf")
              .map((file, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border rounded-md p-2"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">📄</span>
                    <p>{file}</p>
                  </div>
                  <div className="text-gray-500 flex items-center space-x-2">
                    <span>604KB</span>
                    <button className="text-gray-500">⋮</button>
                  </div>
                </div>
              ))}
          </div>
          <button className="bg-red-500 text-white flex items-center space-x-2 mt-4 px-4 py-2 rounded-md">
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Right Section - Comments */}
      <div className="md:w-1/3 w-full bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="font-semibold">Comments</h2>
        {/* Loop through each comment */}
        <div className="space-y-4">
          <div className="border-b pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://i.pravatar.cc/150?img=5"
                  alt="Avatar"
                />
                <span className="font-semibold">Robert</span>
                <span className="text-gray-500 text-sm">1 month ago</span>
              </div>
              <button className="text-blue-500">Reply</button>
            </div>
            <p className="mt-2 text-gray-600">
              Impressive! Though it seems the drag feature could be improved.
              But overall it looks incredible.
            </p>
          </div>

          {/* Nested Reply */}
          <div className="ml-8 border-b pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://i.pravatar.cc/150?img=6"
                  alt="Avatar"
                />
                <span className="font-semibold">Dyane</span>
                <span className="text-gray-500 text-sm">1 week ago</span>
              </div>
              <button className="text-blue-500">Reply</button>
            </div>
            <p className="mt-2 text-gray-600">
              @Robert If you’re still new, I’d recommend focusing on the
              fundamentals of HTML, CSS, and JS before considering React.
            </p>
          </div>
        </div>

        {/* Add Comment Section */}
        <div className="flex items-center space-x-3 mt-4">
          <img
            className="w-8 h-8 rounded-full"
            src="https://i.pravatar.cc/150?img=4"
            alt="User"
          />
          <input
            type="text"
            className="flex-grow border rounded-md px-4 py-2 focus:outline-none"
            placeholder="Add a comment..."
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Send
          </button>
        </div>
      </div>
    </div>

    // <div className="grid grid-cols-[60%_40%] gap-4">
    //   <div>
    //     <>
    //       <div className="flex justify-between items-center border p-6">
    //         <div>
    //           <p className="font-bold">{viewData?.title}</p>
    //           <label>Project </label>
    //           <p className="font-semibold">{viewData?.project_title}</p>

    //           <div>
    //             <TooltipProvider>
    //               <Tooltip>
    //                 <TooltipTrigger asChild>
    //                   <span className="text-sm text-gray-500 cursor-pointer ">
    //                     {truncatedDescription}
    //                   </span>
    //                 </TooltipTrigger>
    //                 {shouldShowDescriptionTooltip && (
    //                   <TooltipContent
    //                     style={{
    //                       backgroundColor: "white",
    //                       border: "1px solid #e0e0e0",
    //                       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    //                       borderRadius: "4px",
    //                       padding: "8px",
    //                       maxWidth: "300px",
    //                       fontSize: "14px",
    //                       whiteSpace: "normal",
    //                       wordWrap: "break-word",
    //                     }}
    //                   >
    //                     <div className="tooltipContent">{title}</div>
    //                   </TooltipContent>
    //                 )}
    //               </Tooltip>
    //             </TooltipProvider>
    //           </div>
    //           <div className="space-y-2">
    //             <h4 className="font-semibold">Tags</h4>
    //             <div className="flex space-x-2">
    //               {tagsData && tagsData.length > 0 ? (
    //                 tagsData.map((tag: any, idx: any) => (
    //                   <Badge
    //                     key={idx}
    //                     className="bg-pink-400"
    //                     variant="outline"
    //                   >
    //                     {tag.title}
    //                   </Badge>
    //                 ))
    //               ) : (
    //                 <p>No tags available</p>
    //               )}
    //             </div>
    //           </div>
    //         </div>

    //         {/* <div className="space-y-2">
    //           <h4 className="font-semibold">Tags</h4>
    //           <div className="flex space-x-2">
    //             {singleTask.tags?.map((tag: any, idx: any) => (
    //               <Badge key={idx} variant="outline">
    //                 {tag}
    //               </Badge>
    //             ))}
    //           </div>
    //         </div> */}
    //       </div>
    //       {/*
    //       <div className="space-y-2">
    //         <h4 className="font-semibold">Assigned To</h4>
    //         <div className="border rounded p-4">
    //           {singleTask.assignedUsers?.map((user: any, index: any) => (
    //             <div
    //               key={user.id}
    //               className="flex items-center justify-between py-2"
    //             >
    //               <div className="flex items-center space-x-3">
    //                 <span>{String(index + 1).padStart(2, "0")}</span>
    //                 <Avatar className="w-8 h-8 rounded-full">
    //                   <img src={user.imageUrl} alt={user.name} />
    //                 </Avatar>
    //                 <span>{user.name}</span>
    //               </div>
    //               <span className="text-green-600">{user.role}</span>
    //             </div>
    //           ))}
    //         </div>
    //       </div> */}

    //       {/* <div className="space-y-2">
    //         <h4 className="font-semibold">Attachments</h4>
    //         <div className="space-y-2">
    //           {singleTask.attachments?.map((attachment: any) => (
    //             <div
    //               key={attachment.id}
    //               className="flex justify-between items-center border p-2 rounded"
    //             >
    //               <div className="flex items-center space-x-2">
    //                 <span className="text-xl">📄</span>
    //                 <p>{attachment.name}</p>
    //               </div>
    //               <div className="text-gray-500">
    //                 <p>{attachment.size}</p>
    //                 <p>{attachment.timestamp}</p>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //         <Button className="bg-red-500 flex items-center space-x-2">
    //           <UploadIcon className="w-4 h-4" />
    //           <span>Upload</span>
    //         </Button>
    //       </div> */}
    //     </>
    //   </div>
    //   {/* //   <div className="space-y-2 border p-6">
    // //     <div className="space-y-4">
    // //       <h4 className="font-semibold">Comments</h4>
    // //       <div className="space-y-4">
    // //         {commentsData.map((comment: any, index: any) => ( */}
    //   {/* //           <div key={comment.id} className="space-y-2"> */}
    //   // {/* Comment Bubble */}
    //   {/* //             <div className="flex items-start space-x-3"> */}
    //   // {/* Avatar */}
    //   {/* //               <Avatar className="w-8 h-8 rounded-full">
    //                <img
    //                   src={
    //                     singleTask?.assignedUsers[
    //                       index % singleTask.assignedUsers.length
    //                     ]?.imageUrl || "https://i.pravatar.cc/150?img=4"
    //                   }
    //                   alt={comment.author}
    //                 />
    //               </Avatar> */}
    //   {/*
    // //               <div className="bg-purple-50 p-4 rounded-lg shadow-md max-w-lg">
    // //                 <div className="flex justify-between items-center">
    // //                   <p className="font-semibold">{comment.author}</p>
    // //                   <p className="text-xs text-gray-500">
    // //                     {comment.timestamp}
    // //                   </p>
    // //                 </div>
    // //                 <p className="mt-1">{comment.content}</p>
    // //                 <p className="text-xs text-blue-500 cursor-pointer mt-2">
    // //                   Reply
    // //                 </p>
    // //               </div>
    // //             </div> */}
    // </div>
    //         ))}

    //         {/* Add Comment Section */}
    //         <div className="flex items-center space-x-3 mt-4">
    //           <Avatar className="w-8 h-8 rounded-full">
    //             <img src="https://i.pravatar.cc/150?img=4" alt="User" />
    //           </Avatar>
    //           <Input
    //             value={message}
    //             onChange={(e) => setMessage(e.target.value)}
    //             placeholder="Add a comment..."
    //             className="flex-grow"
    //             onKeyPress={(e) => {
    //               if (e.key === "Enter") {
    //                 addComment();
    //               }
    //             }}
    //           />
    //           <Button
    //             onClick={addComment}
    //             disabled={loading}
    //             className="bg-blue-500"
    //           >
    //             {loading ? "Adding..." : "Add"}
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default TaskView;

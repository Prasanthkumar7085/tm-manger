import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "@tanstack/react-router";
import { addPostCommentsAPI, getCommentsAPI } from "@/lib/services/tasks";
import { useQuery } from "@tanstack/react-query";

const TaskView = () => {
  const navigate = useNavigate();
  const { taskId } = useParams({ strict: false });
  const [commentsData, setCommentsData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [commentedby, setCommentBy] = useState<string>("");

  const getAllComments = async () => {
    try {
      const response = await getCommentsAPI();
      if (response.success) {
        const data = response?.data?.data;
        setCommentsData(data);
      } else {
        throw response;
      }
    } catch (errData) {
      console.error(errData);
      // Optionally display error message
      // errPopper(errData);
    }
  };

  const addComment = async () => {
    setLoading(true);
    try {
      const payload = {
        task_id: taskId,
        message: message,
        commented_by: commentedby,
        created_at: "",
        updated_at: "",
      };
      const response = await addPostCommentsAPI(taskId, payload);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message || "Comment Added successfully");
        navigate({
          to: "/tasks",
        });
      } else if (response?.status === 422 || response?.status === 409) {
        // setErrorMessages(response?.data?.errors);
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const { isFetching } = useQuery({
    queryKey: ["getAllComments"],
    queryFn: getAllComments,
    refetchOnWindowFocus: false,
    //  enabled:taskId,
  });

  const task = {
    title: " Millinium Medication Care",
    project: "DLW Sales",
    assignedUsers: [
      {
        id: 1,
        name: "Pavan",
        role: "Manager",
        imageUrl: "https://i.pravatar.cc/150?img=1",
      },
      {
        id: 2,
        name: "Gowtham",
        role: "Member",
        imageUrl: "https://i.pravatar.cc/150?img=2",
      },
      {
        id: 3,
        name: "Sudhakar",
        role: "Member",
        imageUrl: "https://i.pravatar.cc/150?img=3",
      },
    ],
    createdBy: { name: "Mark", createdAt: "04-01-2023, 04:33 PM" },
    dueDate: "05-01-2023, 10:00 AM",
    status: "In Progress",
    tags: ["Profitable", "AI", "Marketing", "Social", "Contents"],
    attachments: [
      {
        id: 1,
        name: "DLW Report-01.pdf",
        size: "604KB",
        timestamp: "2m ago",
      },
      {
        id: 2,
        name: "user-journey-01.pdf",
        size: "604KB",
        timestamp: "2m ago",
      },
    ],
    comments: [
      {
        id: 1,
        author: "Pavan",
        timestamp: "1 month ago",
        content: "This is the test comment 1 for task1",
      },
      {
        id: 2,
        author: "Gowtham",
        timestamp: "1 week ago",
        content: "This is the test comment 2",
        replyTo: "@Pavan",
      },
    ],
    comment: commentsData,
  };

  //   //  const firstHalf = task.comments.slice(0, Math.ceil(task.comments.length / 2));
  //   //  const secondHalf = task.comments.slice(Math.ceil(task.comments.length / 2));
  // const handleClick = () => {
  //   toast.success("Comment Added Successfully");
  //   navigate({
  //     to: "/tasks",
  //   });
  // };
  return (
    <div className="grid grid-cols-[60%_40%] gap-4">
      <div>
        <div className="flex justify-between items-center border p-6">
          <div>
            <p className="text-gray-500">Project: {task.project}</p>
            <p className="text- font-semibold">{task.title}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Tags</h4>

            <div className="flex space-x-2">
              {task.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Assigned To</h4>
          <div className="border rounded p-4">
            {task.assignedUsers.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-3">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Avatar className="w-8 h-8 rounded-full">
                    <img src={user.imageUrl} alt={user.name} />
                  </Avatar>
                  <span>{user.name}</span>
                </div>
                <span className="text-green-600">{user.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Attachments</h4>
          <div className="space-y-2">
            {task.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">📄</span>
                  <p>{attachment.name}</p>
                </div>
                <div className="text-gray-500">
                  <p>{attachment.size}</p>
                  <p>{attachment.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="bg-red-500 flex items-center space-x-2">
            <UploadIcon className="w-4 h-4" />
            <span>Upload</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2 border p-6">
        <div className="space-y-4">
          <h4 className="font-semibold">Comments</h4>
          <div className="space-y-4">
            {task.comments.map((comment, index) => (
              <div key={comment.id} className="space-y-2">
                {/* Comment Bubble */}
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <Avatar className="w-8 h-8 rounded-full">
                    <img
                      src={
                        task.assignedUsers[index % task.assignedUsers.length]
                          .imageUrl
                      }
                      alt={comment.author}
                    />
                  </Avatar>

                  <div className="bg-purple-50 p-4 rounded-lg shadow-md max-w-lg">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{comment.author}</p>{" "}
                      <p className="text-xs text-gray-500">
                        {comment.timestamp}
                      </p>
                    </div>
                    <p className="mt-1">{comment.content}</p>
                    <p className="text-xs text-blue-500 cursor-pointer mt-2">
                      Reply
                    </p>
                  </div>
                </div>

                {/* Reply Message */}
                {comment.replyTo && (
                  <div className="flex items-start space-x-3 ml-12">
                    {/* Avatar for reply */}
                    <Avatar className="w-8 h-8 rounded-full">
                      <img
                        src={
                          task.assignedUsers[
                            (index + 1) % task.assignedUsers.length
                          ].imageUrl
                        }
                        alt={comment.replyTo}
                      />
                    </Avatar>

                    <div className="bg-blue-50 p-4 rounded-lg shadow-md max-w-lg">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{comment.replyTo}</p>
                        <p className="text-xs text-gray-500">
                          {comment.timestamp}
                        </p>
                      </div>
                      <p className="mt-1">{comment.content}</p>
                      <p className="text-xs text-blue-500 cursor-pointer mt-2">
                        Reply
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Comment Section */}
            <div className="flex items-center space-x-3 mt-4">
              {/* Avatar */}
              <Avatar className="w-8 h-8 rounded-full">
                <img src="https://i.pravatar.cc/150?img=4" alt="current user" />
              </Avatar>

              {/* Comment Input */}
              <div className="flex items-center bg-gray-100 rounded-full p-3 w-full">
                <Input
                  placeholder="Add a comment..."
                  className="flex-grow bg-transparent border-none"
                  // value={message} // Bind the state to the input field
                  // onChange={(e) => setMessage(e.target.value)} // Update the state on input change
                />
                <Button
                  className="text-white bg-blue-600 rounded-full px-4 py-2 ml-2"
                  onClick={addComment}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskView;

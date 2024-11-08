import CKEditorComponent from "@/components/core/CKEditor/CKEditorComponent";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addCommentsAPI,
  deleteCommentsAPI,
  getCommentsForTaskAPI,
  updateCommentsAPI,
} from "@/lib/services/tasks";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow, format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import LoadingComponent from "@/components/core/LoadingComponent";
import RepliedComments from "./RepliedComments";
import { getAllMembers } from "@/lib/services/projects/members";
const TaskComments = ({ taskId }: any) => {
  const userID = useSelector(
    (state: any) => state.auth?.user?.user_details?.id
  );
  const [commentText, setCommentText] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);
  const [groupedComments, setGroupedComments] = useState<any>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openReplies, setOpenReplies] = useState<any>({
    commentId: null,
    open: false,
  });
  const [replyText, setReplyText] = useState("");
  const [editedComment, setEditedComment] = useState<string>("");

  const handleTestDetailsChange = (data: string) => {
    setCommentText(data);
  };
  const handleEditCommentChange = (data: string) => {
    setEditedComment(data);
  };
  const handleReplyChange = (data: string) => {
    setReplyText(data);
  };

  const { isLoading: isUserLoading, data: usersData } = useQuery({
    queryKey: ["getAllUsers", taskId],
    queryFn: async () => {
      const response = await getAllMembers();
      return response?.data?.data;
    },
  });

  const {
    isLoading,
    isFetching,
    data: commentsData,
    error,
  } = useQuery({
    queryKey: ["getComments", taskId, refreshCount],
    queryFn: async () => {
      const response = await getCommentsForTaskAPI(taskId);
      try {
        if (response?.status === 200 || response?.status === 201) {
          return response?.data?.data;
        } else if (response?.status === 404) {
          return [];
        }
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
      }
    },
    enabled: !!taskId,
  });

  useEffect(() => {
    if (commentsData) {
      const sortedComments = [...commentsData].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });
      const grouped: any = [];
      sortedComments.forEach((comment: any) => {
        const commentDate = new Date(comment.createdAt);
        const formattedDate = format(commentDate, "yyyy-MM-dd");
        if (!grouped[formattedDate]) {
          grouped[formattedDate] = [];
        }
        grouped[formattedDate].push(comment);
      });
      const groupedArray = Object.keys(grouped).map((date) => ({
        date,
        comments: grouped[date],
      }));
      console.log(groupedArray, "groupedArray");
      setGroupedComments(groupedArray);
    }
  }, [commentsData]);

  const mutation = useMutation({
    mutationFn: async (newComment: {
      message: string;
      commented_by: number;
      reply_to: number;
    }) => {
      setLoading(true);
      const response = await addCommentsAPI(taskId, newComment);
      if (response?.status === 200 || response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to add comment");
    },
    onSuccess: (data) => {
      toast.success("Comment added successfully!");
      setCommentText("");
      setRefreshCount(refreshCount + 1);
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || "Error adding comment");
      setLoading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (payload: any) => {
      setLoading(true);
      const response = await deleteCommentsAPI(taskId, payload?.comment_id);
      if (response?.status === 200 || response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to delete comment");
    },
    onSuccess: (data) => {
      toast.success("Comment deleted successfully!");
      setCommentText("");
      setRefreshCount(refreshCount + 1);
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message || "Error removing comment");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { comment_id: number; message: string }) => {
      setLoading(true);
      const response = await updateCommentsAPI(taskId, payload.comment_id, {
        message: payload.message,
      });
      if (response?.status === 200 || response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to update comment");
    },
    onSuccess: (data) => {
      toast.success("Comment updated successfully!");
      setEditingCommentId(null);
      setRefreshCount(refreshCount + 1);
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message || "Error updating comment");
    },
  });

  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    const payload: any = {
      message: commentText,
      commented_by: userID,
    };
    mutation.mutate(payload);
  };

  const handleDeleteComment = (commentId: number) => {
    deleteMutation.mutate({ comment_id: commentId });
  };

  const handleEditComment = (commentId: number, message: string) => {
    setEditingCommentId(commentId);
    setEditedComment(message);
  };

  const handleSaveEdit = () => {
    if (!editedComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    updateMutation.mutate({
      comment_id: editingCommentId!,
      message: editedComment,
    });
  };
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setCommentText("");
    setEditedComment("");
  };
  const handleReplyComment = (comment: any) => {
    setOpenReplies({ commentId: comment.id, open: true, comment: comment });
  };
  const IsUserCommentOrNot = (comment: any) => {
    const isUserComment = comment.commentedBy === userID;
    return isUserComment;
  };
  const formatCommentTime = (comment: any) => {
    const formattedDistance = formatDistanceToNow(
      new Date(comment?.createdAt),
      {
        addSuffix: true,
      }
    );
    return formattedDistance;
  };

  const handleAddReply = () => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    const payload: any = {
      message: replyText,
      commented_by: userID,
      reply_to: openReplies.commentId,
    };
    mutation.mutate(payload);
    setReplyText("");
  };

  const getRepliesCount = (comments: any, mainCommentId: any) => {
    let count = 0;
    comments.forEach((comment: any) => {
      if (comment.reply_to === mainCommentId) {
        count++;
      }
    });
    let value = `${count} ${count == 1 ? " Reply" : " Repliies"}`;
    return [count, value];
  };

  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop =
        commentsContainerRef.current.scrollHeight;
    }
  }, [groupedComments]);
  return (
    <div className="flex flex-row">
      <div
        className={`border ${openReplies?.open ? " w-[60%]" : "w-[100%]"}`}
      >
        <div className="card-header border-b px-4 py-0 flex justify-between items-center bg-gray-50">
          <h3 className="leading-1 text-black text-[1.1em]">Comments</h3>
        </div>
        <div className="card-body pb-[5rem] px-4 flex flex-col h-comments overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
          <div
            className="member-comments space-y-3  flex-1 pr-3"
            ref={commentsContainerRef}
          >
            {groupedComments?.length > 0
              ? groupedComments?.map((group: any, index: number) => {
                const formattedDate = format(new Date(group.date), "PPP");
                let filtersReplyComments = group.comments.filter(
                  (comment: any) => comment.replyTo === null
                );

                return (
                  <div key={index} className="group space-y-3">
                    <div className="my-4 text-center text-gray-500 text-xs">
                      <span className="bg-white px-2">
                        {groupedComments?.length > 0 ? formattedDate : ""}
                      </span>
                    </div>
                    {filtersReplyComments?.length > 0
                      ? filtersReplyComments.map((comment: any) => {
                        const isEdited =
                          comment.updatedAt &&
                          comment.createdAt !== comment.updatedAt;
                        return (
                          <div
                            key={comment.id}
                            className={`each-member`}
                          >
                            <div className="flex space-x-4 justify-end">
                              <div className="member-profile-image">
                                <img
                                  title={
                                    comment?.firstName +
                                    " " +
                                    comment?.lastName
                                  }
                                  src={
                                    comment.profilePictureUrl ||
                                    "/profile-picture.png"
                                  }
                                  onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.src = "/profile-picture.png";
                                  }}
                                  alt="Avatar"
                                  className="w-10 h-10 rounded-full"
                                />
                              </div>
                              <div className="card bg-[#EEEEF8] py-2 rounded-md shadow-sm relative pl-5 pr-5">
                                <div className="member-name pr-10">
                                  <span className="font-semibold">
                                    {IsUserCommentOrNot(comment)
                                      ? "You"
                                      : comment?.firstName +
                                      " " +
                                      comment?.lastName || "Unknown"}
                                  </span>
                                  <span className="text-[#67727E] font-normal text-[.85em] pl-2">
                                    {formatCommentTime(comment)}{" "}
                                    {isEdited && (
                                      <span className="text-xs text-gray-400">
                                        (edited)
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <div className="person-message mt-2 text-slate-500 leading-snug pr-10">
                                  {editingCommentId === comment.id ? (
                                    <div className="flex flex-col">
                                      <CKEditorComponent
                                        editorData={editedComment}
                                        handleEditorChange={
                                          handleEditCommentChange
                                        }
                                      />
                                      <div className="mt-3 flex justify-end space-x-3">
                                        <button
                                          className="text-gray-500"
                                          onClick={handleCancelEdit}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className="text-[#28A745]"
                                          onClick={handleSaveEdit}
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: comment.message,
                                      }}
                                    />
                                  )}

                                  <p
                                    className={`text-[#3368a1] font-normal text-sm cursor-pointer ${getRepliesCount(
                                      group.comments,
                                      comment.id
                                    )[0] === 0
                                      ? "hidden"
                                      : ""
                                      }`}
                                    onClick={() => handleReplyComment(comment)}
                                  >
                                    {
                                      getRepliesCount(
                                        group.comments,
                                        comment.id
                                      )[1]
                                    }{" "}
                                  </p>
                                </div>
                                <div className="more-options absolute top-2 right-3">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger>
                                      <button className="text-black">
                                        <DotsHorizontalIcon className="w-5 h-5" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="bg-white p-2 rounded-md shadow-lg"
                                    >
                                      <DropdownMenuItem
                                        className={`cursor-pointer ${IsUserCommentOrNot(comment) ? "" : "hidden"}`}
                                        onClick={() =>
                                          handleDeleteComment(comment.id)
                                        }
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className={`cursor-pointer ${IsUserCommentOrNot(comment) ? "" : "hidden"}`}
                                        onClick={() =>
                                          handleEditComment(
                                            comment.id,
                                            comment.message
                                          )
                                        }
                                      >
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() =>
                                          handleReplyComment(comment)
                                        }
                                      >
                                        Reply
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                      : "Comments not found"}
                  </div>
                );
              })
              : "No comments found"}
          </div>
        </div>
        <div className="card-footer border-t bg-[#EEEEF8] sticky bottom-0 left-0 right-0  px-4 py-4  z-10 overflow-hidden">
          <div className="grid grid-cols-[40px,auto] space-x-3">
            <div className="profile-image">
              <img
                className="shadow-lg rounded-full w-[40px]"
                src="/profile-avatar.png"
                alt="User"
              />
            </div>
            <div className="ck-editor-send-button grid grid-cols-[auto,50px] space-x-3 items-end">
              <div className="overflow-auto">
                {taskId && (
                  <CKEditorComponent
                    editorData={commentText}
                    handleEditorChange={handleTestDetailsChange}
                  />
                )}
              </div>
              <button
                onClick={handleAddComment}
              >
                <img
                  src="/add-comment-arrow.svg"
                  alt="icon"
                  className="w-8"
                />
              </button>
            </div>
          </div>
        </div>
        <LoadingComponent loading={loading} />
      </div>
      {openReplies?.open && (
        <div
          className={`${openReplies?.open ? "w-[45%] ml-2" : ""}`}
        >
          <RepliedComments
            mainComment={openReplies?.comment}
            handleReplyChange={handleReplyChange}
            handleAddReply={handleAddReply}
            replyText={replyText}
            IsUserCommentOrNot={IsUserCommentOrNot}
            formatCommentTime={formatCommentTime}
            setOpenReplies={setOpenReplies}
            groupedComments={groupedComments}
            handleDeleteComment={handleDeleteComment}
          />
        </div>
      )}
    </div>
  );
};
export default TaskComments;

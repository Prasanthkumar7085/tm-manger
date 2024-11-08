import CKEditorComponent from "@/components/core/CKEditor/CKEditorComponent";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
const RepliedComments = ({
  mainComment,
  handleReplyChange,
  handleAddReply,
  replyText,
  IsUserCommentOrNot,
  formatCommentTime,
  setOpenReplies,
  groupedComments,
  handleDeleteComment,
}: any) => {
  const replyComments = () => {
    const filteredComments = groupedComments.map((group: any) => {
      return group.comments.filter(
        (comment: any) => comment.replyTo === mainComment.id
      );
    });
    return filteredComments.flat();
  };
  return (
    <div className="bg-white border">
      <div className="card-header border-b px-4 py-0 flex justify-between items-center bg-gray-50">
        <h3 className="leading-1 text-black text-[1.1em]">Replies</h3>
        <Button
          variant="outline"
          onClick={() => {
            setOpenReplies({ commentId: null, open: false });
          }}
          className=" p-0 text-center font-semibold text-lg text-slate-500 border-none"
        >
          <X />
        </Button>
      </div>

      <div className="card-body p-3 h-comments overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
        <div className="flex flex-col bg-[#FEF7FD] py-4 px-5 rounded-md ml-auto text-left">
          <div>
            <div className="flex justify-between items-center">
              <div className="member-details flex items-center space-x-3">
                <div className="member-profile-image">
                  <img
                    title={mainComment?.firstName + " " + mainComment?.lastName}
                    className="w-8 h-8 rounded-full"
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = "/profile-picture.png";
                    }}
                    src={mainComment.profilePictureUrl || "/profile-picture.png"}
                    alt="Avatar"
                  />
                </div>
                <div className="member-name">
                  <span className="font-semibold">
                    {IsUserCommentOrNot(mainComment)
                      ? "You"
                      : mainComment.user?.name || "Unknown"}
                  </span>
                  <span className="text-[#67727E] font-normal text-sm pl-2">
                    {formatCommentTime(mainComment)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="person-message mt-2 text-slate-500 leading-snug">
            <div className="flex flex-col">
              <p
                dangerouslySetInnerHTML={{
                  __html: mainComment.message,
                }}
              />
            </div>
          </div>
        </div>
        <div className="min-h-[500px] overflow-y-auto">
          <div className="font-medium text-md text-gray-800 my-2">Replies:</div>
          <div className="space-y-4">
            {replyComments()?.length > 0 ? (
              replyComments()?.map((reply: any) => {
                return (
                  <div
                    className="flex flex-col bg-[#FEF7FD] py-4 px-4 rounded-md ml-4 text-left  "
                    key={reply.id}
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="member-details flex items-center space-x-3">
                          <div className="member-profile-image">
                            <img
                              className="w-8 h-8 rounded-full"
                              src={
                                reply.user?.avatar ||
                                "https://i.pravatar.cc/150?img=5"
                              }
                              alt="Avatar"
                            />
                          </div>
                          <div className="member-name">
                            <span className="font-semibold">
                              {IsUserCommentOrNot(reply)
                                ? "You"
                                : reply?.firstName + " " + reply?.lastName ||
                                "Unknown"}
                            </span>
                            <span className="text-[#67727E] font-normal text-sm pl-2">
                              {formatCommentTime(reply)}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <button className="text-gray-500 hover:text-gray-800">
                              <DotsHorizontalIcon className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white p-2 rounded-md shadow-lg"
                          >
                            <DropdownMenuItem
                              className={`cursor-pointer ${IsUserCommentOrNot(reply) ? "" : "hidden"}`}
                              onClick={() => handleDeleteComment(reply.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="person-message mt-2 text-slate-500 leading-snug">
                      <div className="flex flex-col">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: reply.message,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-500">No replies yet.</div>
            )}
          </div>
        </div>
      </div>


      <div className="card-footer border-t bg-white sticky bottom-0 left-0 right-0  px-4 py-4  z-10 overflow-hidden">
        <div className="text-area-group rounded-lg items-start space-x-3 grid grid-cols-[90%,auto]">
          <div>
            <CKEditorComponent
              editorData={replyText}
              handleEditorChange={handleReplyChange}
            />
          </div>
          <div>
            <button className="rounded-md" onClick={handleAddReply}>
              <img
                src="/add-comment-arrow.svg"
                alt="icon"
                className="w-[30px] h-[30px]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepliedComments;

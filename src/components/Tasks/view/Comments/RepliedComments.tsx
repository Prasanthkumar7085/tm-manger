import CKEditorComponent from "@/components/core/CKEditor/CKEditorComponent";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { X } from "lucide-react";
import "./comments.css";

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
  profileData,
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
      <div className="card-body flex flex-col h-[272px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
        <div className="flex space-x-4  my-3 px-4">
          <div className="member-profile-image">
            <img
              title={mainComment?.firstName + " " + mainComment?.lastName}
              className="w-10 h-10 rounded-full"
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = "/profile-picture.png";
              }}
              src={mainComment.profilePictureUrl || "/profile-picture.png"}
              alt="Avatar"
            />
          </div>
          <div className="card bg-[#EEEEF8] py-2 rounded-md shadow-sm relative pl-5 pr-5">
            <div className="member-name">
              <span className="font-semibold">
                {IsUserCommentOrNot(mainComment)
                  ? "You"
                  : mainComment?.firstName + " " + mainComment?.lastName ||
                    "Unknown"}
              </span>
              <span className="text-[#67727E] font-normal text-sm pl-2">
                {formatCommentTime(mainComment)}
              </span>
            </div>
            <div className="person-message mt-2 text-slate-500 leading-snug">
              <div className="flex flex-col">
                <p
                  className="ckeditor-content"
                  dangerouslySetInnerHTML={{
                    __html: mainComment.message,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" pl-4 pr-3 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
          <div className="font-medium text-md text-gray-800 my-2">Replies</div>
          <div className="space-y-4">
            {replyComments()?.length > 0 ? (
              replyComments()?.map((reply: any) => {
                return (
                  <div key={reply.id}>
                    <div className="flex space-x-4 justify-end">
                      <div className="member-profile-image">
                        <img
                          title={reply?.firstName + " " + reply?.lastName}
                          className="w-10 h-10 rounded-full"
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = "/profile-picture.png";
                          }}
                          src={
                            reply.profilePictureUrl || "/profile-picture.png"
                          }
                          alt="Avatar"
                        />
                      </div>
                      <div className="card bg-red-100 py-2 rounded-md shadow-sm relative pl-5 pr-5">
                        <div className="member-name pr-10">
                          <span className="font-semibold">
                            {IsUserCommentOrNot(reply)
                              ? "You"
                              : reply?.firstName + " " + reply?.lastName ||
                                "Unknown"}
                          </span>
                          <span className="text-[#67727E] font-normal text-[.85em] pl-2">
                            {formatCommentTime(reply)}
                          </span>
                        </div>
                        <div className="person-message mt-2 text-slate-500 leading-snug pr-10">
                          <div className="flex flex-col">
                            <p
                              className="ckeditor-content"
                              dangerouslySetInnerHTML={{
                                __html: reply.message,
                              }}
                            />
                          </div>
                        </div>
                        <div className="more-options absolute top-2 right-3">
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

      <div className="card-footer border-t bg-[#EEEEF8] sticky bottom-0 left-0 right-0  px-4 py-4  z-10 overflow-hidden">
        <div className="ck-editor-send-button grid grid-cols-[auto,50px] space-x-3 items-end">
          <div className="overflow-auto">
            <CKEditorComponent
              editorData={replyText}
              handleEditorChange={handleReplyChange}
            />
          </div>
          <button className="rounded-md" onClick={handleAddReply}>
            <img src="/add-comment-arrow.svg" alt="icon" className="w-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepliedComments;

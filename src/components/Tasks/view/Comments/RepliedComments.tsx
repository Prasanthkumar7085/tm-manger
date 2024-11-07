import CKEditorComponent from "@/components/core/CKEditor/CKEditorComponent";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const RepliedComments = ({
  mainComment,
  handleReplyChange,
  handleAddReply,
  replyText,
  IsUserCommentOrNot,
  formatCommentTime,
  setOpenReplies,
}: any) => {
  return (
    <div className="px-2 bg-white rounded-lg shadow-md w-full max-h-[500px] overflow-y-auto">
      <div className="flex items-center justify-between sticky top-0 bg-white z-10 py-2">
        <p>Replies</p>
        <Button
          variant="outline"
          onClick={() => {
            setOpenReplies({ commentId: null, open: false });
          }}
          className="text-center font-semibold text-lg text-slate-500 border-none"
        >
          <X />
        </Button>
      </div>

      <div className="flex flex-col bg-[#FEF7FD] py-4 px-4 rounded-md ml-auto text-left ">
        <div>
          <div className="flex justify-between items-center">
            <div className="member-details flex items-center space-x-3">
              <div className="member-profile-image">
                <img
                  className="w-8 h-8 rounded-full"
                  src={
                    mainComment.user?.avatar ||
                    "https://i.pravatar.cc/150?img=5"
                  }
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

      {/* Scrollable Replies Section */}
      <div className="mb-6 max-h-[300px] overflow-y-auto">
        <div className="font-semibold text-lg text-gray-800 mb-2">Replies:</div>

        <div className="space-y-4">
          {mainComment?.replies?.length > 0 ? (
            mainComment.replies.map((reply: any) => (
              <div key={reply.id} className="flex items-start space-x-3">
                <img
                  className="w-8 h-8 rounded-full"
                  src={reply.user?.avatar || "https://i.pravatar.cc/150?img=5"}
                  alt="User Avatar"
                />
                <div className="flex flex-col space-y-1">
                  <div className="text-sm font-semibold text-gray-800">
                    {reply.user?.name || "Anonymous"}
                  </div>
                  <div className="text-sm text-gray-600">{reply.message}</div>
                  <div className="text-xs text-gray-500">
                    {reply.created_at}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No replies yet.</div>
          )}
        </div>
      </div>

      {/* Reply Editor */}
      <div className="sticky bottom-2 left-0 right-0 bg-white px-4 py-6 z-10 overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lg text-gray-800 mb-2">
            Add Your Reply:
          </div>
          <button className="rounded-md  pr-2" onClick={handleAddReply}>
            <img
              src="/add-comment-arrow.svg"
              alt="icon"
              className="w-[30px] h-[30px]"
            />
          </button>
        </div>
        <CKEditorComponent
          editorData={replyText}
          handleEditorChange={handleReplyChange}
        />
      </div>
    </div>
  );
};

export default RepliedComments;

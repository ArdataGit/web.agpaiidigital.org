import { getImage } from "@/utils/function/function";
import moment from "moment";
import "moment/locale/id";

export default function Comment({ comment }: { comment: any }) {
  return (
    <div className="flex flex-col py-2 pl-3 ml-2 border-l-2 border-slate-200 bg-slate-50 rounded-r-lg mb-2">
      <div className="flex gap-2 items-center">
        <img
          src={getImage(comment.author.avatar)}
          className="size-7 rounded-full"
          alt=""
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-medium text-xs">
              {comment.author.name || "unknown"}
            </h1>
            <span className="text-[10px] text-neutral-500">•</span>
            <h2 className="text-neutral-500 text-[10px]">
              {moment(comment.created_at).locale("id").fromNow()}
            </h2>
          </div>
          <h2 className="text-neutral-500 text-[10px]">
            {comment.author.profile.school_place}
          </h2>
        </div>
      </div>
      <div className="pl-9 text-sm py-1">
        <p className="text-slate-700">{comment.value}</p>
        <div className="pt-2 text-xs text-[#009788] font-medium cursor-pointer hover:underline">Balas</div>
      </div>
    </div>
  );
}

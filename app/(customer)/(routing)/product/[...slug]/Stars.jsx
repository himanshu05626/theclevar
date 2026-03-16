import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
export default function Stars({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) =>
        i <= rating ? (
          <StarSolid key={i} className="w-5 h-5 text-yellow-400" />
        ) : (
          <StarOutline key={i} className="w-5 h-5 text-gray-500" />
        )
      )}
    </div>
  );
}
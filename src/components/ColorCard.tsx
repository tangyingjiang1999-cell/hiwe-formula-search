"use client";

import { memo } from "react";
import type { SearchResult } from "@/types";
import { COLOR_TYPE_MAP } from "@/lib/constants";
import { useLang } from "@/components/LanguageContext";

interface ColorCardProps {
  result: SearchResult;
  onOpenDetail: (result: SearchResult) => void;
}

const ColorCard = memo(function ColorCard({
  result,
  onOpenDetail,
}: ColorCardProps) {
  const { color, formulas } = result;
  const { t } = useLang();

  const typeInfo = COLOR_TYPE_MAP[color.color_type] ?? {
    label: color.color_type,
    badge: "bg-zinc-100 text-zinc-600",
  };
  const typeLabelMap: Record<string, string> = {
    solid: t.colorTypeSolidLabel, metallic: t.colorTypeMetallicLabel,
    pearl: t.colorTypePearlLabel, matte: t.colorTypeMatteLabel,
    candy: t.colorTypeCandyLabel, special: t.colorTypeSpecialLabel,
  };
  const typeLabel = typeLabelMap[color.color_type] ?? color.color_type;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpenDetail(result);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetail(result)}
      onKeyDown={handleKeyDown}
      className="mb-3 cursor-pointer rounded-none border border-[#E5E7EB] bg-white transition-shadow duration-200 ease-out hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] last:mb-0"
    >
      <div className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4">
        <div className="flex min-w-0 flex-1 items-center gap-4 text-left">
          <div
            className="h-10 w-10 shrink-0 rounded-none border border-[#E5E7EB]"
            style={{ backgroundColor: color.hex_preview }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#111827]">
              {color.color_name}
            </p>
            <p className="text-[11px] text-gray-500">{color.color_code}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={[
              "shrink-0 rounded-none px-2 py-0.5 text-[10px] font-medium",
              typeInfo.badge,
            ].join(" ")}
          >
            {typeLabel}
          </span>

          <span className="shrink-0 text-xs text-[#6B7280]">
            {t.formulasCount(formulas.length)}
          </span>

          <svg
            className="h-4 w-4 text-[#9CA3AF]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
});

export default ColorCard;

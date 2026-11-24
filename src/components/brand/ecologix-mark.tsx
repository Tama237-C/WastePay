import type { SVGProps } from "react";

export function EcologixMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 128 128" fill="none" aria-hidden="true" {...props}>
      <path
        d="M101 21C70 22 36 31 27 57c-6 17 3 35 20 41 20 7 39-8 47-30 5-13 7-29 7-47Z"
        fill="#10B981"
      />
      <path
        d="M32 99c17-22 34-39 59-58M66 73l-3-19M49 88l-1-15"
        stroke="#064E3B"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 62a47 47 0 0 1 72-37"
        stroke="#047857"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M110 66a47 47 0 0 1-72 38"
        stroke="#35B9ED"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="m87 16 8 11-13 2" fill="#047857" />
      <path d="m41 111-8-11 13-2" fill="#35B9ED" />
    </svg>
  );
}

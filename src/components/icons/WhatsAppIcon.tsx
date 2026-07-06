import { SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export default function WhatsAppIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...rest
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M3 21l1.65-4.95A8.5 8.5 0 1 1 8.9 19.4z" />
      <path d="M8.5 9.5c0 3.5 2.5 6 6 6 .5 0 1-.4 1-1v-1.1c0-.3-.2-.6-.5-.7l-1.8-.7c-.3-.1-.6 0-.8.3l-.4.5a5 5 0 0 1-2.3-2.3l.5-.4c.3-.2.4-.5.3-.8L9.8 6.8a.8.8 0 0 0-.8-.5H8c-.6 0-1 .5-1 1 0 .8.1 1.5.5 2.2" />
    </svg>
  );
}

import { IconProps } from "./WhatsAppIcon";

export default function TikTokIcon({
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
      <path d="M15 3v10.5a3.5 3.5 0 1 1-3.5-3.5c.17 0 .34.01.5.04" />
      <path d="M15 3a5.5 5.5 0 0 0 5 5.5" />
    </svg>
  );
}

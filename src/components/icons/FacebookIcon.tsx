import { IconProps } from "./WhatsAppIcon";

export default function FacebookIcon({
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
      <path d="M15 21v-8h2.5l.5-4H15V6.5A1.5 1.5 0 0 1 16.5 5H18V1.5A20 20 0 0 0 15.5 1 4 4 0 0 0 11 5v4H8.5v4H11v8" />
    </svg>
  );
}

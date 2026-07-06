import { IconProps } from "./WhatsAppIcon";

export default function TwitterIcon({
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
      <path d="M4 4l7.5 9.5L4.5 20h2.3l6-6.5L17.5 20H20l-8-10.2L18.7 4h-2.3l-5.4 5.9L6.3 4z" />
    </svg>
  );
}

import { ComponentType } from "react";
import { Globe } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import TwitterIcon from "@/components/icons/TwitterIcon";
import { SocialField } from "@/lib/validation/companySchema";

type PlatformIcon = ComponentType<{ size?: number | string; color?: string; className?: string }>;

const PLATFORM_META: Record<SocialField, { label: string; subtitle: string; Icon: PlatformIcon }> = {
  whatsapp: { label: "WhatsApp", subtitle: "Chat with us", Icon: WhatsAppIcon },
  facebook: { label: "Facebook", subtitle: "Become a fan", Icon: FacebookIcon },
  instagram: { label: "Instagram", subtitle: "Follow us", Icon: InstagramIcon },
  tiktok: { label: "TikTok", subtitle: "Watch our videos", Icon: TikTokIcon },
  twitter: { label: "Twitter / X", subtitle: "Follow us", Icon: TwitterIcon },
  website: { label: "Website", subtitle: "Visit our site", Icon: Globe },
};

export default function SocialLinkCard({
  platform,
  url,
  themeColor,
}: {
  platform: SocialField;
  url: string;
  themeColor: string;
}) {
  const { label, subtitle, Icon } = PLATFORM_META[platform];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 rounded-[var(--radius-card)] border p-4 transition-colors hover:bg-black/[0.02]"
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ background: `${themeColor}1a`, color: themeColor }}
      >
        <Icon size={22} />
      </span>
      <span className="flex flex-col">
        <span className="font-semibold">{label}</span>
        <span className="text-sm" style={{ color: "var(--color-muted)" }}>
          {subtitle}
        </span>
      </span>
    </a>
  );
}

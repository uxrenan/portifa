import { shareImage, SHARE_SIZE } from "@/components/Seo/ShareImage";
import { getDictionary } from "@/i18n/dictionaries";

export const alt = getDictionary("pt-BR").cases.waldemar.metaTitle;
export const size = SHARE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return shareImage("pt-BR", "waldemar");
}

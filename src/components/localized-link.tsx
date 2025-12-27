import { Link } from "@/i18n/navigation";
import { ComponentProps } from "react";

type LocalizedLinkProps = ComponentProps<typeof Link>;

export function LocalizedLink(props: LocalizedLinkProps) {
  return <Link {...props} />;
}

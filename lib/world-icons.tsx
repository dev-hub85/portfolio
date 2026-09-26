import { Building2, Gamepad2, Images, ScanEye, ShieldCheck, ShoppingBag, type LucideIcon } from "lucide-react";
import type { WorldIcon } from "@/lib/worlds";

export const worldIcons: Record<WorldIcon, LucideIcon> = {
  shield: ShieldCheck,
  cart: ShoppingBag,
  gamepad: Gamepad2,
  scan: ScanEye,
  image: Images,
  building: Building2,
};

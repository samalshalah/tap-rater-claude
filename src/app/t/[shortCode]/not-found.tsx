import { SearchX } from "lucide-react";
import { StandMessage } from "@/components/stands/hosted-tap-page";

export default function PublicStandNotFound() {
  return (
    <StandMessage
      icon={<SearchX className="h-6 w-6" aria-hidden="true" />}
      eyebrow="Tap Rater"
      title="Stand not found"
      body="Check the address on the stand or contact Tap Rater support."
    />
  );
}

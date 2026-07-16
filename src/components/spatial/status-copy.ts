import type { GestureStatus } from "@/lib/spatial/types";

export function statusTitleKey(status: GestureStatus) {
  switch (status) {
    case "no-hand":
      return "spatial.status.noHand";
    case "hand-detected":
      return "spatial.status.handDetected";
    case "pinched":
      return "spatial.status.pinched";
    case "moving":
      return "spatial.status.moving";
  }
}

export function statusSubtitleKey(status: GestureStatus) {
  switch (status) {
    case "no-hand":
      return "spatial.statusDetail.noHand";
    case "hand-detected":
      return "spatial.statusDetail.handDetected";
    case "pinched":
      return "spatial.statusDetail.pinched";
    case "moving":
      return "spatial.statusDetail.moving";
  }
}

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const cameraSchema = z.object({
  cameraState: z.enum(["idle", "loading", "ready", "denied", "unsupported", "error"]),
  handVisible: z.boolean(),
  confidence: z.number().min(0).max(100),
});

export function registerDiagnoseCameraTool(server: McpServer, _userId: string) {
  server.registerTool(
    "diagnose_camera_tracking",
    {
      title: "Diagnose camera tracking",
      description: "Explain why the camera or hand tracking may not be working and suggest a fix.",
      inputSchema: cameraSchema.shape,
    },
    async ({ cameraState, handVisible, confidence }) => {
      let diagnosis = "Tracking looks usable. Keep the palm visible and use slower gestures for clean strokes.";
      if (cameraState === "denied") diagnosis = "Camera permission is blocked. Allow camera access in the browser, then restart the camera.";
      else if (cameraState === "unsupported") diagnosis = "This browser does not support camera access. Try a modern mobile or desktop browser.";
      else if (cameraState === "error") diagnosis = "The camera could not start. Close other apps using the webcam and try again.";
      else if (!handVisible) diagnosis = "No hand is visible. Move one hand into the center of the frame with good lighting.";
      else if (confidence < 55) diagnosis = "Tracking confidence is low. Move closer to the camera and increase ambient light.";

      return { content: [{ type: "text", text: JSON.stringify({ cameraState, handVisible, confidence, diagnosis }, null, 2) }] };
    },
  );
}

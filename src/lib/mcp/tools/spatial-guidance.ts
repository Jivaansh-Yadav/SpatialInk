import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const gestureSchema = z.object({
  currentStatus: z.enum(["No hand", "Hand detected", "Pinched fingers - Draw", "Moving"]),
  goal: z.enum(["draw", "move-shape", "calibrate", "clear-canvas"]),
});

export function registerSpatialGuidanceTool(server: McpServer, _userId: string) {
  server.registerTool(
    "explain_next_gesture",
    {
      title: "Explain next gesture",
      description: "Give concise next-step guidance for drawing, moving, or calibrating with hand gestures.",
      inputSchema: gestureSchema.shape,
    },
    async ({ currentStatus, goal }) => {
      const guidance = (() => {
        if (goal === "draw") return "Hold your thumb and index finger together, then move the pinch point slowly through the frame. Release the pinch to drop the stroke.";
        if (goal === "move-shape") return "Move your fist close to an existing stroke until it grabs, drag the hand to reposition the shape, then open your hand to release it.";
        if (goal === "calibrate") return "Place one hand inside the center target, keep the palm visible, and adjust distance until the confidence reads near ideal.";
        return "Use Undo for the last stroke or Clear to reset all dropped shapes on the canvas.";
      })();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ currentStatus, goal, guidance }, null, 2),
          },
        ],
      };
    },
  );
}

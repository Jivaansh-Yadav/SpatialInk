import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const settingsSchema = z.object({
  jitterLevel: z.enum(["low", "medium", "high"]),
  pinchMisses: z.enum(["rare", "sometimes", "often"]),
  grabDifficulty: z.enum(["easy", "balanced", "hard"]),
});

export function registerRecommendSettingsTool(server: McpServer, _userId: string) {
  server.registerTool(
    "recommend_gesture_settings",
    {
      title: "Recommend gesture settings",
      description: "Suggest smoothing, pinch sensitivity, and grab radius values for the spatial gesture canvas.",
      inputSchema: settingsSchema.shape,
    },
    async ({ jitterLevel, pinchMisses, grabDifficulty }) => {
      const smoothing = jitterLevel === "high" ? 0.78 : jitterLevel === "medium" ? 0.56 : 0.36;
      const pinchThreshold = pinchMisses === "often" ? 0.095 : pinchMisses === "sometimes" ? 0.082 : 0.068;
      const grabRadius = grabDifficulty === "hard" ? 96 : grabDifficulty === "balanced" ? 72 : 56;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ smoothing, pinchThreshold, grabRadius, note: "Apply these values in Studio Settings." }, null, 2),
          },
        ],
      };
    },
  );
}

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const sessionSchema = z.object({
  shapesCreated: z.number().int().min(0),
  shapesMoved: z.number().int().min(0),
  colorsUsed: z.array(z.string()).max(8),
});

export function registerSummarizeSessionTool(server: McpServer, _userId: string) {
  server.registerTool(
    "summarize_canvas_session",
    {
      title: "Summarize canvas session",
      description: "Create a short readable summary of a spatial drawing session.",
      inputSchema: sessionSchema.shape,
    },
    async ({ shapesCreated, shapesMoved, colorsUsed }) => {
      const summary = `Created ${shapesCreated} shape${shapesCreated === 1 ? "" : "s"}, moved ${shapesMoved}, and used ${colorsUsed.length || 0} ink color${colorsUsed.length === 1 ? "" : "s"}.`;
      return { content: [{ type: "text", text: JSON.stringify({ summary, colorsUsed }, null, 2) }] };
    },
  );
}

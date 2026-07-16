import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerDiagnoseCameraTool } from "./tools/diagnose-camera";
import { registerRecommendSettingsTool } from "./tools/recommend-settings";
import { registerSpatialGuidanceTool } from "./tools/spatial-guidance";
import { registerSummarizeSessionTool } from "./tools/summarize-session";

export function buildMcpServer(userId: string): McpServer {
  const server = new McpServer({
    name: "spatial-gesture-canvas",
    version: "1.0.0",
  });

  registerSpatialGuidanceTool(server, userId);
  registerRecommendSettingsTool(server, userId);
  registerDiagnoseCameraTool(server, userId);
  registerSummarizeSessionTool(server, userId);

  return server;
}

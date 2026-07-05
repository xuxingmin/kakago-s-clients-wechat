import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_merchants",
  title: "List certified TRIVA nodes",
  description: "Returns nearby TRIVA certified coffee node merchants (public info: name, rating, online status).",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(10).describe("Max number of merchants to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data, error } = await supabase
      .from("merchants")
      .select("id, merchant_name, merchant_name_en, is_online, rating")
      .limit(limit);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { merchants: data ?? [] },
    };
  },
});

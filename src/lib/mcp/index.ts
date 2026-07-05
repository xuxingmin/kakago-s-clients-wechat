import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listMerchantsTool from "./tools/list-merchants";
import listMyOrdersTool from "./tools/list-my-orders";
import getMyProfileTool from "./tools/get-my-profile";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "triva-mcp",
  title: "TRIVA",
  version: "0.1.0",
  instructions:
    "TRIVA coffee tools. Use `list_merchants` to browse nearby certified nodes; `list_my_orders` and `get_my_profile` require the signed-in user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listMerchantsTool, listMyOrdersTool, getMyProfileTool],
});

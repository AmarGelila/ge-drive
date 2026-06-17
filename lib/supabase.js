import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const supabase_url = process.env.SUPABASE_PROJECT_URL;
const supabase_secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabase_url, supabase_secret, {
	auth: { persistSession: false },
	realtime: { transport: ws },
});

export default supabase;

-- Chat Conversations table
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_phone TEXT,
  travel_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'waiting_agent')),
  is_agent_connected BOOLEAN DEFAULT false,
  agent_id UUID,
  current_page TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);

-- Chat Messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('visitor', 'bot', 'agent')),
  sender_name TEXT,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chat Leads table
CREATE TABLE public.chat_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  travel_date DATE,
  message TEXT,
  source TEXT DEFAULT 'chatbot',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin Presence table
CREATE TABLE public.admin_presence (
  user_id UUID PRIMARY KEY,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_presence ENABLE ROW LEVEL SECURITY;

-- Chat Conversations policies
CREATE POLICY "Visitors can create conversations"
ON public.chat_conversations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Visitors can view own conversations"
ON public.chat_conversations
FOR SELECT
USING (true);

CREATE POLICY "Visitors can update own conversations"
ON public.chat_conversations
FOR UPDATE
USING (true);

CREATE POLICY "Admins can manage all conversations"
ON public.chat_conversations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Chat Messages policies
CREATE POLICY "Anyone can insert messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view messages"
ON public.chat_messages
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage all messages"
ON public.chat_messages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Chat Leads policies
CREATE POLICY "Anyone can create leads"
ON public.chat_leads
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all leads"
ON public.chat_leads
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage leads"
ON public.chat_leads
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin Presence policies
CREATE POLICY "Anyone can view admin presence"
ON public.admin_presence
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage own presence"
ON public.admin_presence
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update trigger for chat_conversations
CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_presence;

-- Create indexes for performance
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX idx_chat_conversations_visitor_id ON public.chat_conversations(visitor_id);
CREATE INDEX idx_chat_conversations_status ON public.chat_conversations(status);
CREATE INDEX idx_chat_leads_email ON public.chat_leads(email);
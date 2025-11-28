-- Create chats table
CREATE TABLE public.chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_name TEXT,
  user_age INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Anyone can view chats"
  ON public.chats
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create chats"
  ON public.chats
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update chats"
  ON public.chats
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete chats"
  ON public.chats
  FOR DELETE
  USING (true);

CREATE POLICY "Anyone can view messages"
  ON public.messages
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update messages"
  ON public.messages
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete messages"
  ON public.messages
  FOR DELETE
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON public.chats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_chats_created_at ON public.chats(created_at);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
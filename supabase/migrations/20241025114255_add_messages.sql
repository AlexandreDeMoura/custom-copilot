create table messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade,
  content text not null,
  role text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
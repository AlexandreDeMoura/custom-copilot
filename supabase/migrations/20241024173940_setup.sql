create table conversations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  model text not null,
  prompt text not null,
  context_length integer not null default 4096,
  temperature numeric(3,2) not null default 0.7,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone
);
-- Create the profile table
CREATE TABLE profile (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    openai_key text NOT NULL,
    anthropic_key text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Insert a default profile with empty API keys
INSERT INTO profile (openai_key, anthropic_key)
VALUES ('', '');
-- Add createdAt column to users table
ALTER TABLE users ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing users to have a default creation date if they don't have one
UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL; 
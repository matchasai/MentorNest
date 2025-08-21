-- Add resource_url column to modules table and insert sample data
USE mentornest_db;

-- Add resource_url column if it doesn't exist
ALTER TABLE modules ADD COLUMN resource_url VARCHAR(500);

-- Update existing modules with sample resource URLs (store just the path)
UPDATE modules SET resource_url = '/uploads/modules/1eccd9f2-31c3-4c25-bc9a-4cb09d2a324e_HTML - Notes.pdf' WHERE id = 1;
UPDATE modules SET resource_url = '/uploads/modules/d1cd3693-4dfe-4328-90a0-4a294aa2c60c_HTML TAGS.pdf' WHERE id = 2;

-- Add some additional sample resource URLs for other modules
UPDATE modules SET resource_url = '/uploads/modules/1eccd9f2-31c3-4c25-bc9a-4cb09d2a324e_HTML - Notes.pdf' WHERE id = 3;
UPDATE modules SET resource_url = '/uploads/modules/d1cd3693-4dfe-4328-90a0-4a294aa2c60c_HTML TAGS.pdf' WHERE id = 4;

-- Verify the updates
SELECT id, title, resource_url FROM modules WHERE resource_url IS NOT NULL;

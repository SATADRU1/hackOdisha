-- Initialize HackOdisha database
-- Note: Database hackodisha is already created by Docker environment

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS gofr;
CREATE SCHEMA IF NOT EXISTS studio;
CREATE SCHEMA IF NOT EXISTS blockdag;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA gofr GRANT ALL ON TABLES TO hackodisha;
ALTER DEFAULT PRIVILEGES IN SCHEMA studio GRANT ALL ON TABLES TO hackodisha;
ALTER DEFAULT PRIVILEGES IN SCHEMA blockdag GRANT ALL ON TABLES TO hackodisha;

-- Create indexes for better performance
-- These will be created by Prisma migrations, but we can add some additional ones here

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE hackodisha TO hackodisha;
GRANT ALL PRIVILEGES ON SCHEMA gofr TO hackodisha;
GRANT ALL PRIVILEGES ON SCHEMA studio TO hackodisha;
GRANT ALL PRIVILEGES ON SCHEMA blockdag TO hackodisha;

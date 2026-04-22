/*
  # Fix RLS policies on spotify_tracks

  1. Security Changes
    - Drop the overly permissive INSERT and DELETE policies
    - Replace with restrictive policies that check ownership via created_by
    - Add created_by column to track ownership
  2. Important Notes
    - Existing rows will have NULL created_by; a service role or admin can backfill if needed
    - SELECT remains public since this is a music discovery feature
*/

-- Add created_by column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spotify_tracks' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE spotify_tracks ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert spotify_tracks" ON spotify_tracks;
DROP POLICY IF EXISTS "Authenticated users can delete spotify_tracks" ON spotify_tracks;

-- Create restrictive insert policy
CREATE POLICY "Users can insert their own spotify_tracks"
  ON spotify_tracks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Create restrictive delete policy
CREATE POLICY "Users can delete their own spotify_tracks"
  ON spotify_tracks FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Also add an update policy for completeness
CREATE POLICY "Users can update their own spotify_tracks"
  ON spotify_tracks FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

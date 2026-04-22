/*
  # Fix Spotify Tracks RLS Policies

  1. Security Changes
    - Drop overly permissive INSERT and DELETE policies
    - Replace with restrictive policies tied to authenticated user ownership
    - Keep public SELECT access for browsing
  2. Important Notes
    - All existing rows remain accessible
    - New inserts/deletes now restricted to the user who added them
*/

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert spotify_tracks" ON spotify_tracks;
DROP POLICY IF EXISTS "Authenticated users can delete spotify_tracks" ON spotify_tracks;

-- Add a user_id column to track ownership
ALTER TABLE spotify_tracks ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Update existing rows to have a default user_id (system user or first admin)
-- Since we can't know the original user, we'll leave them as NULL for now
-- and allow public read access.

-- Create restrictive INSERT policy
CREATE POLICY "Users can insert own spotify_tracks"
  ON spotify_tracks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create restrictive DELETE policy
CREATE POLICY "Users can delete own spotify_tracks"
  ON spotify_tracks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create restrictive UPDATE policy
CREATE POLICY "Users can update own spotify_tracks"
  ON spotify_tracks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

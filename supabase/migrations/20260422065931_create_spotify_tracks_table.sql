/*
  # Create spotify_tracks table

  1. New Tables
    - `spotify_tracks`
      - `id` (uuid, primary key)
      - `playlist_url` (text) — the Spotify playlist URL
      - `track_name` (text) — song title
      - `artist_name` (text) — artist name
      - `album_name` (text) — album name
      - `spotify_url` (text) — link to open in Spotify
      - `duration_ms` (bigint) — track duration in ms
      - `image_url` (text) — album artwork URL
      - `position` (int) — order in playlist
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `spotify_tracks`
    - Allow public read access
    - Allow authenticated insert/update/delete
*/

CREATE TABLE IF NOT EXISTS spotify_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_url text NOT NULL,
  track_name text NOT NULL,
  artist_name text NOT NULL,
  album_name text,
  spotify_url text,
  duration_ms bigint,
  image_url text,
  position int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE spotify_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read spotify_tracks"
  ON spotify_tracks FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert spotify_tracks"
  ON spotify_tracks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete spotify_tracks"
  ON spotify_tracks FOR DELETE
  TO authenticated
  USING (true);

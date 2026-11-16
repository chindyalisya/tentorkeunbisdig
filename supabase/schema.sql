-- ========================================================
-- TENTORKEUN DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Siswa, Orang Tua, Tentor)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  role text default 'student' check (role in ('student', 'parent', 'tutor', 'admin')),
  avatar_url text,
  phone text,
  city text default 'Jakarta Selatan',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tutors Table
create table if not exists public.tutors (
  id text primary key,
  name text not null,
  title text not null,
  university text not null,
  badge text,
  bio text not null,
  avatar_url text not null,
  rating numeric(3,2) default 5.0,
  reviews_count integer default 0,
  hourly_rate integer not null,
  subjects text[] default '{}',
  levels text[] default '{}',
  modes text[] default '{online, tatap_muka}',
  location text default 'Jakarta Selatan & Online',
  teaching_style text not null,
  match_score integer default 95,
  highlight text,
  verified boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tutor Availability Slots
create table if not exists public.tutor_slots (
  id uuid default uuid_generate_v4() primary key,
  tutor_id text references public.tutors(id) on delete cascade,
  date date not null,
  day_name text not null,
  time_start text not null,
  time_end text not null,
  mode text check (mode in ('tatap_muka', 'online')),
  is_booked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Bookings & Escrow Orders (Rekber TentorKeun)
create table if not exists public.bookings (
  id text primary key,
  booking_code text unique not null,
  tutor_id text references public.tutors(id),
  tutor_name text not null,
  tutor_avatar text,
  tutor_title text,
  subject text not null,
  topic text not null,
  package_type text not null,
  package_name text not null,
  sessions_total integer default 1,
  sessions_completed integer default 0,
  mode text check (mode in ('tatap_muka', 'online')),
  session_date text not null,
  session_time text not null,
  student_name text not null,
  student_grade text not null,
  student_address text,
  total_amount integer not null,
  discount_amount integer default 0,
  payment_method text not null,
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'completed', 'cancelled')),
  va_number text not null,
  ticket_code text not null,
  qr_code text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null
);

-- 5. Session Evaluation & Progress Reports (Rapor Sesi)
create table if not exists public.evaluations (
  id uuid default uuid_generate_v4() primary key,
  booking_id text references public.bookings(id) on delete cascade,
  tutor_id text references public.tutors(id),
  student_name text not null,
  subject text not null,
  topic text not null,
  session_date text not null,
  session_number integer default 1,
  overall_score integer not null,
  competencies jsonb not null default '[]'::jsonb,
  tutor_notes text not null,
  recommendations text[] default '{}',
  homework_title text,
  homework_file_url text,
  homework_status text default 'pending' check (homework_status in ('pending', 'submitted', 'reviewed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Interactive Chat Messages
create table if not exists public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  booking_id text references public.bookings(id) on delete cascade,
  sender_type text check (sender_type in ('student', 'tutor', 'system')),
  sender_name text not null,
  text text not null,
  file_name text,
  file_size text,
  file_type text,
  timestamp text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. AI Matchmaking Logs
create table if not exists public.ai_matchmakings (
  id uuid default uuid_generate_v4() primary key,
  student_name text,
  grade text,
  curriculum text,
  learning_style text,
  target_goal text,
  weak_topics text[],
  budget_max integer,
  recommended_tutor_ids text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.tutors enable row level security;
alter table public.tutor_slots enable row level security;
alter table public.bookings enable row level security;
alter table public.evaluations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.ai_matchmakings enable row level security;

-- Public read policies for marketplace browsing
create policy "Allow public read access to tutors" on public.tutors for select using (true);
create policy "Allow public read access to tutor_slots" on public.tutor_slots for select using (true);
create policy "Allow public read access to bookings" on public.bookings for select using (true);
create policy "Allow public insert to bookings" on public.bookings for insert with check (true);
create policy "Allow public update to bookings" on public.bookings for update using (true);
create policy "Allow public read access to evaluations" on public.evaluations for select using (true);
create policy "Allow public read access to chat_messages" on public.chat_messages for select using (true);
create policy "Allow public insert to chat_messages" on public.chat_messages for insert with check (true);
create policy "Allow public insert to ai_matchmakings" on public.ai_matchmakings for insert with check (true);

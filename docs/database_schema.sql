create table if not exists users (
  id bigserial primary key,
  email varchar(255) unique not null,
  hashed_password varchar(255) not null,
  full_name varchar(255) not null,
  is_admin boolean default false,
  created_at timestamptz default now()
);

create table if not exists workout_plans (
  id bigserial primary key,
  user_id bigint not null references users(id),
  title varchar(255) not null,
  goal varchar(100) not null,
  days_per_week int not null,
  created_at timestamptz default now()
);

create table if not exists nutrition_logs (
  id bigserial primary key,
  user_id bigint not null references users(id),
  calories int,
  protein_g int,
  carbs_g int,
  fat_g int,
  logged_on date not null
);

create table if not exists progress_snapshots (
  id bigserial primary key,
  user_id bigint not null references users(id),
  weight_kg numeric(6,2),
  body_fat_pct numeric(5,2),
  notes text,
  captured_on date not null
);

create table if not exists learn_cards (
  id text primary key,
  region text not null default 'hamburg',
  category text not null check (category in ('vegetable', 'flower', 'fauna', 'tool')),
  name jsonb not null,
  image text not null,
  summary jsonb not null,
  tags text[] not null default '{}',
  scientific_name text,
  image_source text,
  image_credit text,
  image_license text,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists learn_cards_region_category_idx
  on learn_cards (region, category);

create index if not exists learn_cards_data_gin_idx
  on learn_cards using gin (data);

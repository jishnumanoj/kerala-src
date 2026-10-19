create table public.estimate_factors (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  help text not null default '',
  applies_to text[] not null default '{}',
  sort int not null default 0
);
grant select, insert, update, delete on public.estimate_factors to authenticated;
grant all on public.estimate_factors to service_role;
alter table public.estimate_factors enable row level security;
create policy "admin factors" on public.estimate_factors for all to authenticated
using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.estimate_factor_options (
  id uuid primary key default gen_random_uuid(),
  factor_id uuid not null references public.estimate_factors(id) on delete cascade,
  label text not null,
  multiplier numeric not null default 1,
  value numeric,
  benefits text not null default '',
  drawbacks text not null default '',
  is_default boolean not null default false,
  sort int not null default 0
);
grant select, insert, update, delete on public.estimate_factor_options to authenticated;
grant all on public.estimate_factor_options to service_role;
alter table public.estimate_factor_options enable row level security;
create policy "admin factor options" on public.estimate_factor_options for all to authenticated
using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

insert into public.estimate_factors (key,label,help,applies_to,sort) values
('ceiling_height','Ceiling height','Taller rooms need more wall, plaster, paint and a little more concrete in columns.','{"Bricks & Blocks","Plaster & Putty","Paint","Concrete","Steel & Metals"}',10),
('window_size','Window size','Each window''s width × height. Bigger windows mean more light and ventilation, but more frame and glass cost.','{}',20),
('windows_per_room','Windows per room','Applies to bedrooms, living rooms and kitchens.','{}',30),
('roof_type','Roof style','Kerala homes often pair a concrete slab with a sloping tiled roof for monsoon protection.','{"Roofing"}',40),
('soil_condition','Soil condition','Soft, clayey or water-logged ground needs deeper or pile foundations.','{"Foundation & Soil"}',50),
('plinth_height','Plinth height','Raising the floor above ground protects against flooding and dampness.','{"Foundation & Soil"}',60),
('finish_level','Finish level','Quality of fittings, joinery and fit-out across the home.','{"Interiors","Wood & Joinery","Tiles & Flooring","Electrical","Plumbing"}',70),
('site_access','Site access','Narrow lanes or hilly plots increase material handling and transport.','{}',80);

insert into public.estimate_factor_options (factor_id,label,multiplier,value,benefits,drawbacks,is_default,sort)
select f.id, o.label, o.m, o.v, o.b, o.d, o.def, o.s from public.estimate_factors f join (values
('ceiling_height','10 ft (standard)',1.0,null,'Most economical
Easy to cool','Feels less spacious',true,1),
('ceiling_height','11 ft',1.05,null,'Airier rooms, better hot-air rise
Good for ceiling fans','About 5% more on walls & finishes',false,2),
('ceiling_height','12 ft',1.10,null,'Grand, premium feel
Best natural cooling','About 10% more on walls & finishes
Taller doors/windows needed',false,3),
('ceiling_height','Double-height living',1.18,null,'Dramatic living space
Suits courtyard homes','Highest cost
Harder to clean and air-condition',false,4),
('window_size','Standard 4 × 4 ft',1,16,'Economical
Easy privacy and security','Less daylight',false,1),
('window_size','Large 5 × 5 ft',1,25,'Bright rooms, good cross-ventilation','More glass & frame cost',true,2),
('window_size','Wide 6 × 5 ft',1,30,'Wide garden views','Needs stronger lintels
More heat gain without shading',false,3),
('window_size','Floor-to-ceiling 6 × 8 ft',1,48,'Maximum daylight, premium look','Highest cost
Needs curtains/shading and safety glass',false,4),
('windows_per_room','1 window',1,1,'Lowest cost, more wall space for furniture','Weaker cross-ventilation',false,1),
('windows_per_room','2 windows',1,2,'Good cross-ventilation — ideal for Kerala climate','Slightly higher cost',true,2),
('windows_per_room','3 windows',1,3,'Very bright, airy rooms','Higher cost
Less wall space',false,3),
('roof_type','Flat concrete terrace',0.35,null,'Lowest roofing cost
Usable terrace','Hotter interiors
Water stagnation in monsoon',false,1),
('roof_type','Sloped concrete + clay tiles',1.0,null,'Classic Kerala look
Sheds monsoon rain fast','More formwork and tiling',true,2),
('roof_type','Flat slab + truss & clay tiles above',1.25,null,'Cool attic gap below tiles
Best leak protection','Highest roofing cost',false,3),
('soil_condition','Hard / laterite',0.9,null,'Strong natural base, shallower foundation','Excavation can be slower',false,1),
('soil_condition','Normal',1.0,null,'Standard footing design','—',true,2),
('soil_condition','Soft / clay / water-logged',1.6,null,'Safe long-term with pile or raft foundation','Much higher foundation cost
Needs soil test',false,3),
('plinth_height','Standard (2 ft)',1.0,null,'Economical','Less flood margin',true,1),
('plinth_height','Raised (3–4 ft)',1.3,null,'Better flood & damp protection
Traditional raised verandah feel','More filling and masonry; extra steps',false,2),
('finish_level','Standard',0.85,null,'Budget-friendly, reliable brands','Fewer design options',false,1),
('finish_level','Premium',1.0,null,'Branded fittings, better durability','Moderate cost',true,2),
('finish_level','Luxury',1.35,null,'Designer fittings, solid wood, imported finishes','Significantly higher cost
Longer lead times',false,3),
('site_access','Easy road access',1.0,null,'Lorries reach site directly','—',true,1),
('site_access','Narrow lane / hilly',1.06,null,'—','Extra loading, transport and labour',false,2)
) as o(k,label,m,v,b,d,def,s) on o.k = f.key;
create type public.app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;

-- first signed-up user becomes admin
create or replace function public.handle_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_first_admin after insert on auth.users
for each row execute function public.handle_first_admin();

create table public.estimate_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  description text,
  unit text not null,
  rate numeric not null default 0,
  quantity numeric not null default 0,
  basis text not null default 'sqft',
  scope text not null default 'structure',
  option_group text,
  is_default boolean not null default true,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.estimate_items to authenticated;
grant all on public.estimate_items to service_role;
alter table public.estimate_items enable row level security;
create policy "admin all items" on public.estimate_items for all to authenticated
using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.estimate_links (
  id uuid primary key default gen_random_uuid(),
  token text not null unique default encode(gen_random_bytes(12),'hex'),
  client_name text not null,
  client_phone text,
  client_email text,
  note text,
  expires_at timestamptz not null,
  revoked boolean not null default false,
  created_by uuid,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.estimate_links to authenticated;
grant all on public.estimate_links to service_role;
alter table public.estimate_links enable row level security;
create policy "admin all links" on public.estimate_links for all to authenticated
using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.estimate_submissions (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.estimate_links(id) on delete cascade,
  inputs jsonb not null,
  lines jsonb not null,
  total numeric not null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.estimate_submissions to authenticated;
grant all on public.estimate_submissions to service_role;
alter table public.estimate_submissions enable row level security;
create policy "admin all subs" on public.estimate_submissions for all to authenticated
using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.estimate_settings (
  id int primary key default 1,
  default_expiry_days int not null default 7,
  location_factors jsonb not null default '{"Ernakulam":1.05,"Thrissur":1.0,"Kozhikode":0.98,"Thiruvananthapuram":1.03,"Kottayam":1.0,"Palakkad":0.95,"Other":1.0}',
  floor_factor numeric not null default 0.04,
  contingency_pct numeric not null default 5,
  gst_pct numeric not null default 18,
  constraint single check (id = 1)
);
grant select, insert, update on public.estimate_settings to authenticated;
grant all on public.estimate_settings to service_role;
alter table public.estimate_settings enable row level security;
create policy "admin settings" on public.estimate_settings for all to authenticated
using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.estimate_settings(id) values (1);

-- Seed: indicative Kerala 2025-26 market rates. quantity = per unit of basis.
insert into public.estimate_items (category,name,description,unit,rate,quantity,basis,scope,option_group,is_default,sort) values
('Foundation & Soil','Excavation & soil work','Earthwork excavation in ordinary soil incl. disposal','cu.m',450,0.12,'ground_sqft','structure',null,true,10),
('Foundation & Soil','Soil investigation test','Bore-log / SBC test','lumpsum',18000,1,'lumpsum','structure',null,true,11),
('Foundation & Soil','Laterite / rubble masonry foundation','Random rubble in CM 1:6','cu.m',5200,0.035,'ground_sqft','structure',null,true,12),
('Foundation & Soil','Anti-termite treatment','Pre-construction chemical treatment','sq.ft',8,1,'ground_sqft','structure',null,true,13),
('Concrete','RMC M20','Ready-mix concrete M20 (economy)','cu.m',6200,0.045,'sqft','structure','concrete_grade',false,20),
('Concrete','RMC M25','Ready-mix concrete M25 (recommended for residences)','cu.m',6700,0.045,'sqft','structure','concrete_grade',true,21),
('Concrete','RMC M30','Ready-mix concrete M30 (high-strength)','cu.m',7300,0.045,'sqft','structure','concrete_grade',false,22),
('Concrete','RMC M50','High-performance concrete M50 (special elements)','cu.m',9500,0.045,'sqft','structure','concrete_grade',false,23),
('Steel & Metals','TMT steel Fe500D','Primary reinforcement (JSW / Tata Tiscon class)','kg',72,4.0,'sqft','structure','steel_brand',true,30),
('Steel & Metals','TMT steel Fe550D','Higher-grade reinforcement','kg',76,4.0,'sqft','structure','steel_brand',false,31),
('Steel & Metals','Binding wire & MS sections','Binding wire, MS grills, staircase railing base','kg',95,0.25,'sqft','structure',null,true,32),
('Cement','OPC 53 grade cement','UltraTech / Ramco / Dalmia, 50 kg bag','bag',420,0.4,'sqft','structure','cement',true,40),
('Cement','PPC cement','Portland pozzolana, for masonry & plaster','bag',395,0.4,'sqft','structure','cement',false,41),
('Sand & Aggregates','M-Sand (concrete)','Manufactured sand for concrete','cu.ft',62,1.2,'sqft','structure',null,true,50),
('Sand & Aggregates','P-Sand (plastering)','Plastering sand','cu.ft',70,0.8,'sqft','structure',null,true,51),
('Sand & Aggregates','20 mm aggregate (jelly)','Coarse aggregate','cu.ft',52,1.0,'sqft','structure',null,true,52),
('Bricks & Blocks','Solid concrete blocks 8"','Load-bearing / partition block','nos',48,9,'sqft','structure','masonry',true,60),
('Bricks & Blocks','Laterite stone','Traditional Kerala laterite (vettukallu)','nos',62,7,'sqft','structure','masonry',false,61),
('Bricks & Blocks','Wire-cut clay bricks','Red clay bricks','nos',11,22,'sqft','structure','masonry',false,62),
('Bricks & Blocks','AAC blocks','Lightweight AAC 600x200x200','cu.m',4800,0.06,'sqft','structure','masonry',false,63),
('Roofing','Clay roof tiles (Mangalore pattern)','Sloping roof tiling on GI truss','sq.ft',145,0.55,'sqft','structure',null,true,70),
('Roofing','GI truss work','Galvanised truss for sloping roof','sq.ft',210,0.55,'sqft','structure',null,true,71),
('Plaster & Putty','Internal & external plastering','CM 1:4 12 mm','sq.ft',38,3.2,'sqft','structure',null,true,80),
('Plaster & Putty','Wall putty (2 coats)','Birla / Asian Paints putty','sq.ft',14,3.2,'sqft','interior',null,true,81),
('Paint','Interior emulsion','Premium emulsion, primer + 2 coats','sq.ft',24,2.6,'sqft','interior','interior_paint',true,90),
('Paint','Interior luxury emulsion','Royale / Velvet touch class','sq.ft',34,2.6,'sqft','interior','interior_paint',false,91),
('Paint','Exterior weatherproof paint','Apex Ultima / Weathercoat class','sq.ft',30,1.4,'sqft','structure',null,true,92),
('Tiles & Flooring','Vitrified floor tiles 2x2','Mid-range vitrified incl. laying','sq.ft',95,1.0,'sqft','interior','flooring',true,100),
('Tiles & Flooring','Large-format GVT 4x2','Premium glazed vitrified incl. laying','sq.ft',140,1.0,'sqft','interior','flooring',false,101),
('Tiles & Flooring','Granite / Italian marble','Natural stone incl. polishing','sq.ft',260,1.0,'sqft','interior','flooring',false,102),
('Tiles & Flooring','Bathroom wall & floor tiles','Anti-skid floor + wall dado 7 ft','sq.ft',85,180,'bathroom','interior',null,true,103),
('Tiles & Flooring','Kitchen dado tiles','Wall tiles above counter','sq.ft',80,60,'kitchen','interior',null,true,104),
('Wood & Joinery','Main door — teak','Solid teak frame + shutter','nos',85000,1,'lumpsum','structure',null,true,110),
('Wood & Joinery','Internal doors','Hardwood frame + flush/membrane shutter','nos',16500,1,'room','structure',null,true,111),
('Wood & Joinery','Bathroom doors','WPC / FRP door with frame','nos',9500,1,'bathroom','structure',null,true,112),
('Wood & Joinery','Windows — wood','Hardwood frame with glass shutters','sq.ft',1150,15,'room','structure','windows',true,113),
('Wood & Joinery','Windows — UPVC','UPVC sliding/casement','sq.ft',780,15,'room','structure','windows',false,114),
('Wood & Joinery','Staircase handrail — teak','Teak handrail per floor','r.ft',2200,14,'extra_floor','structure',null,true,115),
('Electrical','Concealed wiring & conduits','FR wires (Finolex/Havells), PVC conduits','sq.ft',95,1.0,'sqft','structure',null,true,120),
('Electrical','Switches & sockets (modular)','Legrand / Schneider class','points',650,10,'room','structure',null,true,121),
('Electrical','Distribution board & MCBs','DB, MCB, RCCB per floor','set',18000,1,'floor','structure',null,true,122),
('Electrical','Earthing & lightning arrester','Chemical earthing pits','lumpsum',28000,1,'lumpsum','structure',null,true,123),
('Electrical','Light fixtures & fans','LED panels, fans (BLDC)','set',14000,1,'room','interior',null,true,124),
('Plumbing','Water supply lines (CPVC)','Ashirvad / Astral CPVC hot+cold','points',2400,6,'bathroom','structure',null,true,130),
('Plumbing','Drainage lines (SWR)','SWR pipes & chambers','r.ft',260,0.15,'sqft','structure',null,true,131),
('Plumbing','Sanitaryware set','EWC, washbasin, accessories (Hindware/Parryware)','set',32000,1,'bathroom','interior',null,true,132),
('Plumbing','CP fittings','Jaquar class mixer, shower, taps','set',26000,1,'bathroom','interior',null,true,133),
('Plumbing','Kitchen sink & fittings','SS sink + pull-out tap','set',18000,1,'kitchen','interior',null,true,134),
('Plumbing','Overhead tank & sump','1000 L tank + 5000 L sump + pump','lumpsum',95000,1,'lumpsum','structure',null,true,135),
('Plumbing','Septic tank & soak pit','As per KMBR norms','lumpsum',85000,1,'lumpsum','structure',null,true,136),
('Waterproofing','Terrace & bathroom waterproofing','Polymer / crystalline membrane','sq.ft',55,0.6,'sqft','structure',null,true,140),
('Interiors','Modular kitchen','BWP ply + laminate, hardware (Hettich)','nos',325000,1,'kitchen','interior',null,true,150),
('Interiors','Wardrobes','Ply + laminate, per bedroom','nos',95000,1,'room','interior',null,true,151),
('Interiors','Living room furnishing','TV unit, false ceiling, accent panelling','nos',180000,1,'living','interior',null,true,152),
('Interiors','Gypsum false ceiling','Saint-Gobain gypsum with cove lighting','sq.ft',95,0.35,'sqft','interior',null,true,153),
('Labour','Structure labour','Mason, helper, bar-bending, shuttering','sq.ft',480,1.0,'sqft','structure',null,true,160),
('Labour','Interior labour & supervision','Carpentry, fit-out, site supervision','sq.ft',120,1.0,'sqft','interior',null,true,161);
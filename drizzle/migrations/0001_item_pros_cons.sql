alter table public.estimate_items add column benefits text not null default '', add column drawbacks text not null default '';
update public.estimate_items set benefits = v.b, drawbacks = v.d from (values
('RMC M20','Lowest cost
Adequate for small single-storey homes','Lower strength & durability
Not ideal for coastal / humid Kerala exposure'),
('RMC M25','Recommended standard for RCC homes
Good balance of strength and cost
Better durability in monsoon climate','Slightly costlier than M20'),
('RMC M30','Higher strength for larger spans & 3+ floors
Improved durability','Higher cost
Usually not needed for typical homes'),
('RMC M50','Very high strength for special elements','Expensive
Needs strict quality control; overkill for homes'),
('TMT steel Fe500D','Ductile — better in seismic loads
Widely available, trusted brands','Slightly more steel weight than Fe550D'),
('TMT steel Fe550D','Higher strength, less steel needed','Less ductile
Costlier per kg'),
('OPC 53 grade cement','Fast strength gain
Ideal for RCC slabs, columns','Higher heat of hydration — more cracking risk in plaster'),
('PPC cement','Smoother finish, fewer cracks
Better for plaster and masonry
Eco-friendlier','Slower early strength'),
('Solid concrete blocks 8"','Fast construction, uniform size
Economical','Heavier; lower thermal insulation'),
('Laterite stone','Traditional Kerala character
Naturally cool interiors
Locally sourced','Irregular sizes need more plaster
Supply quality varies'),
('Wire-cut clay bricks','Good thermal comfort
Classic, strong walls','Slower to build
More mortar and labour'),
('AAC blocks','Lightweight — saves structure cost
Excellent insulation','Needs special adhesive
Can absorb moisture if not sealed'),
('Interior emulsion','Good value, washable','Average sheen and stain resistance'),
('Interior luxury emulsion','Rich finish, highly washable
Long lasting','Higher cost'),
('Vitrified floor tiles 2x2','Affordable, low maintenance','More grout lines
Standard look'),
('Large-format GVT 4x2','Premium seamless look
Fewer joints, easy cleaning','Costlier; needs skilled laying'),
('Granite / Italian marble','Luxurious natural finish
Very long life','Most expensive
Marble needs periodic polishing'),
('Windows — wood','Warm traditional Kerala look
Repairable, timeless','Needs polishing / maintenance
Termite risk if untreated'),
('Windows — UPVC','Low maintenance, weather-sealed
Good sound insulation','Less traditional look
Cannot be repaired easily')
) as v(n,b,d) where public.estimate_items.name = v.n;
-- Optional: seeds the 20 sample businesses (same ones currently hardcoded in
-- src/data/businesses.js) into the real `businesses` table, so the directory
-- isn't empty while real vendors are still signing up. Run after schema.sql,
-- in the same SQL Editor. Safe to skip or delete later -- these rows have
-- owner_id = null, so they never collide with a real vendor's listing.

insert into businesses (name, cat, society, served, area, "desc", phone, whatsapp, hide_phone, verified, status, offer, offer_valid, items, hours)
values
  ('Annapurna Home Kitchen', 'food', 'prestige', array['prestige'], 'Tower B', 'Homestyle North Indian thalis and tiffin plans, cooked fresh every morning.', '+91 98XXX XXX10', '+91 98XXX XXX10', true, true, 'approved', '10% off your first weekly tiffin plan', 'Valid till 30 Nov 2026',
    '[["Veg thali","Dal, sabzi, roti, rice, salad","₹160"],["Rajma chawal combo","With raita and papad","₹130"],["Paneer butter masala combo","With 3 rotis and rice","₹190"],["Weekly lunch tiffin plan","Monday to Saturday, per week","₹900"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Sharma Tuition Hub', 'edu', 'prestige', array['prestige'], 'Tower D', 'Maths and science coaching for classes 6 to 10 in small batches.', '+91 98XXX XXX11', '+91 98XXX XXX11', true, true, 'approved', 'Free demo class for new students', 'Valid till 30 Nov 2026',
    '[["Maths, classes 6 to 8","Mon, Wed, Fri, 5 pm","₹1,500 / month"],["Science, classes 9 to 10","Tue, Thu, 5 pm","₹1,800 / month"],["Doubt-clearing session","Saturday, 11 am","₹300 / session"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Glow by Meera', 'beauty', 'prestige', array['prestige'], 'Tower A', 'Bridal and party makeup, threading and facials at home or studio.', '+91 98XXX XXX12', '+91 98XXX XXX12', true, false, 'approved', '', '',
    '[["Party makeup","At home or studio","₹2,500"],["Threading","Per session","₹60"],["Facial","Basic cleanup","₹700"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Rangoli Fashion Studio', 'fashion', 'prestige', array['prestige'], 'Clubhouse Lane', 'Custom blouses, kurtis and alterations with quick turnaround.', '+91 98XXX XXX13', '+91 98XXX XXX13', true, true, 'approved', '', '',
    '[["Blouse stitching","3 to 5 day turnaround","₹450"],["Kurti stitching","Custom fit","₹600"],["Alterations","Hemming and fitting","From ₹80"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Fresh Basket Grocers', 'grocery', 'prestige', array['prestige'], 'Gate 2 Arcade', 'Daily vegetables, dairy and pantry staples with society delivery.', '+91 98XXX XXX14', '+91 98XXX XXX14', true, true, 'approved', 'Free delivery on orders above ₹300', 'Valid till 30 Nov 2026',
    '[["Daily vegetable basket","Delivered by 8 am","₹250"],["Milk and curd subscription","Monthly","₹1,800"],["Pantry staples","Order via WhatsApp","As per list"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('FixIt Home Services', 'home', 'prestige', array['prestige'], 'Main Road', 'Plumbing, electrical and AC servicing by trained technicians.', '+91 98XXX XXX15', '+91 98XXX XXX15', true, false, 'approved', '', '',
    '[["Plumbing visit","Includes inspection","₹250"],["Electrical repair","Per visit","₹300"],["AC service","Split AC, per unit","₹599"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('FitFlow with Arjun', 'fitness', 'prestige', array['prestige'], 'Clubhouse Terrace', 'Morning strength and yoga batches for adults and seniors.', '+91 98XXX XXX16', '+91 98XXX XXX16', true, false, 'approved', '', '',
    '[["Morning strength batch","6:30 am, Mon to Fri","₹1,800 / month"],["Yoga for seniors","8 am, Tue and Thu","₹1,200 / month"],["Trial class","First session","Free"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Priya''s Bake Studio', 'food', 'prestige', array['prestige'], 'Tower C', 'Eggless cakes, cookies and festival hampers made on order.', '+91 98XXX XXX17', '+91 98XXX XXX17', true, false, 'approved', '', '',
    '[["Veg thali","Dal, sabzi, roti, rice, salad","₹160"],["Rajma chawal combo","With raita and papad","₹130"],["Paneer butter masala combo","With 3 rotis and rice","₹190"],["Weekly lunch tiffin plan","Monday to Saturday, per week","₹900"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Nair Maths Classes', 'edu', 'prestige', array['prestige'], 'Tower E', 'Weekend maths batches for classes 8 to 12.', '+91 98XXX XXX18', '+91 98XXX XXX18', true, true, 'approved', '', '',
    '[["Maths, classes 6 to 8","Mon, Wed, Fri, 5 pm","₹1,500 / month"],["Science, classes 9 to 10","Tue, Thu, 5 pm","₹1,800 / month"],["Doubt-clearing session","Saturday, 11 am","₹300 / session"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Sundar Tiffin Service', 'food', 'prestige', array['prestige'], 'Tower F', 'Daily lunch and dinner tiffins with weekly plans.', '+91 98XXX XXX19', '+91 98XXX XXX19', true, false, 'approved', '', '',
    '[["Veg thali","Dal, sabzi, roti, rice, salad","₹160"],["Rajma chawal combo","With raita and papad","₹130"],["Paneer butter masala combo","With 3 rotis and rice","₹190"],["Weekly lunch tiffin plan","Monday to Saturday, per week","₹900"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Kavita Yoga Studio', 'fitness', 'purva', array['purva'], 'Block 2', 'Beginner yoga and breathing classes for all ages.', '+91 98XXX XXX20', '+91 98XXX XXX20', true, true, 'approved', '', '',
    '[["Morning strength batch","6:30 am, Mon to Fri","₹1,800 / month"],["Yoga for seniors","8 am, Tue and Thu","₹1,200 / month"],["Trial class","First session","Free"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Studio Aarna Salon', 'beauty', 'purva', array['purva'], 'Clubhouse', 'Haircuts, spa and grooming for the whole family.', '+91 98XXX XXX21', '+91 98XXX XXX21', true, false, 'approved', '', '',
    '[["Party makeup","At home or studio","₹2,500"],["Threading","Per session","₹60"],["Facial","Basic cleanup","₹700"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Threads and Trends', 'fashion', 'purva', array['purva'], 'Block 4', 'Ethnic wear and festive collections, sold from home.', '+91 98XXX XXX22', '+91 98XXX XXX22', true, true, 'approved', '', '',
    '[["Blouse stitching","3 to 5 day turnaround","₹450"],["Kurti stitching","Custom fit","₹600"],["Alterations","Hemming and fitting","From ₹80"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('GreenLeaf Organics', 'grocery', 'mantri', array['mantri'], 'Gate 1', 'Organic produce delivered twice a week.', '+91 98XXX XXX23', '+91 98XXX XXX23', true, true, 'approved', '', '',
    '[["Daily vegetable basket","Delivered by 8 am","₹250"],["Milk and curd subscription","Monthly","₹1,800"],["Pantry staples","Order via WhatsApp","As per list"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('CoolBreeze AC Care', 'home', 'mantri', array['mantri'], 'Tower 3', 'AC service, gas refill and repairs.', '+91 98XXX XXX24', '+91 98XXX XXX24', true, false, 'approved', '', '',
    '[["Plumbing visit","Includes inspection","₹250"],["Electrical repair","Per visit","₹300"],["AC service","Split AC, per unit","₹599"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Little Scholars Art Class', 'edu', 'mantri', array['mantri'], 'Tower 1', 'Drawing and craft sessions for kids on weekends.', '+91 98XXX XXX25', '+91 98XXX XXX25', true, false, 'approved', '', '',
    '[["Maths, classes 6 to 8","Mon, Wed, Fri, 5 pm","₹1,500 / month"],["Science, classes 9 to 10","Tue, Thu, 5 pm","₹1,800 / month"],["Doubt-clearing session","Saturday, 11 am","₹300 / session"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Spice Route Caterers', 'food', 'hiranandani', array['hiranandani'], 'Central Plaza', 'Party and festival catering for small groups.', '+91 98XXX XXX26', '+91 98XXX XXX26', true, true, 'approved', '', '',
    '[["Veg thali","Dal, sabzi, roti, rice, salad","₹160"],["Rajma chawal combo","With raita and papad","₹130"],["Paneer butter masala combo","With 3 rotis and rice","₹190"],["Weekly lunch tiffin plan","Monday to Saturday, per week","₹900"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Tailor Master Raju', 'fashion', 'hiranandani', array['hiranandani'], 'Lane 5', 'Stitching and alterations in two days.', '+91 98XXX XXX27', '+91 98XXX XXX27', true, false, 'approved', '', '',
    '[["Blouse stitching","3 to 5 day turnaround","₹450"],["Kurti stitching","Custom fit","₹600"],["Alterations","Hemming and fitting","From ₹80"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Daily Dairy Direct', 'grocery', 'magarpatta', array['magarpatta'], 'Gate 3', 'Fresh milk and curd, delivered by 7 am.', '+91 98XXX XXX28', '+91 98XXX XXX28', true, true, 'approved', '', '',
    '[["Daily vegetable basket","Delivered by 8 am","₹250"],["Milk and curd subscription","Monthly","₹1,800"],["Pantry staples","Order via WhatsApp","As per list"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]'),

  ('Sparkle Cleaners', 'home', 'dlf', array['dlf'], 'Tower 9', 'Deep cleaning for flats and kitchens.', '+91 98XXX XXX29', '+91 98XXX XXX29', true, false, 'approved', '', '',
    '[["Plumbing visit","Includes inspection","₹250"],["Electrical repair","Per visit","₹300"],["AC service","Split AC, per unit","₹599"]]',
    '[{"day":"Mon","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Tue","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Wed","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Thu","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Fri","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sat","open":true,"from":"8:00 am","to":"9:00 pm"},{"day":"Sun","open":false,"from":"8:00 am","to":"9:00 pm"}]');

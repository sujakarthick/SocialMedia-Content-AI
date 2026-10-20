-- NammaContent AI - Seed Data for Local Development and Testing

-- Sample Organizations
INSERT INTO public.organizations (id, name, slug, billing_email, plan_tier, plan_status, monthly_credits_limit)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'Velan Hospitality Group', 'velan-hospitality', 'owner@velanchettinad.in', 'pro', 'active', 500),
  ('a0000000-0000-0000-0000-000000000002', 'Aara Silk & Boutique', 'aara-silks', 'contact@aarasliks.com', 'starter', 'active', 100)
ON CONFLICT (id) DO NOTHING;

-- Sample Brand Profiles
INSERT INTO public.brand_profiles (
  id, organization_id, name, industry, description, products_services,
  target_audience, preferred_languages, brand_tone, contact_phone, whatsapp_number,
  location_address, instagram_handle, marketing_goals, is_default
)
VALUES 
  (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Velan Chettinad Mess & Biryani',
    'restaurant',
    'Authentic spicy Chettinad cuisine, seeraga samba mutton biryani, and traditional filter coffee made with farm-fresh cow milk.',
    'Seeraga Samba Mutton Biryani, Nattu Kozhi Varuval, Chettinad Crab Roast, Vazhaipoo Vadai, Filter Coffee',
    'Foodies, families, weekend lunch crowd, office delivery customers in Chennai',
    ARRAY['tanglish', 'tamil', 'english'],
    'friendly_trendy',
    '+91 98401 23456',
    '+91 98401 23456',
    'No. 42, Venkatanarayana Road, T. Nagar, Chennai 600017',
    '@velanchettinadmess',
    'Drive weekend footfall, promote Sunday Biryani pre-orders, and increase Swiggy/Zomato delivery orders',
    true
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'Aara Designer Silks & Sarees',
    'clothing',
    'Handwoven pure Kanchipuram silk sarees, contemporary pastel bridal drapes, and bespoke blouse stitching.',
    'Bridal Kanchipuram Sarees, Soft Silk Sarees, Ready-to-wear Drapes, Handcrafted Blouses',
    'Brides-to-be, festival shoppers, South Indian diaspora, mothers & daughters',
    ARRAY['tamil', 'tanglish', 'english'],
    'premium_luxury',
    '+91 94432 98765',
    '+91 94432 98765',
    '12, Crosscut Road, Gandhipuram, Coimbatore 641012',
    '@aaradesignersilks',
    'Promote wedding season collection, announce festival discounts, and book in-store bridal appointments',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Sample Content Generations
INSERT INTO public.content_generations (
  id, organization_id, user_id, brand_id, platform, content_type, language,
  prompt_inputs, output_content, model_used, credits_used, is_mock
)
VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'instagram',
    'caption',
    'tanglish',
    '{"topic": "Sunday Special Seeraga Samba Mutton Biryani", "offer": "Buy 2 get 1 Chicken 65 free"}'::jsonb,
    '{"headline": "Sunday-na Biryani illaama epdi boss?! 🍗🔥", "body": "Vera level manam, authentic seeraga samba arisi, tender mutton chunks marinated in traditional Karaikudi spices! Inaikku Velan Chettinad-la Sunday Special Biryani ready aayiruchu.\n\n✨ Exclusive Offer: Pre-order 2 Mutton Biryani and get Crispy Chicken 65 absolutely FREE! ✨\n\nFamily kooda vaanga, illana Swiggy/Zomato-la order pannunga. Vazhai ilai potu saapda marakkaadheenga!", "cta": "Call us at +91 98401 23456 or tap the link in bio to order now! 🛵", "hashtags": ["#ChennaiBiryani", "#NammaChennai", "#TanglishMemes", "#ChettinadFood", "#TNagarEats", "#SundayBiryaniSpecial"]}'::jsonb,
    'gemini-1.5-pro',
    1,
    false
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'instagram',
    'festival',
    'tamil',
    '{"topic": "Pongal Thirunaal Nalvaazhthukkal Special Feast", "offer": "Kootanchoru & Sweet Pongal Box"}'::jsonb,
    '{"headline": "பொங்கலோ பொங்கல்! பாரம்பரிய சுவை நிறைந்த விருந்து! 🌾🪔", "body": "உழவர் திருநாளாம் தைப் பொங்கலை உங்கள் குடும்பத்தோடு இனிதே கொண்டாட, வேலன் செட்டிநாடு மெஸ் வழங்கும் சிறப்பான பொங்கல் விருந்து!\n\nமணமணக்கும் நெய் சர்க்கரைப் பொங்கல், பாரம்பரிய நாட்டுக்கோழி வறுவல் மற்றும் சுடச்சுட வாழை இலை விருந்து தயாராக உள்ளது.\n\nஉங்கள் இல்லத்து விழாவுக்கு சிறப்பு உணவுகள் இப்போதே முன்பதிவு செய்யுங்கள்!", "cta": "முன்பதிவு செய்ய பயோவில் உள்ள லிங்கை அழுத்தவும் அல்லது அழைக்கவும்: +91 98401 23456", "hashtags": ["#தைப்பொங்கல்", "#பொங்கல்2026", "#சென்னைஉணவு", "#செட்டிநாடுவிருந்து", "#பாரம்பரியசுவை"]}'::jsonb,
    'gemini-1.5-pro',
    1,
    false
  )
ON CONFLICT (id) DO NOTHING;

-- Sample Calendar Item
INSERT INTO public.content_calendar_items (
  id, organization_id, user_id, brand_id, title, body, scheduled_date, scheduled_time, platform, status
)
VALUES
  (
    'd0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Sunday Biryani Rush Post',
    'Sunday-na Biryani illaama epdi boss?! Pre-order 2 Mutton Biryani get Chicken 65 Free! Order now via link in bio.',
    CURRENT_DATE + INTERVAL '2 days',
    '11:30:00',
    'instagram',
    'scheduled'
  )
ON CONFLICT (id) DO NOTHING;

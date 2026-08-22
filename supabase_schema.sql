-- ====================================================================
-- Google AI Pro Landing Page & Dashboard - Supabase SQL Schema
-- Run this entire script in Supabase SQL Editor (https://supabase.com/dashboard/project/ljedvghtylsyscwimbse/sql)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT DEFAULT 'Administrator',
    role TEXT DEFAULT 'super_admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Plan Pricing Table
CREATE TABLE IF NOT EXISTS public.plan_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC DEFAULT 0,
    discount_percent INTEGER DEFAULT 0,
    monthly_breakdown TEXT NOT NULL,
    badge TEXT DEFAULT '',
    badge_color TEXT DEFAULT 'blue',
    description TEXT DEFAULT '',
    account_type_title TEXT DEFAULT 'Personal & Secure',
    account_type_subtitle TEXT DEFAULT 'Full Privacy & Control',
    account_type_style TEXT DEFAULT 'blue',
    account_type_icon TEXT DEFAULT 'ShieldCheck',
    highlights JSONB DEFAULT '[]'::jsonb,
    duration_perk TEXT DEFAULT '',
    popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Buyers Table
CREATE TABLE IF NOT EXISTS public.buyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    total_orders INTEGER DEFAULT 1,
    total_spent NUMERIC DEFAULT 0,
    current_plan TEXT DEFAULT '',
    status TEXT DEFAULT 'active',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    plan_key TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    order_status TEXT DEFAULT 'pending_activation',
    trx_id TEXT DEFAULT '',
    payer_phone TEXT DEFAULT '',
    target_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    notes TEXT DEFAULT '',
    metadata TEXT DEFAULT '',
    buyer_id UUID REFERENCES public.buyers(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create SMS Transactions Table
CREATE TABLE IF NOT EXISTS public.sms_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    trx_id TEXT UNIQUE NOT NULL,
    amount NUMERIC NOT NULL,
    sender_phone TEXT DEFAULT '',
    raw_message TEXT NOT NULL,
    is_used BOOLEAN DEFAULT false,
    used_in_order_id TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Site Content Table
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT DEFAULT '',
    content TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create Admin Logs Table
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT DEFAULT '',
    details TEXT DEFAULT '',
    ip_address TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- Disable Row Level Security (RLS) so Server APIs have full access
-- ====================================================================
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_pricing DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs DISABLE ROW LEVEL SECURITY;

-- ====================================================================
-- SEED INITIAL DEFAULT DATA
-- ====================================================================

-- 1. Default Super Admin (admin / admin123456)
INSERT INTO public.admins (username, email, password_hash, name, role)
VALUES (
    'admin',
    'admin@googleai.neonweb.xyz',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123456
    'Super Admin',
    'super_admin'
)
ON CONFLICT (username) DO NOTHING;

-- 2. Default Pricing Plans (1m, 12m, 18m)
INSERT INTO public.plan_pricing (
    plan_key, name, price, original_price, discount_percent, monthly_breakdown,
    badge, badge_color, description, account_type_title, account_type_subtitle,
    account_type_style, account_type_icon, highlights, duration_perk, popular, is_active, order_index
)
VALUES 
(
    '1m',
    '১ মাসের ট্রায়াল প্যাক',
    149,
    299,
    50,
    '৳১৪৯ / ১ মাস',
    'বাজেট ফ্রেন্ডলি',
    'zinc',
    'Gemini Advanced ও 2TB স্টোরেজ এক্সপ্লোর করার জন্য সেরা ট্রায়াল প্যাক।',
    'পার্সোনাল জিমেইল এক্সেস',
    '১০০% নিরাপদ ও ব্যক্তিগত ডাটা',
    'zinc',
    'ShieldCheck',
    '["Gemini Advanced 1.5 Pro & Ultra মডেল এক্সেস", "২ টেরাবাইট (2TB) গুগল ওয়ান ক্লাউড স্টোরেজ", "Google Docs, Gmail ও Drive-এ ইন্টিগ্রেটেড AI", "১ মাসের নিরবচ্ছিন্ন গ্যারান্টিযুক্ত সার্ভিস"]'::jsonb,
    '১ মাস আনলিমিটেড এক্সেস',
    false,
    true,
    0
),
(
    '12m',
    '১২ মাসের অ্যানুয়াল প্যাক',
    399,
    1499,
    73,
    '৳৩৩ / মাস',
    'জনপ্রিয় পছন্দ',
    'blue',
    'দীর্ঘমেয়াদে প্রফেশনাল কাজ, রিসার্চ ও কোডিংয়ের জন্য সেরা বাৎসরিক ডিল।',
    'পার্সোনাল জিমেইল এক্সেস',
    'সম্পূর্ণ বাৎসরিক ভ্যালিডিটি ও সাপোর্ট',
    'blue',
    'Zap',
    '["Gemini Advanced 1.5 Pro & Ultra ফুল এক্সেস", "২০০০ জিবি (2TB) সিকিউর ক্লাউড স্টোরেজ", "Docs, Sheets, Slides ও Meet-এ স্মার্ট AI সুবিধা", "১২ মাসের ফুল রিপ্লেসমেন্ট ওয়ারেন্টি ও সাপোর্ট"]'::jsonb,
    '১২ মাস নিরবচ্ছিন্ন ভ্যালিডিটি',
    false,
    true,
    1
),
(
    '18m',
    '১৮ মাসের মেগা অফার',
    499,
    2499,
    80,
    '৳২৭ / মাস',
    'সর্বোচ্চ সাশ্রয়ী (Best Value)',
    'purple',
    'দেড় বছরের জন্য আনলিমিটেড সুপারপাওয়ার। সবচেয়ে কম খরচে সেরা ভ্যালু!',
    'পার্সোনাল জিমেইল এক্সেস',
    'সর্বোচ্চ প্রাইভেসি ও ১৮ মাসের ফুল সাপোর্ট',
    'purple',
    'Sparkles',
    '["সর্বাধুনিক Gemini Advanced 1.5 Pro মডেল এক্সেস", "২ টেরাবাইট (2TB) গুগল ক্লাউড স্টোরেজ", "হাই-স্পিড রেসপন্স ও প্রায়োরিটি সার্ভার এক্সেস", "১৮ মাসের ফুল রিপ্লেসমেন্ট ওয়ারেন্টি ও ২৪/৭ ভিআইপি সাপোর্ট"]'::jsonb,
    '১৮ মাস মেগা ভ্যালিডিটি',
    true,
    true,
    2
)
ON CONFLICT (plan_key) DO UPDATE SET
    price = EXCLUDED.price,
    name = EXCLUDED.name;

-- 3. Default FAQs
INSERT INTO public.faqs (question, answer, category, order_index, is_active)
VALUES
(
    'এটি কি আমার নিজস্ব পার্সোনাল জিমেইলে এক্টিভ হবে?',
    'হ্যাঁ, ১০০% আপনার নিজস্ব জিমেইল একাউন্টেই Google AI Pro (Gemini Advanced + 2TB Storage) সাবস্ক্রিপশন চালু করে দেওয়া হবে। আপনার কোনো পাসওয়ার্ড শেয়ার করতে হবে না।',
    'general',
    0,
    true
),
(
    'পেমেন্ট করার কতক্ষণ পর এক্সেস পাবো?',
    'স্বয়ংক্রিয় bKash পেমেন্ট গেটওয়ে বা ম্যানুয়াল ট্রানজেকশন সাবমিট করার পর সাধারণত ৫ থেকে ১৫ মিনিটের মধ্যে আপনার গুগল অ্যাকাউন্টে মেম্বারশিপ অ্যাক্টিভ হয়ে যাবে।',
    'general',
    1,
    true
),
(
    'আমার আগের গুগল ড্রাইভের ফাইলগুলো কি নিরাপদ থাকবে?',
    'অবশ্যই! আপনার বর্তমান ফাইল, ছবি বা ডাটাতে কোনো প্রভাব পড়বে না। শুধু আপনার বর্তমান স্টোরেজ ক্যাপাসিটি বেড়ে ২,০০০ জিবি (2TB) হয়ে যাবে এবং জেমিনাই এআই প্রো ফিচার আনলক হবে।',
    'general',
    2,
    true
),
(
    'যদি কোনো সমস্যা হয়, আমি কি রিফান্ড বা সাপোর্ট পাবো?',
    'আমাদের প্রতিটি প্ল্যানের সাথেই সম্পূর্ণ মেয়াদের ফুল রিপ্লেসমেন্ট ওয়ারেন্টি রয়েছে। যেকোনো টেকনিক্যাল সমস্যায় আমাদের WhatsApp বা Telegram সাপোর্টে জানালে তাৎক্ষণিক সমাধান পাবেন।',
    'support',
    3,
    true
)
ON CONFLICT DO NOTHING;

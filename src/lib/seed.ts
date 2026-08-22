import { supabase } from "./supabase";
import { hashPassword } from "./auth";

export async function seedDatabase() {
  console.log("Checking Supabase database initialization...");

  // 1. Seed Default Admin if not exists
  const { data: existingAdmin } = await supabase
    .from("admins")
    .select("id")
    .eq("username", "admin")
    .maybeSingle();

  if (!existingAdmin) {
    const passwordHash = await hashPassword("admin123456");
    await supabase.from("admins").insert({
      username: "admin",
      email: "admin@googleai.neonweb.xyz",
      name: "Super Administrator",
      role: "super_admin",
      password_hash: passwordHash,
    });
    console.log("Default admin created: admin / admin123456");
  }

  // 2. Seed Default Plans if not exists
  const { count: planCount } = await supabase
    .from("plan_pricing")
    .select("*", { count: "exact", head: true });

  if (!planCount || planCount === 0) {
    const defaultPlans = [
      {
        plan_key: "1m",
        name: "১ মাসের ট্রায়াল প্যাক",
        price: 149,
        original_price: 299,
        discount_percent: 50,
        monthly_breakdown: "৳১৪৯ / ১ মাস",
        badge: "বাজেট ফ্রেন্ডলি",
        badge_color: "zinc",
        description: "Gemini Advanced ও 2TB স্টোরেজ এক্সপ্লোর করার জন্য সেরা ট্রায়াল প্যাক।",
        account_type_title: "পার্সোনাল জিমেইল এক্সেস",
        account_type_subtitle: "১০০% নিরাপদ ও ব্যক্তিগত ডাটা",
        account_type_style: "zinc",
        account_type_icon: "ShieldCheck",
        highlights: JSON.stringify([
          "Gemini Advanced 1.5 Pro & Ultra মডেল এক্সেস",
          "২ টেরাবাইট (2TB) গুগল ওয়ান ক্লাউড স্টোরেজ",
          "Google Docs, Gmail ও Drive-এ ইন্টিগ্রেটেড AI",
          "১ মাসের নিরবচ্ছিন্ন গ্যারান্টিযুক্ত সার্ভিস",
        ]),
        duration_perk: "১ মাস আনলিমিটেড এক্সেস",
        popular: false,
        is_active: true,
        order_index: 0,
      },
      {
        plan_key: "12m",
        name: "১২ মাসের অ্যানুয়াল প্যাক",
        price: 399,
        original_price: 1499,
        discount_percent: 73,
        monthly_breakdown: "৳৩৩ / মাস",
        badge: "জনপ্রিয় পছন্দ",
        badge_color: "blue",
        description: "দীর্ঘমেয়াদে প্রফেশনাল কাজ, রিসার্চ ও কোডিংয়ের জন্য সেরা বাৎসরিক ডিল।",
        account_type_title: "পার্সোনাল জিমেইল এক্সেস",
        account_type_subtitle: "সম্পূর্ণ বাৎসরিক ভ্যালিডিটি ও সাপোর্ট",
        account_type_style: "blue",
        account_type_icon: "Zap",
        highlights: JSON.stringify([
          "Gemini Advanced 1.5 Pro & Ultra ফুল এক্সেস",
          "২০০০ জিবি (2TB) সিকিউর ক্লাউড স্টোরেজ",
          "Docs, Sheets, Slides ও Meet-এ স্মার্ট AI সুবিধা",
          "১২ মাসের ফুল রিপ্লেসমেন্ট ওয়ারেন্টি ও সাপোর্ট",
        ]),
        duration_perk: "১২ মাস নিরবচ্ছিন্ন ভ্যালিডিটি",
        popular: false,
        is_active: true,
        order_index: 1,
      },
      {
        plan_key: "18m",
        name: "১৮ মাসের মেগা অফার",
        price: 499,
        original_price: 2499,
        discount_percent: 80,
        monthly_breakdown: "৳২৭ / মাস",
        badge: "সর্বোচ্চ সাশ্রয়ী (Best Value)",
        badge_color: "purple",
        description: "দেড় বছরের জন্য আনলিমিটেড সুপারপাওয়ার। সবচেয়ে কম খরচে সেরা ভ্যালু!",
        account_type_title: "পার্সোনাল জিমেইল এক্সেস",
        account_type_subtitle: "সর্বোচ্চ প্রাইভেসি ও ১৮ মাসের ফুল সাপোর্ট",
        account_type_style: "purple",
        account_type_icon: "Sparkles",
        highlights: JSON.stringify([
          "সর্বাধুনিক Gemini Advanced 1.5 Pro মডেল এক্সেস",
          "২ টেরাবাইট (2TB) গুগল ক্লাউড স্টোরেজ",
          "হাই-স্পিড রেসপন্স ও প্রায়োরিটি সার্ভার এক্সেস",
          "১৮ মাসের ফুল রিপ্লেসমেন্ট ওয়ারেন্টি ও ২৪/৭ ভিআইপি সাপোর্ট",
        ]),
        duration_perk: "১৮ মাস মেগা ভ্যালিডিটি",
        popular: true,
        is_active: true,
        order_index: 2,
      },
    ];

    await supabase.from("plan_pricing").insert(defaultPlans);
    console.log("Default subscription plans seeded into Supabase.");
  }

  // 3. Seed FAQs if not exists
  const { count: faqCount } = await supabase
    .from("faqs")
    .select("*", { count: "exact", head: true });

  if (!faqCount || faqCount === 0) {
    const defaultFaqs = [
      {
        question: "এটি কি আমার নিজস্ব পার্সোনাল জিমেইলে এক্টিভ হবে?",
        answer:
          "হ্যাঁ, ১০০% আপনার নিজস্ব জিমেইল একাউন্টেই Google AI Pro (Gemini Advanced + 2TB Storage) সাবস্ক্রিপশন চালু করে দেওয়া হবে। আপনার কোনো পাসওয়ার্ড শেয়ার করতে হবে না।",
        category: "general",
        order_index: 0,
        is_active: true,
      },
      {
        question: "পেমেন্ট করার কতক্ষণ পর এক্সেস পাবো?",
        answer:
          "স্বয়ংক্রিয় bKash পেমেন্ট গেটওয়ে বা ম্যানুয়াল ট্রানজেকশন সাবমিট করার পর সাধারণত ৫ থেকে ১৫ মিনিটের মধ্যে আপনার গুগল অ্যাকাউন্টে মেম্বারশিপ অ্যাক্টিভ হয়ে যাবে।",
        category: "general",
        order_index: 1,
        is_active: true,
      },
      {
        question: "আমার আগের গুগল ড্রাইভের ফাইলগুলো কি নিরাপদ থাকবে?",
        answer:
          "অবশ্যই! আপনার বর্তমান ফাইল, ছবি বা ডাটাতে কোনো প্রভাব পড়বে না। শুধু আপনার বর্তমান স্টোরেজ ক্যাপাসিটি বেড়ে ২,০০০ জিবি (2TB) হয়ে যাবে এবং জেমিনাই এআই প্রো ফিচার আনলক হবে।",
        category: "general",
        order_index: 2,
        is_active: true,
      },
      {
        question: "যদি কোনো সমস্যা হয়, আমি কি রিফান্ড বা সাপোর্ট পাবো?",
        answer:
          "আমাদের প্রতিটি প্ল্যানের সাথেই সম্পূর্ণ মেয়াদের ফুল রিপ্লেসমেন্ট ওয়ারেন্টি রয়েছে। যেকোনো টেকনিক্যাল সমস্যায় আমাদের WhatsApp বা Telegram সাপোর্টে জানালে তাৎক্ষণিক সমাধান পাবেন।",
        category: "support",
        order_index: 3,
        is_active: true,
      },
    ];

    await supabase.from("faqs").insert(defaultFaqs);
    console.log("Default FAQs seeded into Supabase.");
  }
}

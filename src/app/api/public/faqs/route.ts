import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_FAQS = [
  {
    id: "faq-1",
    question: "এটি কি আমার নিজস্ব পার্সোনাল জিমেইলে এক্টিভ হবে?",
    answer:
      "হ্যাঁ, ১০০% আপনার নিজস্ব জিমেইল একাউন্টেই Google AI Pro (Gemini Advanced + 2TB Storage) সাবস্ক্রিপশন চালু করে দেওয়া হবে। আপনার কোনো পাসওয়ার্ড শেয়ার করতে হবে না।",
    category: "general",
    orderIndex: 0,
    isActive: true,
  },
  {
    id: "faq-2",
    question: "পেমেন্ট করার কতক্ষণ পর এক্সেস পাবো?",
    answer:
      "স্বয়ংক্রিয় bKash পেমেন্ট গেটওয়ে বা ম্যানুয়াল ট্রানজেকশন সাবমিট করার পর সাধারণত ৫ থেকে ১৫ মিনিটের মধ্যে আপনার গুগল অ্যাকাউন্টে মেম্বারশিপ অ্যাক্টিভ হয়ে যাবে।",
    category: "general",
    orderIndex: 1,
    isActive: true,
  },
  {
    id: "faq-3",
    question: "আমার আগের গুগল ড্রাইভের ফাইলগুলো কি নিরাপদ থাকবে?",
    answer:
      "অবশ্যই! আপনার বর্তমান ফাইল, ছবি বা ডাটাতে কোনো প্রভাব পড়বে না। শুধু আপনার বর্তমান স্টোরেজ ক্যাপাসিটি বেড়ে ২,০০০ জিবি (2TB) হয়ে যাবে এবং জেমিনাই এআই প্রো ফিচার আনলক হবে।",
    category: "general",
    orderIndex: 2,
    isActive: true,
  },
  {
    id: "faq-4",
    question: "যদি কোনো সমস্যা হয়, আমি কি রিফান্ড বা সাপোর্ট পাবো?",
    answer:
      "আমাদের প্রতিটি প্ল্যানের সাথেই সম্পূর্ণ মেয়াদের ফুল রিপ্লেসমেন্ট ওয়ারেন্টি রয়েছে। যেকোনো টেকনিক্যাল সমস্যায় আমাদের WhatsApp বা Telegram সাপোর্টে জানালে তাৎক্ষণিক সমাধান পাবেন।",
    category: "support",
    orderIndex: 3,
    isActive: true,
  },
];

export async function GET() {
  try {
    const { data: faqs, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (error || !faqs || faqs.length === 0) {
      return NextResponse.json({ success: true, faqs: FALLBACK_FAQS });
    }

    const formatted = faqs.map((f: any) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category,
      orderIndex: f.order_index,
      isActive: f.is_active,
    }));

    return NextResponse.json({ success: true, faqs: formatted });
  } catch (error: any) {
    console.error("Public FAQs API error:", error);
    return NextResponse.json({ success: true, faqs: FALLBACK_FAQS });
  }
}

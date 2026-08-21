import { prisma } from "./prisma";
import { hashPassword } from "./auth";

export async function seedDatabase() {
  console.log("Checking database initialization...");

  // 1. Seed Default Admin if not exists
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    const passwordHash = await hashPassword("Admin@GoogleAI2026!");
    await prisma.admin.create({
      data: {
        username: "admin",
        email: "admin@googleaipro.com",
        name: "Super Administrator",
        role: "super_admin",
        passwordHash,
      },
    });
    console.log("Default admin created: admin / Admin@GoogleAI2026!");
  }

  // 2. Seed Default Plans if not exists
  const planCount = await prisma.planPricing.count();
  if (planCount === 0) {
    const defaultPlans = [
      {
        planKey: "1m",
        name: "১ মাসের সাবস্ক্রিপশন",
        price: 149,
        originalPrice: 299,
        discountPercent: 50,
        monthlyBreakdown: "৳149 / মাস",
        badge: "ট্রায়াল প্যাক",
        badgeColor: "bg-gray-100 text-gray-700 border-gray-200",
        description: "স্বল্পমেয়াদী ট্রায়াল ও টেস্ট করার জন্য।",
        accountTypeTitle: "ফ্যামিলি ইনভাইটেশন (Google Family)",
        accountTypeSubtitle: "গুগল ফ্যামিলি গ্রুপ ইনভাইটের মাধ্যমে এক্সেস",
        accountTypeStyle: "bg-blue-50/80 border-blue-200/80 text-brand-blue",
        accountTypeIcon: "Users",
        highlights: JSON.stringify([
          "Gemini 3.1 Pro ও Deep Research অ্যাক্সেস",
          "5 TB ক্লাউড স্টোরেজ ও YouTube Premium",
          "১ মাসের সক্রিয় মেয়াদ ও সাপোর্ট",
        ]),
        durationPerk: "১ মাসের সক্রিয় মেয়াদ ও সাপোর্ট",
        popular: false,
        isActive: true,
        orderIndex: 0,
      },
      {
        planKey: "18m",
        name: "১৮ মাসের মেগা অফার",
        price: 499,
        originalPrice: 3299,
        discountPercent: 85,
        monthlyBreakdown: "≈ ৳28 / মাস মাত্র",
        badge: "সেরা মূল্য • ৮৫% ছাড়",
        badgeColor: "bg-[#FEF6EA] text-[#B45309] border-[#FDE68A]",
        description: "সর্বোচ্চ সাশ্রয়ী অফিসিয়াল মেগা প্ল্যান।",
        accountTypeTitle: "১০০% নিজস্ব প্রাইভেট অ্যাকাউন্ট",
        accountTypeSubtitle: "সম্পূর্ণ নিজস্ব অ্যাকাউন্ট (শুধু আপনার একক এক্সেস)",
        accountTypeStyle: "bg-purple-50/90 border-brand-purple/30 text-brand-purple",
        accountTypeIcon: "ShieldCheck",
        highlights: JSON.stringify([
          "Gemini 3.1 Pro ও Deep Research অ্যাক্সেস",
          "5 TB ক্লাউড স্টোরেজ ও YouTube Premium",
          "১৮ মাসের পূর্ণ মেগা প্যাক ও গ্যারান্টি",
        ]),
        durationPerk: "১৮ মাসের পূর্ণ মেগা প্যাক ও গ্যারান্টি",
        popular: true,
        isActive: true,
        orderIndex: 1,
      },
      {
        planKey: "12m",
        name: "১২ মাসের সাবস্ক্রিপশন",
        price: 399,
        originalPrice: 2199,
        discountPercent: 82,
        monthlyBreakdown: "≈ ৳33 / মাস",
        badge: "বার্ষিক প্ল্যান",
        badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
        description: "১ বছরের জন্য নির্ভরযোগ্য AI সমাধান।",
        accountTypeTitle: "জিমেইল ও পাসওয়ার্ড প্রয়োজন",
        accountTypeSubtitle: "অ্যাক্টিভেশনের জন্য জিমেইল ও পাসওয়ার্ড দিতে হবে",
        accountTypeStyle: "bg-amber-50/90 border-amber-300 text-amber-900",
        accountTypeIcon: "KeyRound",
        highlights: JSON.stringify([
          "Gemini 3.1 Pro ও Deep Research অ্যাক্সেস",
          "5 TB ক্লাউড স্টোরেজ ও YouTube Premium",
          "১২ মাসের সক্রিয় মেয়াদ ও সাপোর্ট",
        ]),
        durationPerk: "১২ মাসের সক্রিয় মেয়াদ ও সাপোর্ট",
        popular: false,
        isActive: true,
        orderIndex: 2,
      },
    ];

    for (const plan of defaultPlans) {
      await prisma.planPricing.create({ data: plan });
    }
    console.log("Default subscription plans seeded.");
  }

  // 3. Seed FAQs if not exists
  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    const defaultFaqs = [
      {
        question: "পেমেন্ট করার পর কীভাবে এক্সেস পাব?",
        answer:
          "bKash বা অন্যান্য পেমেন্ট সম্পন্ন করার পর আমাদের টিম ৫-১৫ মিনিটের মধ্যে আপনার নিজস্ব জিমেইলে অফিশিয়াল গুগল সাবস্ক্রিপশন ইনভাইটেশন বা ডিরেক্ট প্রিমিয়াম এক্সেস যুক্ত করে দেবে।",
        category: "activation",
        orderIndex: 0,
        isActive: true,
      },
      {
        question: "আমার বর্তমান জিমেইল কি ব্যবহার করতে পারব?",
        answer:
          "হ্যাঁ! আপনার বর্তমান যেকোনো পার্সোনাল জিমেইলেই সরাসরি Google AI Pro সাবস্ক্রিপশন সক্রিয় করা যাবে। নতুন অ্যাকাউন্ট খোলার কোনো প্রয়োজন নেই।",
        category: "account",
        orderIndex: 1,
        isActive: true,
      },
      {
        question: "18 মাসের প্রাইভেট অ্যাকাউন্ট আর 1 মাসের ফ্যামিলি প্ল্যানের পার্থক্য কী?",
        answer:
          "১ মাসের ট্রায়াল প্ল্যানে গুগল ফ্যামিলি গ্রুপের মাধ্যমে স্টোরেজ ও এআই এক্সেস দেওয়া হয়। আর ১৮ মাসের মেগা প্ল্যানে আপনি পাচ্ছেন ১০০% নিজস্ব ও একক মালিকানাধীন প্রাইভেট অ্যাকাউন্ট।",
        category: "plans",
        orderIndex: 2,
        isActive: true,
      },
      {
        question: "৫ টেরাবাইট (5 TB) স্টোরেজ কি শেয়ার করা সম্ভব?",
        answer:
          "হ্যাঁ, Google One ফ্যামিলি শেয়ারিং ফিচারের মাধ্যমে আপনি পরিবারের ৫ জন সদস্যের সাথে ড্রাইভ, ফটোস এবং জিমেইলের ক্লাউড স্টোরেজ ভাগ করে নিতে পারবেন।",
        category: "storage",
        orderIndex: 3,
        isActive: true,
      },
      {
        question: "সাবস্ক্রিপশনের মেয়াদ চলাকালীন কোনো সমস্যা হলে সাপোর্ট পাব?",
        answer:
          "আমরা সম্পূর্ণ মেয়াদের জন্য ১০০% রিপ্লেসমেন্ট এবং সক্রিয় হোয়াটসঅ্যাপ সাপোর্ট গ্যারান্টি প্রদান করি। কোনো টেকনিক্যাল জটিলতায় আমাদের ২৪/৭ সাপোর্ট টিম প্রস্তুত।",
        category: "support",
        orderIndex: 4,
        isActive: true,
      },
    ];

    for (const faq of defaultFaqs) {
      await prisma.faq.create({ data: faq });
    }
    console.log("Default FAQs seeded.");
  }

  // 4. Seed sample initial buyers and orders if empty (for realistic dashboard analytics)
  const orderCount = await prisma.order.count();
  if (orderCount === 0) {
    const sampleBuyers = [
      {
        name: "তানভীর হাসান",
        email: "tanvir.dev@gmail.com",
        phone: "01712345678",
        totalOrders: 1,
        totalSpent: 499,
        currentPlan: "Google AI Pro (১৮ মাস)",
        status: "active",
      },
      {
        name: "সাদিয়া আফরিন",
        email: "sadia.researcher@gmail.com",
        phone: "01823456789",
        totalOrders: 1,
        totalSpent: 399,
        currentPlan: "Google AI Pro (১২ মাস)",
        status: "active",
      },
      {
        name: "রাকিবুল ইসলাম",
        email: "rakib.creator@gmail.com",
        phone: "01934567890",
        totalOrders: 1,
        totalSpent: 149,
        currentPlan: "Google AI Pro (১ মাস)",
        status: "active",
      },
    ];

    for (const b of sampleBuyers) {
      const buyer = await prisma.buyer.create({ data: b });
      await prisma.order.create({
        data: {
          orderNumber: `#GAI-${Math.floor(10000 + Math.random() * 90000)}`,
          planKey: b.totalSpent === 499 ? "18m" : b.totalSpent === 399 ? "12m" : "1m",
          planName: b.currentPlan || "Google AI Pro",
          amount: b.totalSpent,
          paymentMethod: "bkash_gateway",
          paymentStatus: "paid",
          orderStatus: "active",
          trxId: `BKA${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          payerPhone: b.phone,
          targetEmail: b.email,
          customerName: b.name,
          customerPhone: b.phone || "01700000000",
          buyerId: buyer.id,
        },
      });
    }
    console.log("Sample buyers and orders seeded.");
  }
}

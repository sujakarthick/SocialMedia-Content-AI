import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const generateSchema = z.object({
  brandId: z.string().optional(),
  brandName: z.string().min(1, "Brand name is required"),
  industry: z.string().min(1, "Industry is required"),
  brandDescription: z.string().optional(),
  platform: z.enum([
    "instagram",
    "facebook",
    "whatsapp",
    "linkedin",
    "twitter",
    "youtube_shorts",
  ]),
  contentType: z.enum([
    "caption",
    "reel_hook",
    "video_script",
    "carousel",
    "content_ideas",
    "promotional_campaign",
    "product_description",
    "call_to_action",
    "hashtags",
    "festival_campaign",
    "tamil_business_ad",
    "tanglish_promo",
  ]),
  language: z.enum(["tamil", "tanglish", "english", "bilingual"]),
  topic: z.string().min(2, "Topic or product details are required"),
  offer: z.string().optional(),
  targetAudience: z.string().optional(),
  tone: z.string().optional(),
  contentLength: z.enum(["short", "medium", "long"]).optional().default("medium"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = generateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      brandName,
      industry,
      brandDescription,
      platform,
      contentType,
      language,
      topic,
      offer,
      targetAudience,
      tone,
    } = validated.data;

    // Check if Google Gemini API key or OpenAI key is present
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (geminiApiKey) {
      try {
        const systemPrompt = `You are NammaContent AI, an expert social media copywriter and cultural strategist specializing in Tamil Nadu and Indian small businesses, Instagram creators, and marketing agencies.
You generate authentic, engaging social media copy in:
- Tamil (pure, natural, conversational or literary depending on tone - not robotic machine translations)
- Tanglish (Tamil words written in English alphabet with natural Chennai/Tamil slang like "Vera level", "Tharumaaru", "Marakkama vaanga", "Super taste", "Epdi irukku")
- English (fluent, compelling, high-converting Indian marketing copy)
- Bilingual (mix of Tamil/Tanglish and English)

Always output strict valid JSON matching this schema:
{
  "headline": "Catchy title/hook",
  "body": "Primary post content formatted with line breaks and appropriate emojis",
  "cta": "Compelling call to action with phone/link placeholders",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "visual_cue": "Brief suggestion for image, reel video, or poster design",
  "slides": [{"slide_number": 1, "headline": "...", "description": "...", "visual_note": "..."}],
  "script_scenes": [{"scene_number": 1, "visual": "...", "dialogue_or_voiceover": "..."}]
}`;

        const userPrompt = `Generate a ${contentType} for:
Brand: ${brandName} (${industry})
Context: ${brandDescription || "Local business in Tamil Nadu"}
Platform: ${platform}
Language: ${language}
Topic/Product: ${topic}
Special Offer: ${offer || "None specified"}
Target Audience: ${targetAudience || "General local customers"}
Tone: ${tone || "Friendly and energetic"}

Ensure output is strictly JSON without markdown ticks outside JSON.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${systemPrompt}\n\nTask:\n${userPrompt}` }],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return NextResponse.json({
              success: true,
              is_mock: false,
              model_used: "gemini-1.5-flash",
              output: parsed,
            });
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to intelligent template engine:", err);
      }
    }

    // High quality intelligent generator for local development / testing without live API keys
    // Built specifically with authentic Tamil & Tanglish idioms and business contexts
    const generated = createSmartLocalGeneration({
      brandName,
      industry,
      platform,
      contentType,
      language,
      topic,
      offer,
      tone,
    });

    return NextResponse.json({
      success: true,
      is_mock: true,
      model_used: "nammacontent-intelligent-engine-v1",
      setup_notice: !geminiApiKey
        ? "Running in Development Mock Mode. Configure GEMINI_API_KEY in .env.local for live LLM inference."
        : "Live API fallback used.",
      output: generated,
    });
  } catch (error: any) {
    console.error("API Error in /api/generate:", error);
    return NextResponse.json(
      { error: "Content generation failed", message: error.message },
      { status: 500 }
    );
  }
}

function createSmartLocalGeneration(params: {
  brandName: string;
  industry: string;
  platform: SocialPlatform;
  contentType: string;
  language: string;
  topic: string;
  offer?: string;
  tone?: string;
}) {
  const { brandName, industry, language, topic, offer } = params;

  // Tanglish generator
  if (language === "tanglish") {
    return {
      headline: `${topic} - Vera Level Taste & Quality! 🔥✨`,
      body: `Makkale! Weekend aachuna special treat kooda dhaan celebrate pannanum. ${brandName}-la inaikku fresh-ah ready aayirukaanga!\n\n${topic} oda authentic flavours, traditional recipe, and unbeatable quality vera engayum kedaikaadhu.\n\n${
        offer ? `🎁 Special Offer: ${offer}! Indha offer miss pannidadheenga!` : "🔥 Unbeatable quality at the best price in town!"
      }\n\nFriends and family kooda share pannunga, enjoy pannunga!`,
      cta: `Call or WhatsApp us now to order: +91 98401 23456 or DM us directly! 📲`,
      hashtags: [
        `#${brandName.replace(/\s+/g, "")}`,
        "#NammaChennai",
        "#TamilNaduBusiness",
        "#VeraLevel",
        "#TanglishContent",
        `#${industry}Lovers`,
      ],
      visual_cue: `High contrast close-up shot of ${topic} with bold Tanglish text overlay: '${topic} - Semmayaana Combo!'`,
      slides: [
        {
          slide_number: 1,
          headline: `Enna makkale, ${topic} pathi theriyuma?`,
          description: "Namma ooru special item-oda secret ingredients and taste!",
          visual_note: "Eye-catching intro graphic with brand logo",
        },
        {
          slide_number: 2,
          headline: "Authentic Preparation & Quality",
          description: "No artificial chemicals, 100% genuine ingredients.",
          visual_note: "Behind the scenes preparation footage",
        },
        {
          slide_number: 3,
          headline: offer ? `Exclusive Deal: ${offer}` : "Best Value In Town",
          description: "Indha offer limited time mattum dhaan valid!",
          visual_note: "Big bold discount badge graphic",
        },
      ],
      script_scenes: [
        {
          scene_number: 1,
          visual: "Close-up slow motion shot of the product",
          dialogue_or_voiceover: "Boss! Weekend vandhaachu, aana innum idhai try pannalaya?",
        },
        {
          scene_number: 2,
          visual: "Showing fresh preparation and happy customer reactions",
          dialogue_or_voiceover: `${brandName}-oda special ${topic}! Oru vaati taste panna marakka maateenga!`,
        },
        {
          scene_number: 3,
          visual: "Screen displays phone number, WhatsApp icon and location",
          dialogue_or_voiceover: `${offer ? `Koodave ${offer}! ` : ""}Ippove bio link click panni book pannunga!`,
        },
      ],
    };
  }

  // Tamil generator (pure/natural Tamil)
  if (language === "tamil") {
    return {
      headline: `சுவை மற்றும் தரத்தின் சங்கமம் - ${brandName}! 🌾✨`,
      body: `வணக்கம் நல் உள்ளங்களே! உங்கள் அபிமான ${brandName} பெருமையுடன் வழங்கும் ${topic}!\n\nபாரம்பரிய செய்முறை, தூய்மையான மூலப்பொருட்கள் மற்றும் உங்கள் குடும்பத்துக்கான ஆரோக்கியமான தேர்வு.\n\n${
        offer ? `🎉 சிறப்பு சலுகை: ${offer}! இந்த வாய்ப்பை தவறவிடாதீர்கள்!` : "மகிழ்ச்சியான தருணங்களை இன்னும் அழகாக்க இன்றே வருகை தாருங்கள்."
      }\n\nநம்பிக்கையான தரம், மனநிறைவான சேவை!`,
      cta: `இன்றே முன்பதிவு செய்ய பயோவில் உள்ள லிங்கை அழுத்தவும் அல்லது அழைக்கவும்: +91 98401 23456 📞`,
      hashtags: [
        `#${brandName.replace(/\s+/g, "")}`,
        "#தமிழ்நாடு",
        "#பாரம்பரியம்",
        "#சிறப்புசலுகை",
        "#வணிகம்",
        "#நம்மஊர்",
      ],
      visual_cue: `பாரம்பரிய மஞ்சள் மற்றும் பொன் வண்ண பின்னணியில் ${topic} அழகிய புகைப்படம்`,
      slides: [
        {
          slide_number: 1,
          headline: `பாரம்பரிய சுவையில் ${topic}`,
          description: "உங்கள் இல்லத்து விசேஷங்களை சிறப்பாக்கும் தனித்துவமான தரம்.",
          visual_note: "பாரம்பரிய கோலத்துடன் கூடிய அட்டைப் படம்",
        },
        {
          slide_number: 2,
          headline: "நேர்த்தியான தயாரிப்பு முறை",
          description: "அனுபவம் வாய்ந்த கைவண்ணத்தில் உருவான சிறப்பு தயாரிப்பு.",
          visual_note: "தயாரிப்பு செயல்முறையின் தெளிவான காட்சி",
        },
        {
          slide_number: 3,
          headline: offer ? `சிறப்பு சலுகை: ${offer}` : "இன்றே வருகை தாருங்கள்!",
          description: "முன்பதிவு செய்ய உடனே தொடர்பு கொள்ளுங்கள்.",
          visual_note: "வாடிக்கையாளர் ஆதரவு மற்றும் முகவரி அட்டை",
        },
      ],
      script_scenes: [
        {
          scene_number: 1,
          visual: "அழகிய முகப்பு மற்றும் தயாரிப்பு காட்சி",
          dialogue_or_voiceover: "உங்கள் மனதை கவரும் சிறந்த தரம் தேடுகிறீர்களா?",
        },
        {
          scene_number: 2,
          visual: "தயாரிப்பின் முழுமையான சிறப்பம்சங்கள்",
          dialogue_or_voiceover: `${brandName} வழங்கும் ${topic} உங்கள் சரியான தேர்வு!`,
        },
        {
          scene_number: 3,
          visual: "தொடர்பு எண் மற்றும் சமூக வலைத்தள முகவரி",
          dialogue_or_voiceover: "இன்றே வாருங்கள், மனநிறைவான சேவையை அனுபவியுங்கள்!",
        },
      ],
    };
  }

  // English & Bilingual generator
  return {
    headline: `Experience Premium Quality with ${brandName} 🌟`,
    body: `Looking for top-tier ${topic}? ${brandName} brings you the finest selection crafted with passion and precision.\n\nWhether you are shopping for your family or celebrating a special occasion, we ensure nothing short of excellence.\n\n${
      offer ? `🔥 Limited Period Offer: ${offer}! Grab it before it ends!` : "Visit us today to discover our exclusive range."
    }\n\nDrop by or order directly via WhatsApp!`,
    cta: `Tap the link in bio or call us directly at +91 98401 23456 to get started! 🚀`,
    hashtags: [
      `#${brandName.replace(/\s+/g, "")}`,
      "#SouthIndiaBusiness",
      "#LocalBusinessIndia",
      `#${industry}Gram`,
      "#TrendingNow",
      "#PremiumExperience",
    ],
    visual_cue: `Modern minimalist graphic featuring ${topic} with clean typography and high-key studio lighting`,
    slides: [
      {
        slide_number: 1,
        headline: `Why ${brandName} Stands Out`,
        description: `Everything you need to know about our top-rated ${topic}.`,
        visual_note: "Modern gradient cover slide",
      },
      {
        slide_number: 2,
        headline: "Unmatched Craftsmanship",
        description: "100% verified quality that thousands of customers trust.",
        visual_note: "Side-by-side comparison diagram",
      },
      {
        slide_number: 3,
        headline: offer ? `Special Deal: ${offer}` : "Claim Your Order",
        description: "DM us or click the link in bio to order today.",
        visual_note: "Call-to-action button and contact info",
      },
    ],
    script_scenes: [
      {
        scene_number: 1,
        visual: "Fast-paced camera panning across the product",
        dialogue_or_voiceover: `Stop scrolling! If you've been looking for the best ${topic}, this is for you.`,
      },
      {
        scene_number: 2,
        visual: "Demonstrating features and texture",
        dialogue_or_voiceover: `At ${brandName}, we bring you pure authentic value that makes every rupee count.`,
      },
      {
        scene_number: 3,
        visual: "Store location map or website URL",
        dialogue_or_voiceover: `${offer ? `Don't miss our offer: ${offer}! ` : ""}Order now through the link in bio!`,
      },
    ],
  };
}

type SocialPlatform =
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "linkedin"
  | "twitter"
  | "youtube_shorts";

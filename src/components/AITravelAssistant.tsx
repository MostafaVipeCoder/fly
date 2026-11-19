import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Plane, HelpCircle, Compass, Luggage, MapPin } from 'lucide-react';
import { Language } from '../types';

interface AITravelAssistantProps {
  onQuickBook: (origin: string, dest: string) => void;
  language: Language;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  quickAction?: {
    label: string;
    origin: string;
    dest: string;
  };
}

export const AITravelAssistant: React.FC<AITravelAssistantProps> = ({
  onQuickBook,
  language,
}) => {
  const isAr = language === 'ar';

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: isAr
        ? 'أهلاً بك يا فندم في المساعد الذكي لطيران مصر! 🇪🇬 أنا هنا لمساعدتك في العثور على أفضل مواعيد وأسعار الرحلات، وشرح تفاصيل صالات مطار القاهرة، وسياسات الأمتعة على مصر للطيران وإير كايرو، وتخطيط عطلتك السياحية. كيف يمكنني خدمتك اليوم؟'
        : 'Welcome to Egypt Wings AI Flight Consultant! 🇪🇬 How can I help you with flights, baggage rules, or Cairo Airport terminal guides today?',
    },
  ]);

  const quickQuestions = isAr ? [
    {
      text: 'ما هي أرخص رحلات لشرم الشيخ والغردقة؟',
      reply: 'أفضل أسعار الطيران لشرم الشيخ والغردقة تبدأ من 1,650 ج.م على رحلات "إير كايرو" و"مصر للطيران" الصباحية أيام منتصف الأسبوع (الثلاثاء والأربعاء). تشمل الرحلة حقيبة يد 7 كجم مع إمكانية إضافة حقيبة 23 كجم.',
      action: { label: 'بحث رحلات شرم الشيخ (1,650 ج.م)', origin: 'CAI', dest: 'SSH' },
    },
    {
      text: 'ما هو الحد المسموح للأمتعة على مصر للطيران؟',
      reply: 'على الدرجة السياحية لرحلات مصر للطيران الداخلية والدولية:\n• حقيبة مسجلة وزنها حتى 23 كجم (أبعاد لا تتجاوز 158 سم).\n• حقيبة يد للكابينة حتى 7 كجم + حقيبة لابتوب شخصية.\n• درجة رجال الأعمال تشمل حقيبتين وزن كل منهما 32 كجم (إجمالي 64 كجم) + حقيبتين يد.',
    },
    {
      text: 'كيف أعرف مبنى السفر (Terminal) في مطار القاهرة؟',
      reply: 'توزيع شركات الطيران بمطار القاهرة الدولي:\n• مبنى 3 (Terminal 3): مخصص بالكامل لرحلات مصر للطيران (تحالف ستار Star Alliance).\n• مبنى 2 (Terminal 2): مخصص لشركات الطيران الدولية الكبرى (طيران الإمارات، الخطوط السعودية، الخطوط الفرنسية).\n• مبنى 1 (المطار القديم Terminal 1): مخصص لشركات النيل للطيران، إير كايرو، وفلاي إيجيبت وباقي الشركات الخاصة.',
    },
    {
      text: 'ما هي أفضل مواعيد لزيارة الأقصر وأسوان؟',
      reply: 'الفترة المثالية لزيارة الأقصر وأسوان ومعابد الفراعنة وجولات النيل هي من شهر أكتوبر حتى نهاية أبريل حيث يكون الطقس دافئاً ومثالياً. نوفر رحلات يومية منتظمة من مطار القاهرة إلى مطار الأقصر (LXR) وأسوان (ASW) ابتداءً من 2,150 ج.م.',
      action: { label: 'بحث رحلات الأقصر (2,150 ج.م)', origin: 'CAI', dest: 'LXR' },
    },
  ] : [
    {
      text: 'What are the cheapest flights to Sharm & Hurghada?',
      reply: 'Domestic flights from Cairo to Sharm El Sheikh and Hurghada start from 1,650 EGP on Air Cairo & EgyptAir during midweek flights.',
      action: { label: 'Search Sharm Flights', origin: 'CAI', dest: 'SSH' },
    },
    {
      text: 'What is EgyptAir baggage allowance?',
      reply: 'Economy class includes 1 piece up to 23kg checked bag + 7kg hand luggage. Business class includes 2 pieces of 32kg each (total 64kg).',
    },
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const newMsgId = String(Date.now());
    const userMessage: ChatMessage = {
      id: newMsgId,
      sender: 'user',
      text: userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');

    // Generate intelligent AI response
    setTimeout(() => {
      let aiReplyText = isAr
        ? `شكراً لاستفسارك! بخصوص "${userText}"، يمكنك حجز تذاكر الطيران بأفضل الأسعار عبر منصتنا مع إمكانية الدفع بفوري أو انستاباي واختيار المقاعد فوراً.`
        : `Thank you for your query about "${userText}". We offer instant bookings with full baggage details and online check-in.`;

      let action: { label: string; origin: string; dest: string } | undefined;

      const lower = userText.toLowerCase();
      if (userText.includes('شرم') || lower.includes('sharm')) {
        aiReplyText = isAr
          ? 'رحلات شرم الشيخ متوفرة يومياً من مطار القاهرة (CAI) ومطار برج العرب (HBE) مع أكثر من 6 رحلات يومية على مصر للطيران وإير كايرو.'
          : 'Sharm flights operate daily from Cairo (CAI) with direct 1-hour flight time.';
        action = { label: isAr ? 'احجز رحلة شرم الشيخ الآن' : 'Book Sharm Flight', origin: 'CAI', dest: 'SSH' };
      } else if (userText.includes('غردقة') || lower.includes('hurghada')) {
        aiReplyText = isAr
          ? 'رحلات الغردقة تستغرق حوالي ساعة واحدة مباشرة، مع أسعار تبدأ من 1,720 ج.م تشمل الوجبة والأمتعة.'
          : 'Hurghada flights take approx 1 hour from Cairo with direct flights starting at 1,720 EGP.';
        action = { label: isAr ? 'احجز رحلة الغردقة' : 'Book Hurghada', origin: 'CAI', dest: 'HRG' };
      } else if (userText.includes('عمرة') || userText.includes('جدة') || lower.includes('jeddah')) {
        aiReplyText = isAr
          ? 'رحلات العمرة لجدة والمدينة المنورة متوفرة على مصر للطيران والخطوط السعودية مع وزن أمتعة خاص يشمل مياه زمزم مجاناً.'
          : 'Umrah flights to Jeddah and Medina operate with dedicated baggage allowance including Zamzam water.';
        action = { label: isAr ? 'احجز رحلة جدة (العمرة)' : 'Book Jeddah Umrah', origin: 'CAI', dest: 'JED' };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: aiReplyText,
          quickAction: action,
        },
      ]);
    }, 600);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1 rounded-full text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" />
          <span>{isAr ? 'مستشارك السياحي الذكي لرحلات مصر' : 'AI Flight & Travel Consultant'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
          {isAr ? 'المساعد الذكي لتخطيط الرحلات وحجز الطيران' : 'AI Smart Travel Assistant'}
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
          {isAr
            ? 'اسأل عن مواعيد الرحلات، شروط السفر، أوزان الأمتعة، ومباني صالات مطار القاهرة الدولي.'
            : 'Ask any question about Egyptian flights, baggage allowances, terminals, or best travel dates.'}
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[520px]">
        
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';

            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-sm shadow-sm ${
                    isAi ? 'bg-slate-900 text-amber-400' : 'bg-amber-500 text-slate-950 font-bold'
                  }`}
                >
                  {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                <div className={`space-y-2 max-w-[80%] ${isAi ? 'text-right' : 'text-right'}`}>
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                      isAi
                        ? 'bg-white text-slate-800 border border-slate-200'
                        : 'bg-slate-900 text-white font-medium'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.quickAction && (
                    <button
                      type="button"
                      onClick={() => onQuickBook(m.quickAction!.origin, m.quickAction!.dest)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all"
                    >
                      <Plane className="w-3.5 h-3.5 transform -rotate-45" />
                      <span>{m.quickAction.label}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  { id: String(Date.now()), sender: 'user', text: q.text },
                  { id: String(Date.now() + 1), sender: 'ai', text: q.reply, quickAction: q.action },
                ]);
              }}
              className="bg-slate-100 hover:bg-amber-50 hover:text-amber-900 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors"
            >
              {q.text}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputQuery);
          }}
          className="p-4 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            id="ai-assistant-input"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={isAr ? 'اكتب سؤالك هنا عن رحلات مصر، الأمتعة، أو المطار...' : 'Ask anything about Egyptian flights...'}
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 outline-none"
          />
          <button
            type="submit"
            id="ai-assistant-send-btn"
            className="bg-slate-900 hover:bg-amber-500 text-amber-400 hover:text-slate-950 p-3.5 rounded-2xl transition-colors shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

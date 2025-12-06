import { useState } from 'react';
import { X, Send, MessageCircle, Sparkles } from 'lucide-react';
import { QueryData } from '../pages/ImportExportDashboard';

interface AskModalProps {
  onClose: () => void;
  onQueryGenerate: (query: QueryData) => void;
  currentQuery: QueryData;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  suggestedQuery?: QueryData;
}

export function AskModal({ onClose, onQueryGenerate, currentQuery }: AskModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text:
        'مرحباً! يمكنني مساعدتك في بناء استعلامات تحليل بيانات الاستيراد والتصدير. اطرح سؤالك بأي طريقة تريدها، على سبيل المثال:\n\n' +
        '• كم عدد وحدات مسحوق الغسيل المستوردة في الربع الأول؟\n' +
        '• ما هي أكثر المنافذ استخداماً لاستيراد منظفات الأطباق؟\n' +
        '• أريد معرفة الوزن الإجمالي للمنسوجات المستوردة عبر المنافذ البحرية',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const suggestedQuestions = [
    'ما هو عدد الوحدات المستوردة من منظفات الأطباق خلال العام الحالي؟',
    'أريد معرفة الوزن الإجمالي للمواد الغذائية المستوردة عبر ميناء جدة',
    'كم عدد وحدات الإلكترونيات المستوردة في النصف الأول من 2025؟',
    'ما هي أكثر المنافذ الجوية استخداماً لاستيراد المنسوجات؟'
  ];

  /**
   * 🧠 تحويل السؤال (لغة طبيعية) إلى QueryData
   * بما يتوافق مع:
   *  - القطاعات من /section بشكل "الكود - الوصف"
   *  - المقاييس: عدد الوحدات / الوزن الإجمالي / عدد الشحنات
   *  - المنافذ: "جميع المنافذ" أو ALL_TYPE_x أو كود منفذ مثل "10"
   */
  const parseQuestion = (question: string): QueryData => {
    const lower = question.toLowerCase();

    let sector = currentQuery.sector;
    let metric = currentQuery.metric;
    let location = currentQuery.location;
    let productCategory = currentQuery.productCategory;
    let port = currentQuery.port;
    let period = currentQuery.period;

    // 🔹 استيراد / تصدير
    if (lower.includes('تصدير')) {
      location = 'تصدير';
    } else if (lower.includes('استيراد')) {
      location = 'استيراد';
    }

    // 🔹 القطاع (أسماء تقريبية بناءً على مثال /section)
    if (lower.includes('تنظيف') || lower.includes('منظف')) {
      // مواد تنظيف -> كيماويات
      sector = '06 - منتجات الصناعات الكيماوية أو الصناعات المرتبطة بها';
    } else if (lower.includes('غذائ') || lower.includes('طعام') || lower.includes('أغذية')) {
      sector =
        '04 - منتجات صناعة الأغذية ؛ مشروبات ؛ سوائل ؛ سوائل كحولية وخل ؛ تبغ وأبدال تبغ مصنعة';
    } else if (lower.includes('إلكترون') || lower.includes('الكترون')) {
      sector =
        '16 - آلات وأجهزة آلية؛ معدات كهربائية؛ أجزاؤها؛ أجهزة تسجيل وإذاعة الصوت وأجهزة تسجيل وإذاعة الصوت والصورة في الإذاعة المرئية (التلفزيون)، أجزاء ولوازم هذه الأجهزة';
    } else if (lower.includes('منسوج') || lower.includes('نسيج')) {
      sector = '11 - مـواد نسجيـة ومـصنوعـات مـن هـذه المـواد';
    }

    // 🔹 المقياس – مهم: لازم يكون واحد من:
    // "عدد الوحدات" | "الوزن الإجمالي" | "عدد الشحنات"
    if (lower.includes('وزن') || lower.includes('كيلو') || lower.includes('طن')) {
      metric = 'الوزن الإجمالي';
    } else if (lower.includes('شحنات') || lower.includes('الشحنات')) {
      metric = 'عدد الشحنات';
    } else if (lower.includes('عدد') || lower.includes('وحدات')) {
      metric = 'عدد الوحدات';
    }

    // 🔹 فئة المنتج (وصف فقط – الكود يأتي من TariffTreeSelect)
    if (lower.includes('مسحوق')) {
      productCategory = 'مسحوق الغسيل';
    } else if (lower.includes('أطباق')) {
      productCategory = 'منظفات الأطباق';
    } else if (lower.includes('أرض')) {
      productCategory = 'منظفات الأرضيات';
    } else if (lower.includes('معطر')) {
      productCategory = 'معطرات الجو';
    } else if (lower.includes('مناديل')) {
      productCategory = 'مناديل التنظيف';
    }

    // 🔹 المنفذ (قيم متوافقة مع QueryBuilder الجديد)
    //  - "جميع المنافذ"
    //  - "ALL_TYPE_1" = منافذ بحرية
    //  - "ALL_TYPE_3" = منافذ برية
    //  - "ALL_TYPE_4" = منافذ جوية
    //  - أو كود منفذ محدد مثل "10" (ميناء جدة الإسلامي)
    if (lower.includes('جميع المنافذ')) {
      port = 'جميع المنافذ';
    } else if (lower.includes('بحري') || lower.includes('بحرية')) {
      port = 'ALL_TYPE_1';
    } else if (lower.includes('بري') || lower.includes('برية')) {
      port = 'ALL_TYPE_3';
    } else if (lower.includes('جوي') || lower.includes('جوية')) {
      port = 'ALL_TYPE_4';
    } else if (lower.includes('جدة')) {
      // ميناء جدة الإسلامي – portCode = "10"
      port = '10';
    } else if (lower.includes('الدمام')) {
      // ميناء الملك عبدالعزيز بالدمام – portCode = "30"
      port = '30';
    } else if (lower.includes('الجبيل')) {
      // نختار مثلاً "42" (جمرك محافظة الجبيل)
      port = '42';
    }

    // 🔹 الفترة الزمنية
    if (lower.includes('الربع الأول') || lower.includes('الربع الاول')) {
      period = { from: '2025-01-01', to: '2025-03-31' };
    } else if (lower.includes('النصف الأول') || lower.includes('النصف الاول')) {
      period = { from: '2025-01-01', to: '2025-06-30' };
    } else if (lower.includes('العام الحالي') || lower.includes('2025')) {
      period = { from: '2025-01-01', to: '2025-12-31' };
    }

    return {
      sector,
      metric,
      location,
      productCategory,
      port,
      period
    };
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    setTimeout(() => {
      const suggestedQuery = parseQuestion(inputText);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          'فهمت! لقد قمت بإنشاء استعلام بناءً على سؤالك. يمكنك مراجعة الاستعلام أدناه والضغط على "تطبيق الاستعلام" لعرض النتائج.',
        sender: 'assistant',
        timestamp: new Date(),
        suggestedQuery
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
  };

  const handleApplyQuery = (query: QueryData) => {
    onQueryGenerate(query);
    onClose();
  };

  const formatQueryPreview = (query: QueryData) => {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mt-3 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-blue-900">الاستعلام المقترح:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-white/60 px-3 py-2 rounded">
            <span className="text-slate-600">القطاع:</span>
            <span className="mr-2 text-slate-900">{query.sector}</span>
          </div>
          <div className="bg-white/60 px-3 py-2 rounded">
            <span className="text-slate-600">المقياس:</span>
            <span className="mr-2 text-slate-900">{query.metric}</span>
          </div>
          <div className="bg-white/60 px-3 py-2 rounded">
            <span className="text-slate-600">فئة المنتج:</span>
            <span className="mr-2 text-slate-900">{query.productCategory}</span>
          </div>
          <div className="bg-white/60 px-3 py-2 rounded">
            <span className="text-slate-600">المنفذ:</span>
            <span className="mr-2 text-slate-900">{query.port}</span>
          </div>
          <div className="bg-white/60 px-3 py-2 rounded col-span-2">
            <span className="text-slate-600">الفترة:</span>
            <span className="mr-2 text-slate-900">
              {query.period.from} إلى {query.period.to}
            </span>
          </div>
        </div>
        <button
          onClick={() => handleApplyQuery(query)}
          className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          تطبيق الاستعلام
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-slate-900">اسأل المساعد الذكي</h2>
              <p className="text-slate-600 text-sm">استخدم اللغة الطبيعية لبناء استعلاماتك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
                {message.suggestedQuery && formatQueryPreview(message.suggestedQuery)}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-slate-600 text-sm mb-3">أسئلة مقترحة:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-right text-sm px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-slate-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-slate-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isProcessing}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

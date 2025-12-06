import { Lightbulb, ChevronLeft } from 'lucide-react';
import { QueryData } from '../pages/ImportExportDashboard';

type SuggestedAction = 'monthly' | 'tariff' | 'weight' | 'ports' | 'companies';

interface SuggestedQueriesProps {
  onAction: (action: SuggestedAction) => void;
  currentQuery: QueryData;
}

export function SuggestedQueries({ onAction, currentQuery }: SuggestedQueriesProps) {
  // 👇 دعم أن تكون port إما string أو string[]
  const isSpecificPortSelected = (() => {
    const portValue = (currentQuery as any).port;

    if (Array.isArray(portValue)) {
      // لو فيه منافذ محددة ومش包含 "جميع المنافذ"
      return portValue.length > 0 && !portValue.includes('جميع المنافذ');
    }

    if (typeof portValue === 'string') {
      return portValue !== '' && portValue !== 'جميع المنافذ';
    }

    return false;
  })();

  // 👇 قراءة الاتجاه سواء كان direction (IMP/EXP) أو location بالعربي
  const getDirectionLabel = () => {
    const directionValue =
      (currentQuery as any).direction ?? (currentQuery as any).location;

    if (directionValue === 'IMP' || directionValue === 'استيراد') {
      return 'الاستيراد';
    }
    if (directionValue === 'EXP' || directionValue === 'تصدير') {
      return 'التصدير';
    }
    return 'الاستيراد/التصدير';
  };

  // 👇 إرجاع النص العربي المناسب للمقياس بناءً على الكود
  const getMetricLabel = () => {
    switch (currentQuery.metric) {
      case 'QUANTITY':
        return 'عدد الوحدات';
      case 'WEIGHT':
        return 'الوزن الإجمالي';
      case 'SHIPMENTS_COUNT':
        return 'عدد الشحنات';
      default:
        // لو لسه المقياس مخزن كنص عربي أو قيمة غير متوقعة
        if (
          currentQuery.metric === 'عدد الوحدات' ||
          currentQuery.metric === 'الوزن الإجمالي' ||
          currentQuery.metric === 'عدد الشحنات'
        ) {
          return currentQuery.metric;
        }
        return 'عدد الوحدات';
    }
  };

  // 👇 النص الديناميكي لسؤال "تبديل" المقياس
  const getMetricSwapText = () => {
    switch (currentQuery.metric) {
      case 'QUANTITY':
      case 'عدد الوحدات':
        return 'الكيلو جرامات عوضاً عن عدد الوحدات';
      case 'WEIGHT':
      case 'الوزن الإجمالي':
        return 'عدد الوحدات عوضاً عن الوزن';
      case 'SHIPMENTS_COUNT':
      case 'عدد الشحنات':
        return 'عدد الوحدات عوضاً عن عدد الشحنات';
      default:
        return 'مقياس آخر للمقارنة';
    }
  };

  const metricLabel = getMetricLabel();
  const directionLabel = getDirectionLabel();
  const metricSwapText = getMetricSwapText();

  const suggestedQueries: Array<{
    title: string;
    description: string;
    action: SuggestedAction;
    hideCondition?: boolean;
  }> = [
    {
      title: `هل تحب أن أزودك برسم بياني يرصد التغير في ${metricLabel} كل شهر؟`,
      description: 'عرض تفصيلي للتغيرات الشهرية مع مؤشرات النمو',
      action: 'monthly',
    },
    {
      title: 'هل تريد تصنيف النتائج بناءً على التعرفة الجمركية؟',
      description: 'تحليل مفصل حسب رموز التعرفة الجمركية الدولية',
      action: 'tariff',
    },
    {
      title: `هل تريد البحث بدلالة ${metricSwapText} ثم مقارنتها مع السنة الماضية؟`,
      description: 'مقارنة المقاييس المختلفة مع السنة الماضية',
      action: 'weight',
    },
    {
      title: 'هل تريد معرفة أي من المنافذ كان الأكثر استخداماً؟',
      description: `ترتيب المنافذ الجمركية حسب حجم ${directionLabel}`,
      action: 'ports',
      hideCondition: isSpecificPortSelected,
    },
    {
      title: `هل ترغب بالحصول على قائمة بشركات التخليص الجمركي على هذا المنفذ مرتبة بحسب حجم ${directionLabel}؟`,
      description: `شركات التخليص مع بيانات الاتصال مرتبة حسب حجم ${directionLabel}`,
      action: 'companies',
    },
  ];

  const visibleQueries = suggestedQueries.filter((q) => !q.hideCondition);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">استعلامات مقترحة</h2>
          <p className="text-sm text-slate-600">
            اختر أحد الاستعلامات للحصول على رؤى تحليلية أعمق
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visibleQueries.map((item, index) => (
          <button
            key={index}
            onClick={() => onAction(item.action)}
            className="text-right p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-slate-900 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mr-2" />
            </div>
            <p className="text-slate-600">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

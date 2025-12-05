import { Lightbulb, ChevronLeft } from 'lucide-react';
import { QueryData } from '../pages/ImportExportDashboard';

interface SuggestedQueriesProps {
  onAction: (action: 'monthly' | 'tariff' | 'weight' | 'ports' | 'companies') => void;
  currentQuery: QueryData;
}

export function SuggestedQueries({ onAction, currentQuery }: SuggestedQueriesProps) {
  const isSpecificPortSelected = currentQuery.port !== 'جميع المنافذ' &&
    !currentQuery.port.includes('جميع المنافذ');

  // Get metric label based on current query
  const getMetricLabel = () => {
    switch (currentQuery.metric) {
      case 'عدد الوحدات':
        return 'عدد الوحدات';
      case 'الوزن الإجمالي':
        return 'الوزن';
      case 'عدد الشحنات':
        return 'عدد الشحنات';
      default:
        return 'عدد الوحدات';
    }
  };

  // Get direction label
  const getDirectionLabel = () => {
    return currentQuery.location === 'استيراد' ? 'الاستيراد' : 'التصدير';
  };

  const suggestedQueries: Array<{
    title: string;
    description: string;
    action: 'monthly' | 'tariff' | 'weight' | 'ports' | 'companies';
    hideCondition?: boolean;
  }> = [
      {
        title: `هل تحب أن أزودك برسم بياني يرصد التغير في ${getMetricLabel()} كل شهر؟`,
        description: 'عرض تفصيلي للتغيرات الشهرية مع مؤشرات النمو',
        action: 'monthly'
      },
      {
        title: 'هل تريد تصنيف النتائج بناءً على التعرفة الجمركية؟',
        description: 'تحليل مفصل حسب رموز التعرفة الجمركية الدولية',
        action: 'tariff'
      },
      {
        title: `هل تريد البحث بدلالة ${currentQuery.metric === 'عدد الوحدات' ? 'الكيلو جرامات عوضاً عن عدد الوحدات' : currentQuery.metric === 'الوزن الإجمالي' ? 'عدد الوحدات عوضاً عن الوزن' : 'عدد الوحدات عوضاً عن عدد الشحنات'} ثم مقارنتها مع السنة الماضية؟`,
        description: 'مقارنة المقاييس المختلفة مع السنة الماضية',
        action: 'weight'
      },
      {
        title: 'هل تريد معرفة أي من المنافذ كان الأكثر استخداماً؟',
        description: `ترتيب المنافذ الجمركية حسب حجم ${getDirectionLabel()}`,
        action: 'ports',
        hideCondition: isSpecificPortSelected
      },
      {
        title: `هل ترغب بالحصول على قائمة بشركات التخليص الجمركي على هذا المنفذ مرتبة بحسب حجم ${getDirectionLabel()}؟`,
        description: `شركات التخليص مع بيانات الاتصال مرتبة حسب حجم ${getDirectionLabel()}`,
        action: 'companies'
      }
    ];

  const visibleQueries = suggestedQueries.filter(q => !q.hideCondition);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">استعلامات مقترحة</h2>
          <p className="text-sm text-slate-600">اختر أحد الاستعلامات للحصول على رؤى تحليلية أعمق</p>
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
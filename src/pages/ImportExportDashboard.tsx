import { useState } from 'react';
import { QueryBuilder } from '../components/QueryBuilder';
import { ChartDisplay } from '../components/ChartDisplay';
import { SuggestedQueries } from '../components/SuggestedQueries';
import { DrilldownModal } from '../components/DrilldownModal';
import { TariffModal } from '../components/TariffModal';
import { PortDistributionModal } from '../components/PortDistributionModal';
import { ClearanceCompaniesModal } from '../components/ClearanceCompaniesModal';
import { AskModal } from '../components/AskModal';
import Header from './Header';

export interface QueryData {
  sector: string;
  metric: string;
  location: string;
  productCategory: string;
  period: {
    from: string;
    to: string;
  };
  port: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface CompanyData {
  name: string;
  value: number;
  percentage: number;
  color: string;
  phone?: string;
  email?: string;
}

type ModalType = 'drilldown' | 'tariff' | 'ports' | 'companies' | 'ask' | null;

// 🧩 دالة مساعدة لتحويل QueryData إلى query string
const buildQueryString = (query: QueryData) => {
  const params = new URLSearchParams();

  params.set('sector', query.sector);
  params.set('metric', query.metric);
  params.set('location', query.location);
  params.set('productCategory', query.productCategory);
  params.set('periodFrom', query.period.from);
  params.set('periodTo', query.period.to);
  params.set('port', query.port);

  return params.toString();
};

export default function ImportExportDashboard() {
  const [currentQuery, setCurrentQuery] = useState<QueryData>({
    sector: 'جميع القطاعات',
    metric: 'عدد الوحدات',
    location: 'استيراد',
    productCategory: 'اختر التعرفة',
    period: {
      from: '2024-12-01',
      to: '2025-12-01',
    },
    port: 'جميع المنافذ',
  });

  // Store data per query configuration to maintain consistency
  const [dataCache] = useState<Map<string, ChartDataPoint[]>>(new Map());
  const [userModifiedDates, setUserModifiedDates] = useState(false);

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showMonthClickHint, setShowMonthClickHint] = useState(false);

  // ✅ جديد: لمعرفة هل فيه بحث أم لا
  const [hasSearched, setHasSearched] = useState(false);

  const getCacheKey = (query: QueryData) => {
    return JSON.stringify({
      sector: query.sector,
      metric: query.metric,
      location: query.location,
      productCategory: query.productCategory,
      period: query.period,
      port: query.port,
    });
  };

  // 🔄 استدعاء API حسب الـ query + query params
  const handleQuerySubmit = async (query: QueryData) => {
    setCurrentQuery(query);
    setShowMonthClickHint(false);
    setHasSearched(true); // 👈 من الآن فصاعدًا نعرض النتائج

    const cacheKey = getCacheKey(query);

    // لو البيانات موجودة في الكاش لنفس الـ query استخدمها
    if (dataCache.has(cacheKey)) {
      setChartData(dataCache.get(cacheKey)!);
      return;
    }

    try {
      const qs = buildQueryString(query);
      const url = `http://localhost:4000/chartData?${qs}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch chart data');
      }

      const apiData = (await response.json()) as ChartDataPoint[];

      dataCache.set(cacheKey, apiData);
      setChartData(apiData);
    } catch (error) {
      console.error('Error fetching chart data from API:', error);

      // 📉 في حال فشل الـ API استخدم fallback (تقدر تشيله لو ما تحتاجه)
      const months = [
        'يناير',
        'فبراير',
        'مارس',
        'أبريل',
        'مايو',
        'يونيو',
        'يوليو',
        'أغسطس',
        'سبتمبر',
        'أكتوبر',
        'نوفمبر',
        'ديسمبر',
      ];
      const newData = months.map((month) => ({
        name: month,
        value: Math.floor(Math.random() * 50000) + 30000,
      }));
      dataCache.set(cacheKey, newData);
      setChartData(newData);
    }
  };

  const handleSuggestedQueryAction = (
    action: 'monthly' | 'tariff' | 'weight' | 'ports' | 'companies'
  ) => {
    switch (action) {
      case 'monthly':
        setShowMonthClickHint(true);
        setTimeout(() => setShowMonthClickHint(false), 5000);
        break;
      case 'tariff':
        setActiveModal('tariff');
        break;
      case 'weight': {
        let newMetric = 'عدد الوحدات';
        if (currentQuery.metric === 'عدد الوحدات') {
          newMetric = 'الوزن الإجمالي';
        } else if (currentQuery.metric === 'الوزن الإجمالي') {
          newMetric = 'عدد الشحنات';
        } else {
          newMetric = 'عدد الوحدات';
        }
        const weightQuery: QueryData = {
          ...currentQuery,
          metric: newMetric,
        };
        handleQuerySubmit(weightQuery);
        break;
      }
      case 'ports':
        setActiveModal('ports');
        break;
      case 'companies':
        setActiveModal('companies');
        break;
    }
  };

  const handleMonthClick = (monthName: string) => {
    setSelectedMonth(monthName);
    setActiveModal('drilldown');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedMonth(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <Header onAskClick={() => setActiveModal('ask')} />

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            استعلام حجم الاستيراد أو التصدير من منتجـ(ات) معينة
          </h1>
          <p className="text-slate-600">استعلامات متعددة الأبعاد مع تصور بياني</p>
        </div>

        <div className="space-y-6">
          {/* 🧱 QueryBuilder دائمًا ظاهر عشان المستخدم يقدر يبحث */}
          <QueryBuilder
            onSubmit={handleQuerySubmit}
            initialQuery={currentQuery}
          />

          {/* ⬅️ هنا نخفي كل شيء مرتبط بالنتائج لو ما فيه بحث */}
          {hasSearched && (
            <>
              <ChartDisplay
                data={chartData}
                query={currentQuery}
                onMonthClick={handleMonthClick}
                showMonthClickHint={showMonthClickHint}
              />

              <SuggestedQueries
                onAction={handleSuggestedQueryAction}
                currentQuery={currentQuery}
              />
            </>
          )}
        </div>
      </div>

      {/* حتى المودالات المرتبطة بالنتائج يفضل ما تفتح إلا بعد بحث، لكن لو حاب نخليها مربوطة بالـ state فقط */}
      {hasSearched && activeModal === 'drilldown' && selectedMonth && (
        <DrilldownModal
          month={selectedMonth}
          query={currentQuery}
          onClose={handleCloseModal}
        />
      )}

      {hasSearched && activeModal === 'tariff' && (
        <TariffModal
          query={currentQuery}
          onClose={handleCloseModal}
        />
      )}

      {hasSearched && activeModal === 'ports' && (
        <PortDistributionModal
          query={currentQuery}
          onClose={handleCloseModal}
        />
      )}

      {hasSearched && activeModal === 'companies' && (
        <ClearanceCompaniesModal
          query={currentQuery}
          onClose={handleCloseModal}
        />
      )}

      {/* AskModal ممكن تخليه يشتغل حتى بدون بحث، لذلك ما ربطته بـ hasSearched */}
      {activeModal === 'ask' && (
        <AskModal
          currentQuery={currentQuery}
          onClose={handleCloseModal}
          onQueryGenerate={handleQuerySubmit}
        />
      )}
    </div>
  );
}

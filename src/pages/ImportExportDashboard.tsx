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
  sector: string | null;
  metric: string | null;
  direction: string | null;
  productCategory: string | null; // لو حاب تخليها array لاحقاً تغيّرها إلى string[]
  period: {
    from: string | null;
    to: string | null;
  };
  port: string | null;
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

// بدال buildQueryString خلّيناها تبني جسم الطلب للـ POST
const buildRequestBody = (query: QueryData) => {
  return {
    sectionId: query.sector,
    scale: query.metric,
    direction: query.direction,
    tariffs: query.productCategory ? query.productCategory.split(',').map(v => v.trim()) : null, // لو صارت array استخدم query.productCategory.join(',')
    dateFrom: query.period.from,
    dateTo: query.period.to,
    port: query.port ? [query.port] : null,
  };
};

export default function ImportExportDashboard() {
  const [currentQuery, setCurrentQuery] = useState<QueryData>({
    sector: null,
    metric: 'QUANTITY',
    direction: null,
    productCategory: null,
    period: {
      from: null,
      to: null,
    },
    port: null,
  });

  const [dataCache] = useState<Map<string, ChartDataPoint[]>>(new Map());
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showMonthClickHint, setShowMonthClickHint] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);

  // Tabs as buttons
  const [activeTab, setActiveTab] = useState<
    'volume' | 'unitCost' | 'efficiency'
  >('volume');

  const getCacheKey = (query: QueryData) => {
    return JSON.stringify({
      sectionId: query.sector,
      metric: query.metric,
      direction: query.direction,
      productCategory: query.productCategory,
      period: query.period,
      port: query.port,
    });
  };

  const handleQuerySubmit = async (query: QueryData) => {
    setCurrentQuery(query);
    setShowMonthClickHint(false);
    setHasSearched(true);

    const cacheKey = getCacheKey(query);

    // لو حاب ترجع تفعّل الكاش
    if (dataCache.has(cacheKey)) {
      setChartData(dataCache.get(cacheKey)!);
      return;
    }

    try {
      const body = buildRequestBody(query);

      const response = await fetch(`/market-trends/v1/market-trends/chart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('API Error');

      const apiData = (await response.json()) as ChartDataPoint[];
      console.log('Fetched API Data:', apiData.response);
      dataCache.set(cacheKey, apiData.response);
      setChartData(apiData.response);
    } catch (error) {
      // بيانات تجريبية في حال الـ API تعطل
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

      const newData = months.map((m) => ({
        name: m,
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
        let newMetric =
          currentQuery.metric === 'عدد الوحدات'
            ? 'الوزن الإجمالي'
            : currentQuery.metric === 'الوزن الإجمالي'
              ? 'عدد الشحنات'
              : 'عدد الوحدات';

        handleQuerySubmit({ ...currentQuery, metric: newMetric });
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

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
    setActiveModal('drilldown');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedMonth(null);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-8">
        <Header onAskClick={() => setActiveModal('ask')} />

        {/* Buttons Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setActiveTab('volume')}
            className={`px-4 py-3 rounded-xl font-medium text-sm border transition-all w-fit
      ${activeTab === 'volume'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
          >
            حجم الاستيراد أو التصدير
          </button>

          <button
            onClick={() => setActiveTab('unitCost')}
            className={`px-4 py-3 rounded-xl font-medium text-sm border transition-all w-fit
      ${activeTab === 'unitCost'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
          >
            التغير في تكلفة الوحدة
          </button>

          <button
            onClick={() => setActiveTab('efficiency')}
            className={`px-4 py-3 rounded-xl font-medium text-sm border transition-all w-fit
      ${activeTab === 'efficiency'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
          >
            الكفاءة الوقتية لشركاء التخليص
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'unitCost' && (
          <div className="mb-8 bg-amber-50 border border-amber-200 p-5 rounded-xl text-amber-800">
            🌟 سيتم توفير هذا الاستعلام قريباً — نعمل حالياً على تطوير تحليل
            التغير في تكلفة الوحدة.
          </div>
        )}

        {activeTab === 'efficiency' && (
          <div className="mb-8 bg-amber-50 border border-amber-200 p-5 rounded-xl text-amber-800">
            ⏱️ سيتم توفير هذا الاستعلام قريباً — قسم الكفاءة الوقتية لشركاء
            التخليص تحت التطوير.
          </div>
        )}

        {activeTab === 'volume' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                استعلام حجم الاستيراد أو التصدير من منتجـ(ات) معينة
              </h1>
              <p className="text-slate-600">
                استعلامات متعددة الأبعاد مع تصور بياني
              </p>
            </div>

            <QueryBuilder
              onSubmit={handleQuerySubmit}
              initialQuery={currentQuery}
            />

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
          </>
        )}
      </div>

      {/* Result Modals */}
      {activeTab === 'volume' &&
        hasSearched &&
        activeModal === 'drilldown' &&
        selectedMonth && (
          <DrilldownModal
            month={selectedMonth}
            query={currentQuery}
            onClose={handleCloseModal}
          />
        )}

      {activeTab === 'volume' &&
        hasSearched &&
        activeModal === 'tariff' && (
          <TariffModal query={currentQuery} onClose={handleCloseModal} />
        )}

      {activeTab === 'volume' &&
        hasSearched &&
        activeModal === 'ports' && (
          <PortDistributionModal
            query={currentQuery}
            onClose={handleCloseModal}
          />
        )}

      {activeTab === 'volume' &&
        hasSearched &&
        activeModal === 'companies' && (
          <ClearanceCompaniesModal
            query={currentQuery}
            onClose={handleCloseModal}
          />
        )}

      {/* AskModal always works */}
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

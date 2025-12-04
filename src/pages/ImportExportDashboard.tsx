import { QueryBuilder } from '../components/QueryBuilder';
import { ChartDisplay } from '../components/ChartDisplay';
import { SuggestedQueries } from '../components/SuggestedQueries';
import { DrilldownModal } from '../components/DrilldownModal';
import { TariffModal } from '../components/TariffModal';
import { PortDistributionModal } from '../components/PortDistributionModal';
import { ClearanceCompaniesModal } from '../components/ClearanceCompaniesModal';
import { AskModal } from '../components/AskModal';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';


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

export default function ImportExportDashboard() {
  const [currentQuery, setCurrentQuery] = useState<QueryData>({
    sector: 'جميع القطاعات',
    metric: 'عدد الوحدات',
    location: 'استيراد',
    productCategory: 'اختر التعرفة',
    period: {
      from: '2024-12-01',
      to: '2025-12-01'
    },
    port: 'جميع المنافذ'
  });

  // Store data per query configuration to maintain consistency
  const [dataCache] = useState<Map<string, ChartDataPoint[]>>(new Map());
  const [userModifiedDates, setUserModifiedDates] = useState(false);

  const [chartData, setChartData] = useState<ChartDataPoint[]>([
    { name: 'يناير', value: 45000 },
    { name: 'فبراير', value: 52000 },
    { name: 'مارس', value: 48000 },
    { name: 'أبريل', value: 61000 },
    { name: 'مايو', value: 55000 },
    { name: 'يونيو', value: 67000 },
    { name: 'يوليو', value: 58000 },
    { name: 'أغسطس', value: 72000 },
    { name: 'سبتمبر', value: 64000 },
    { name: 'أكتوبر', value: 69000 },
    { name: 'نوفمبر', value: 71000 },
  ]);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showMonthClickHint, setShowMonthClickHint] = useState(false);

  const getCacheKey = (query: QueryData) => {
    return JSON.stringify({
      sector: query.sector,
      metric: query.metric,
      location: query.location,
      productCategory: query.productCategory,
      period: query.period,
      port: query.port
    });
  };

  const handleQuerySubmit = (query: QueryData) => {
    setCurrentQuery(query);
    setShowMonthClickHint(false);

    const cacheKey = getCacheKey(query);

    // Check if we have cached data for this query
    if (dataCache.has(cacheKey)) {
      setChartData(dataCache.get(cacheKey)!);
    } else {
      // Generate mock data based on query
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const newData = months.map(month => ({
        name: month,
        value: Math.floor(Math.random() * 50000) + 30000
      }));
      dataCache.set(cacheKey, newData);
      setChartData(newData);
    }
  };

  const handleSuggestedQueryAction = (action: 'monthly' | 'tariff' | 'weight' | 'ports' | 'companies') => {
    switch (action) {
      case 'monthly':
        setShowMonthClickHint(true);
        setTimeout(() => setShowMonthClickHint(false), 5000);
        break;
      case 'tariff':
        setActiveModal('tariff');
        break;
      case 'weight':
        let newMetric = 'عدد الوحدات';
        if (currentQuery.metric === 'عدد الوحدات') {
          newMetric = 'الوزن الإجمالي';
        } else if (currentQuery.metric === 'الوزن الإجمالي') {
          newMetric = 'عدد الشحنات';
        } else {
          newMetric = 'عدد الوحدات';
        }
        const weightQuery = {
          ...currentQuery,
          metric: newMetric
        };
        handleQuerySubmit(weightQuery);
        break;
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
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-slate-900 mb-2">استعلام حجم الاستيراد أو التصدير من منتجـ(ات) معينة</h1>
              <p className="text-slate-600">استعلامات متعددة الأبعاد مع تصور بياني</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveModal('ask')}
                className="flex items-center gap-2 px-6 py-3 cursor-pointer rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all hover:shadow-xl border border-slate-300 bg-white"
              >
                <MessageCircle className="w-5 h-5" />
                <span>ASK</span>
              </button>
              <Link to="/login" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
                <span className="btn-text">تسجيل الدخول</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <QueryBuilder onSubmit={handleQuerySubmit} initialQuery={currentQuery} />
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
        </div>
      </div>

      {activeModal === 'drilldown' && selectedMonth && (
        <DrilldownModal
          month={selectedMonth}
          query={currentQuery}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'tariff' && (
        <TariffModal
          query={currentQuery}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'ports' && (
        <PortDistributionModal
          query={currentQuery}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'companies' && (
        <ClearanceCompaniesModal
          query={currentQuery}
          onClose={handleCloseModal}
        />
      )}

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
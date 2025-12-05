import { useEffect, useState } from 'react';
import { X, Package } from 'lucide-react';
import { QueryData, CompanyData } from '../pages/ImportExportDashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TariffModalProps {
  query: QueryData;
  onClose: () => void;
}

interface TariffItem extends CompanyData {
  code?: string;
  units?: number;
}

export function TariffModal({ query, onClose }: TariffModalProps) {
  const [tariffData, setTariffData] = useState<TariffItem[]>([]);
  const [isLoadingTariff, setIsLoadingTariff] = useState(false);
  const [tariffError, setTariffError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTariffData = async () => {
      setIsLoadingTariff(true);
      setTariffError(null);

      try {
        // 👈 الآن نعتمد على /tariffs في الـ db.json
        const res = await fetch('http://localhost:4000/tariffs');
        if (!res.ok) {
          throw new Error('Failed to load tariff data');
        }

        const payload = (await res.json()) as TariffItem[];

        if (!payload || payload.length === 0) {
          setTariffError('لا توجد بيانات متاحة للتعرفة الجمركية.');
          setTariffData([]);
        } else {
          setTariffData(payload);
        }
      } catch (error) {
        console.error('Error loading tariff data:', error);
        setTariffError('تعذر تحميل بيانات التعرفات الجمركية.');
        setTariffData([]);
      } finally {
        setIsLoadingTariff(false);
      }
    };

    fetchTariffData();
  }, [query]);

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percentage,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 40;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#334155"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: '600' }}
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-slate-900">تصنيف حسب التعرفة الجمركية</h2>
              <p className="text-slate-600">
                {query.productCategory} - {query.period.from} إلى {query.period.to}
              </p>
              {isLoadingTariff && (
                <p className="text-xs text-slate-500 mt-1">
                  جاري تحميل بيانات التعرفات الجمركية...
                </p>
              )}
              {tariffError && (
                <p className="text-xs text-amber-600 mt-1">{tariffError}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Pie chart */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-slate-900 mb-6">توزيع التعرفات الجمركية</h3>

            {tariffData.length === 0 ? (
              <p className="text-center text-slate-500 py-10">
                لا توجد بيانات متاحة للتعرفة الجمركية.
              </p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="h-96 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tariffData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props) => (
                            <CustomLabel {...props} percentage={props.percentage} />
                          )}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {tariffData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            direction: 'rtl',
                          }}
                          formatter={(value: number) => [`${value}%`, 'النسبة']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-3">
                  {tariffData.map((tariff, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-slate-200"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                          style={{ backgroundColor: tariff.color }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-slate-900">{tariff.name}</span>
                            <span className="text-slate-900">
                              {tariff.percentage}%
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm">
                            رمز التعرفة:{' '}
                            {tariff.code ?? `3402.20.${10 + index}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detailed table */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-slate-900 mb-4">تفاصيل التعرفات الجمركية</h3>
            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-right text-slate-700">
                      رمز التعرفة
                    </th>
                    <th className="px-6 py-3 text-right text-slate-700">الوصف</th>
                    <th className="px-6 py-3 text-right text-slate-700">
                      عدد الوحدات
                    </th>
                    <th className="px-6 py-3 text-right text-slate-700">
                      النسبة المئوية
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tariffData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-slate-500"
                      >
                        لا توجد بيانات متاحة للتعرفة الجمركية.
                      </td>
                    </tr>
                  ) : (
                    tariffData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-900">
                          {item.code ?? `3402.20.${10 + idx}`}
                        </td>
                        <td className="px-6 py-4 text-slate-900">{item.name}</td>
                        <td className="px-6 py-4 text-slate-900">
                          {item.units
                            ? item.units.toLocaleString('ar-SA')
                            : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                            {item.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

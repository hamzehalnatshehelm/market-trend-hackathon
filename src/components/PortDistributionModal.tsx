import { useEffect, useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { QueryData } from '../pages/ImportExportDashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PortDistributionModalProps {
  query: QueryData;
  onClose: () => void;
}

interface PortItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
  type: string;
  units: number;
  rank: number;
}

export function PortDistributionModal({ query, onClose }: PortDistributionModalProps) {
  const [portData, setPortData] = useState<PortItem[]>([]);
  const [isLoadingPorts, setIsLoadingPorts] = useState(false);
  const [portsError, setPortsError] = useState<string | null>(null);

  const getDirectionLabel = () => {
    return query.location === 'استيراد' ? 'الاستيراد' : 'التصدير';
  };

  useEffect(() => {
    const fetchPortData = async () => {
      setIsLoadingPorts(true);
      setPortsError(null);

      try {
        const res = await fetch('http://localhost:4000/ports');

        if (!res.ok) {
          throw new Error('Failed to load port data');
        }

        const payload = await res.json();

        if (Array.isArray(payload)) {
          setPortData(payload);
        } else {
          setPortsError('صيغة البيانات من السيرفر غير صحيحة.');
        }
      } catch (error) {
        console.error('Error loading port data:', error);
        setPortsError('تعذر تحميل بيانات المنافذ الجمركية.');
      } finally {
        setIsLoadingPorts(false);
      }
    };

    fetchPortData();
  }, [query]);

  const CustomLabel = ({ cx, cy, midAngle, outerRadius, percentage }: any) => {
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
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-slate-900">توزيع المنافذ الجمركية</h2>
              <p className="text-slate-600">
                {query.productCategory} - {query.period.from} إلى {query.period.to}
              </p>

              {isLoadingPorts && (
                <p className="text-xs text-slate-500 mt-1">
                  جاري تحميل بيانات المنافذ...
                </p>
              )}

              {portsError && (
                <p className="text-xs text-rose-600 mt-1">{portsError}</p>
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
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-slate-900 mb-6">المنافذ الأكثر استخداماً</h3>

            {portData.length === 0 ? (
              <p className="text-center py-10 text-slate-500">
                لا توجد بيانات لعرضها.
              </p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="h-96 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={portData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props) => <CustomLabel {...props} percentage={props.percentage} />}
                          outerRadius={120}
                          dataKey="value"
                        >
                          {portData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
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
                  {portData.map((port, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg p-4 border border-slate-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: port.color }}
                          />
                          <span className="text-slate-900">{port.name}</span>
                        </div>
                        <span className="text-slate-900">{port.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-slate-900 mb-4">
              تفاصيل المنافذ مرتبة حسب حجم {getDirectionLabel()}
            </h3>

            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-right">#</th>
                    <th className="px-6 py-3 text-right">اسم المنفذ</th>
                    <th className="px-6 py-3 text-right">النوع</th>
                    <th className="px-6 py-3 text-right">{query.metric}</th>
                    <th className="px-6 py-3 text-right">النسبة</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {portData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-500">
                        لا توجد بيانات متاحة.
                      </td>
                    </tr>
                  ) : (
                    portData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-6 py-4">#{item.rank}</td>
                        <td className="px-6 py-4">{item.name}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                              item.type === 'بحري'
                                ? 'bg-blue-100 text-blue-700'
                                : item.type === 'جوي'
                                ? 'bg-green-100 text-green-700'
                                : item.type === 'بري'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-900">
                          {item.units.toLocaleString('ar-SA')}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700">
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

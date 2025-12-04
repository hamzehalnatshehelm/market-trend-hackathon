import { X, MapPin } from 'lucide-react';
import { QueryData, CompanyData } from '../pages/ImportExportDashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PortDistributionModalProps {
  query: QueryData;
  onClose: () => void;
}

export function PortDistributionModal({ query, onClose }: PortDistributionModalProps) {
  // Get direction label
  const getDirectionLabel = () => {
    return query.location === 'استيراد' ? 'الاستيراد' : 'التصدير';
  };

  const portData: CompanyData[] = [
    { 
      name: 'ميناء جدة الإسلامي', 
      value: 42, 
      percentage: 42, 
      color: '#1e5a7d' 
    },
    { 
      name: 'ميناء الملك عبدالعزيز', 
      value: 28, 
      percentage: 28, 
      color: '#f59e42' 
    },
    { 
      name: 'مطار الملك خالد الدولي', 
      value: 15, 
      percentage: 15, 
      color: '#2d7a4f' 
    },
    { 
      name: 'منفذ البطحاء البري', 
      value: 10, 
      percentage: 10, 
      color: '#4db8d8' 
    },
    { 
      name: 'منافذ أخرى', 
      value: 5, 
      percentage: 5, 
      color: '#8b5cf6' 
    }
  ];

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
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
              <p className="text-slate-600">{query.productCategory} - {query.period.from} إلى {query.period.to}</p>
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
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {portData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          direction: 'rtl'
                        }}
                        formatter={(value: number) => [`${value}%`, 'النسبة']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3">
                {portData.map((port, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
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
          </div>

          {/* Detailed table */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-slate-900 mb-4">تفاصيل المنافذ مرتبة حسب حجم {getDirectionLabel()}</h3>
            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-right text-slate-700">الترتيب</th>
                    <th className="px-6 py-3 text-right text-slate-700">اسم المنفذ</th>
                    <th className="px-6 py-3 text-right text-slate-700">النوع</th>
                    <th className="px-6 py-3 text-right text-slate-700">{query.metric}</th>
                    <th className="px-6 py-3 text-right text-slate-700">النسبة المئوية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { rank: 1, name: 'ميناء جدة الإسلامي', type: 'بحري', units: '21,000', percentage: '42%' },
                    { rank: 2, name: 'ميناء الملك عبدالعزيز', type: 'بحري', units: '14,000', percentage: '28%' },
                    { rank: 3, name: 'مطار الملك خالد الدولي', type: 'جوي', units: '7,500', percentage: '15%' },
                    { rank: 4, name: 'منفذ البطحاء البري', type: 'بري', units: '5,000', percentage: '10%' },
                    { rank: 5, name: 'منافذ أخرى', type: 'متنوع', units: '2,500', percentage: '5%' },
                  ].map((item) => (
                    <tr key={item.rank} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900">#{item.rank}</td>
                      <td className="px-6 py-4 text-slate-900">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          item.type === 'بحري' ? 'bg-blue-100 text-blue-700' :
                          item.type === 'جوي' ? 'bg-green-100 text-green-700' :
                          item.type === 'بري' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-900">{item.units}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700">
                          {item.percentage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
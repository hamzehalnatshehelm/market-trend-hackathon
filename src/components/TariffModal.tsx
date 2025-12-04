import { X, Package } from 'lucide-react';
import { QueryData, CompanyData } from '../pages/ImportExportDashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface TariffModalProps {
  query: QueryData;
  onClose: () => void;
}

export function TariffModal({ query, onClose }: TariffModalProps) {
  const tariffData: CompanyData[] = [
    { 
      name: 'مسحوق غسيل مغلف 5 كيلو', 
      value: 35, 
      percentage: 35, 
      color: '#1e5a7d' 
    },
    { 
      name: 'مسحوق غسيل معبأ في كارتون 10 كيلو', 
      value: 28, 
      percentage: 28, 
      color: '#f59e42' 
    },
    { 
      name: 'مسحوق غسيل سائل في عبوات بلاستيكية', 
      value: 22, 
      percentage: 22, 
      color: '#2d7a4f' 
    },
    { 
      name: 'مسحوق غسيل مركز في أكياس صغيرة', 
      value: 15, 
      percentage: 15, 
      color: '#4db8d8' 
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
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-slate-900">تصنيف حسب التعرفة الجمركية</h2>
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
            <h3 className="text-slate-900 mb-6">توزيع التعرفات الجمركية</h3>
            
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
                        label={(props) => <CustomLabel {...props} percentage={props.percentage} />}
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
                          direction: 'rtl'
                        }}
                        formatter={(value: number) => [`${value}%`, 'النسبة']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3">
                {tariffData.map((tariff, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-4 h-4 rounded-full mt-1 flex-shrink-0" 
                        style={{ backgroundColor: tariff.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-900">{tariff.name}</span>
                          <span className="text-slate-900">{tariff.percentage}%</span>
                        </div>
                        <p className="text-slate-600 text-sm">
                          رمز التعرفة: {3402}.{20 + index}.{10 + index}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed table */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-slate-900 mb-4">تفاصيل التعرفات الجمركية</h3>
            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-right text-slate-700">رمز التعرفة</th>
                    <th className="px-6 py-3 text-right text-slate-700">الوصف</th>
                    <th className="px-6 py-3 text-right text-slate-700">عدد الوحدات</th>
                    <th className="px-6 py-3 text-right text-slate-700">النسبة المئوية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { code: '3402.20.10', description: 'مسحوق غسيل مغلف 5 كيلو', units: '17,500', percentage: '35%' },
                    { code: '3402.20.11', description: 'مسحوق غسيل معبأ في كارتون 10 كيلو', units: '14,000', percentage: '28%' },
                    { code: '3402.20.12', description: 'مسحوق غسيل سائل في عبوات بلاستيكية', units: '11,000', percentage: '22%' },
                    { code: '3402.20.13', description: 'مسحوق غسيل مركز في أكياس صغيرة', units: '7,500', percentage: '15%' },
                  ].map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900">{item.code}</td>
                      <td className="px-6 py-4 text-slate-900">{item.description}</td>
                      <td className="px-6 py-4 text-slate-900">{item.units}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700">
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
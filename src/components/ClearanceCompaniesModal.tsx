import { X, Building2, Phone, Mail } from 'lucide-react';
import { QueryData, CompanyData } from '../pages/ImportExportDashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ClearanceCompaniesModalProps {
  query: QueryData;
  onClose: () => void;
}

export function ClearanceCompaniesModal({ query, onClose }: ClearanceCompaniesModalProps) {
  // Get direction label
  const getDirectionLabel = () => {
    return query.location === 'استيراد' ? 'الاستيراد' : 'التصدير';
  };

  const companyData: CompanyData[] = [
    { 
      name: 'الشركة الوطنية للاستيراد', 
      value: 37, 
      percentage: 37, 
      color: '#1e5a7d',
      phone: '+966 12 234 5678',
      email: 'info@national-import.sa'
    },
    { 
      name: 'شركة أحمد الحمد للتخليص', 
      value: 26, 
      percentage: 26, 
      color: '#f59e42',
      phone: '+966 11 345 6789',
      email: 'contact@alhamad.sa'
    },
    { 
      name: 'شركة الأماني للاستيراد والتصدير', 
      value: 20, 
      percentage: 20, 
      color: '#2d7a4f',
      phone: '+966 13 456 7890',
      email: 'support@alamani.sa'
    },
    { 
      name: 'شركة النجاح للتخليص', 
      value: 10, 
      percentage: 10, 
      color: '#4db8d8',
      phone: '+966 12 567 8901',
      email: 'info@alnajah.sa'
    },
    { 
      name: 'شركة الفجر للخدمات الجمركية', 
      value: 7, 
      percentage: 7, 
      color: '#8b5cf6',
      phone: '+966 11 678 9012',
      email: 'customs@alfajr.sa'
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
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-900">شركات التخليص الجمركي</h2>
              <p className="text-slate-600">{query.port} - {query.period.from} إلى {query.period.to}</p>
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
            <h3 className="text-slate-900 mb-6">توزيع شركات التخليص حسب حجم {getDirectionLabel()}</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6">
                <div className="h-96 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={companyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props) => <CustomLabel {...props} percentage={props.percentage} />}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {companyData.map((entry, index) => (
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
                {companyData.map((company, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-4 h-4 rounded-full mt-1 flex-shrink-0" 
                        style={{ backgroundColor: company.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-900">{company.name}</span>
                          <span className="text-slate-900">{company.percentage}%</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Phone className="w-3 h-3" />
                            <span>{company.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Mail className="w-3 h-3" />
                            <span>{company.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed table */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-slate-900 mb-4">قائمة المخلصين مرتبة حسب حجم {getDirectionLabel()}</h3>
            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-right text-slate-700">الترتيب</th>
                    <th className="px-6 py-3 text-right text-slate-700">اسم الشركة</th>
                    <th className="px-6 py-3 text-right text-slate-700">رقم الهاتف</th>
                    <th className="px-6 py-3 text-right text-slate-700">البريد الإلكتروني</th>
                    <th className="px-6 py-3 text-right text-slate-700">{query.metric}</th>
                    <th className="px-6 py-3 text-right text-slate-700">النسبة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {companyData.map((company, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900">#{idx + 1}</td>
                      <td className="px-6 py-4 text-slate-900">{company.name}</td>
                      <td className="px-6 py-4 text-slate-700">
                        <a href={`tel:${company.phone}`} className="hover:text-blue-600">
                          {company.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <a href={`mailto:${company.email}`} className="hover:text-blue-600">
                          {company.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-slate-900">
                        {Math.round((company.percentage / 100) * 50000).toLocaleString('ar-SA')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          {company.percentage}%
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
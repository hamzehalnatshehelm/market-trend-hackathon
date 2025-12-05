import { useEffect, useState } from 'react';
import { X, Building2, Phone, Mail } from 'lucide-react';
import { QueryData, CompanyData } from '../pages/ImportExportDashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ClearanceCompaniesModalProps {
  query: QueryData;
  onClose: () => void;
}

export function ClearanceCompaniesModal({ query, onClose }: ClearanceCompaniesModalProps) {
  const [companyData, setCompanyData] = useState<CompanyData[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);

  const getDirectionLabel = () => {
    return query.location === 'استيراد' ? 'الاستيراد' : 'التصدير';
  };

  // 🛰️ fetch from API only – no fallback
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      setCompaniesError(null);

      try {
        const res = await fetch('http://localhost:4000/companyCharts');

        if (!res.ok) throw new Error('Failed to load company charts');

        const payload = await res.json();

        const apiCompanies = Array.isArray(payload.clearanceCompanies)
          ? payload.clearanceCompanies
          : [];

        setCompanyData(apiCompanies);
      } catch (error) {
        console.error('Error loading clearance companies:', error);
        setCompaniesError('تعذر تحميل بيانات شركات التخليص الجمركي.');
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanies();
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
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-900">شركات التخليص الجمركي</h2>
              <p className="text-slate-600">
                {query.port} - {query.period.from} إلى {query.period.to}
              </p>
              {isLoadingCompanies && (
                <p className="text-xs text-slate-500 mt-1">
                  جاري تحميل البيانات...
                </p>
              )}
              {companiesError && (
                <p className="text-xs text-rose-600 mt-1">{companiesError}</p>
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
          {/* Pie + list */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-slate-900 mb-6">
              توزيع شركات التخليص حسب حجم {getDirectionLabel()}
            </h3>

            {companyData.length === 0 ? (
              <p className="text-center text-slate-500 py-10">
                لا توجد بيانات للعرض.
              </p>
            ) : (
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
                          dataKey="value"
                        >
                          {companyData.map((entry, index) => (
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
                  {companyData.map((company, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-4 h-4 rounded-full mt-1"
                          style={{ backgroundColor: company.color }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-900">{company.name}</span>
                            <span className="text-slate-900">{company.percentage}%</span>
                          </div>

                          {company.phone && (
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                              <Phone className="w-3 h-3" />
                              <a href={`tel:${company.phone}`} className="hover:text-blue-600">
                                {company.phone}
                              </a>
                            </div>
                          )}

                          {company.email && (
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                              <Mail className="w-3 h-3" />
                              <a href={`mailto:${company.email}`} className="hover:text-blue-600">
                                {company.email}
                              </a>
                            </div>
                          )}
                        </div>
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
              قائمة المخلصين مرتبة حسب حجم {getDirectionLabel()}
            </h3>

            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-right">#</th>
                    <th className="px-6 py-3 text-right">اسم الشركة</th>
                    <th className="px-6 py-3 text-right">الهاتف</th>
                    <th className="px-6 py-3 text-right">البريد الإلكتروني</th>
                    <th className="px-6 py-3 text-right">{query.metric}</th>
                    <th className="px-6 py-3 text-right">النسبة</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {companyData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-slate-500 py-6">
                        لا توجد بيانات متاحة.
                      </td>
                    </tr>
                  ) : (
                    companyData.map((company, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-6 py-4">#{index + 1}</td>
                        <td className="px-6 py-4">{company.name}</td>
                        <td className="px-6 py-4">
                          {company.phone ? (
                            <a href={`tel:${company.phone}`} className="hover:text-blue-600">
                              {company.phone}
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {company.email ? (
                            <a href={`mailto:${company.email}`} className="hover:text-blue-600">
                              {company.email}
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>

                        <td className="px-6 py-4 text-slate-900">
                          {(
                            (company?.percentage || 0) *
                            500 // مثال — تقدر تغيّرها
                          ).toLocaleString('ar-SA')}
                        </td>

                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {company.percentage}%
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

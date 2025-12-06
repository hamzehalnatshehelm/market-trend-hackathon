import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, Search, Check } from 'lucide-react';
import axios from 'axios';

interface TariffItem {
  id: string;
  label: string;
  level?: 'chapter' | 'section' | 'item';
  children?: TariffItem[];
}

interface TariffTreeSelectProps {
  selectedItems: string[];
  onChange: (items: string[]) => void;
  sector?: string;
}

export function TariffTreeSelect({ selectedItems, onChange, sector }: TariffTreeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [tariffData, setTariffData] = useState<TariffItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // 🧩 نستخرج كود القطاع من النص:
  // مثال: "16 - آلات ..."  =>  "16"
  const getSectionCodeFromSector = (value?: string | null): string | null => {
    if (!value) return null;
    if (value === 'جميع القطاعات') return null;

    // نجيب أول رقمين من النص
    const match = value.match(/\d+/);
    if (!match) return null;

    // نخليها بنفس الشكل اللي يتوقعه الباك (مثلاً "06" أو "16")
    const code = match[0].padStart(2, '0');
    return code;
  };

  // 🛠 تحميل بيانات التعرفة من API حسب القطاع المختار
  useEffect(() => {
    const fetchTariffs = async () => {
      const sectionCode = getSectionCodeFromSector(sector);

      console.log('TariffTreeSelect sector =', sector, '→ sectionCode =', sectionCode);

      // لو ما في كود (أو المستخدم ما اختار قطاع) نفرغ التعرفة ونوقف
      if (!sectionCode) {
        setTariffData([]);
        setLoadError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError(null);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/market-trends/v1/chapters/sections/${sectionCode}`
        );

        // أحياناً الريسبونس تكون { response: [...] } وأحياناً array مباشرة
        const raw = (res.data?.response ?? res.data) as any[];

        const mapped: TariffItem[] = Array.isArray(raw)
          ? raw.map((chapter: any) => ({
            // الفصل
            id: String(chapter.id ?? chapter.chapterCd ?? chapter.sectionCd ?? ''),
            label:
              chapter.label ??
              chapter.chapterDescAr ??
              chapter.chapterDescEn ??
              `الفصل ${chapter.id}`,
            level: 'chapter',
            // البنود (التعرفة) تحت الفصل
            children: Array.isArray(chapter.children)
              ? chapter.children.map((item: any) => ({
                id: String(item.hrmnzdCode ?? item.id),
                label:
                  item.label ??
                  item.itemDescAr ??
                  item.itemDescEn ??
                  String(item.hrmnzdCode ?? item.id),
                level: 'item',
                children: [],
              }))
              : [],
          }))
          : [];

        console.log('Tariff API mapped chapters/items:', mapped);

        setTariffData(mapped);
      } catch (error) {
        console.error('Error loading tariff tree:', error);
        setLoadError('تعذر تحميل بيانات التعرفة من النظام.');
        setTariffData([]);
      } finally {
        setLoading(false);
      }


    };

    fetchTariffs();
  }, [sector]);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAllItems = (items: TariffItem[]): TariffItem[] => {
    let result: TariffItem[] = [];
    items.forEach((item) => {
      result.push(item);
      if (item.children && item.children.length > 0) {
        result = result.concat(getAllItems(item.children));
      }
    });
    return result;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery) {
      const allItems = getAllItems(tariffData);
      const matchingItems = allItems.filter((item) =>
        (item.label ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      onChange(matchingItems.map((item) => item.id));
      setSearchQuery('');
    }
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const isNodeSelected = (item: TariffItem): boolean => {
    if (selectedItems.includes(item.id)) return true;
    if (item.children && item.children.length > 0) {
      return item.children.every((child) => isNodeSelected(child));
    }
    return false;
  };

  const isNodePartiallySelected = (item: TariffItem): boolean => {
    if (!item.children || item.children.length === 0) return false;
    const selectedChildren = item.children.filter((child) => isNodeSelected(child));
    return selectedChildren.length > 0 && selectedChildren.length < item.children.length;
  };

  const getAllChildIds = (item: TariffItem): string[] => {
    if (!item.children || item.children.length === 0) return [];
    let ids: string[] = [];
    item.children.forEach((child) => {
      ids.push(child.id);
      ids = ids.concat(getAllChildIds(child));
    });
    return ids;
  };

  const handleNodeSelect = (item: TariffItem) => {
    const allChildIds = getAllChildIds(item);
    const allIds = [item.id, ...allChildIds];
    const isCurrentlySelected = isNodeSelected(item);

    let newSelection: string[];

    if (isCurrentlySelected) {
      newSelection = selectedItems.filter((id) => !allIds.includes(id));
    } else {
      newSelection = [...selectedItems];
      allIds.forEach((id) => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
    }

    console.log('Tariff selected items:', newSelection);
    onChange(newSelection);
  };

  const renderTreeItem = (item: TariffItem, depth: number = 0) => {
    const hasChildren = !!(item.children && item.children.length > 0);
    const isExpanded = expandedNodes.has(item.id);
    const isSelected = isNodeSelected(item);
    const isPartial = isNodePartiallySelected(item);

    return (
      <div key={item.id} className="select-none">
        <div
          className={`flex items-center gap-2 py-2 px-3 hover:bg-slate-100 rounded cursor-pointer ${isSelected ? 'bg-blue-50' : ''
            }`}
          style={{ paddingRight: `${depth * 1.5 + 0.75}rem` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(item.id);
              }}
              className="p-0.5 hover:bg-slate-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          <div
            onClick={() => handleNodeSelect(item)}
            className={`w-4 h-4 border-2 rounded flex items-center justify-center ${isSelected
              ? 'bg-blue-600 border-blue-600'
              : isPartial
                ? 'bg-blue-200 border-blue-400'
                : 'border-slate-300'
              }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
            {isPartial && !isSelected && <div className="w-2 h-0.5 bg-blue-600" />}
          </div>

          <span
            className={`text-sm flex-1 ${isSelected ? 'text-blue-900' : 'text-slate-700'
              }`}
          >
            {item.label}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {item.children!.map((child) => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const getDisplayText = () => {
    const sectionCode = getSectionCodeFromSector(sector);

    if (!sectionCode) return 'اختر قطاعاً ثم التعرفة';
    if (loading) return 'جاري تحميل التعرفة...';
    if (selectedItems.length === 0) return 'اختر التعرفة';

    const all = getAllItems(tariffData);

    if (selectedItems.length === 1) {
      const item = all.find((i) => i.id === selectedItems[0]);
      return item?.label || 'تعرفة محددة';
    }

    return `${selectedItems.length} تعرفة محددة`;
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer flex items-center justify-between"
      >
        <span className={selectedItems.length === 0 ? 'text-slate-400' : 'text-slate-900'}>
          {getDisplayText()}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن التعرفة... (اضغط Enter للتحديد)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pr-10 pl-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {loadError && (
              <p className="mt-2 text-xs text-amber-700">{loadError}</p>
            )}
          </div>

          <div className="overflow-y-auto max-h-80 p-2">
            {!sector || sector === 'جميع القطاعات' ? (
              <p className="text-sm text-slate-500 px-3 py-2">
                اختر قطاعاً أولاً لعرض التعرفات المرتبطة به.
              </p>
            ) : loading ? (
              <p className="text-sm text-slate-500 px-3 py-2">جاري تحميل البيانات...</p>
            ) : (
              <>
                {tariffData.map((item) => renderTreeItem(item))}
                {!tariffData.length && !loadError && (
                  <p className="text-sm text-slate-500 px-3 py-2">
                    لا توجد بيانات تعرفة متاحة لهذا القطاع.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="p-3 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => {
                onChange([]);
                setIsOpen(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              مسح الكل
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

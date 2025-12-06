import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, Search, Check } from 'lucide-react';

interface TariffItem {
  id: string;
  label: string;
  // level: 'chapter' | 'section' | 'item';
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock tariff data structure
  const allTariffs: TariffItem[] = [
    {
      id: 'chapter-34',
      label: 'الفصل 34 - الصابون والمواد العضوية',
      // level: 'chapter',
      children: [
        {
          id: 'section-3401',
          label: 'القسم 3401 - الصابون',
          // level: 'section',
          children: [
            { id: '3401.11', label: '3401.11 - صابون معطر' },
            { id: '3401.19', label: '3401.19 - صابون آخر' },
          ]
        },
        {
          id: 'section-3402',
          label: 'القسم 3402 - مواد تنظيف',
          children: [
            { id: '3402.11', label: '3402.11 - مسحوق غسيل' },
            { id: '3402.12', label: '3402.12 - سائل غسيل' },
            { id: '3402.13', label: '3402.13 - منظفات أطباق'},
          ]
        }
      ]
    },
    {
      id: 'chapter-19',
      label: 'الفصل 19 - المواد الغذائية المحضرة',
      children: [
        {
          id: 'section-1901',
          label: 'القسم 1901 - مستحضرات غذائية',
          children: [
            { id: '1901.10', label: '1901.10 - مستحضرات للأطفال' },
            { id: '1901.20', label: '1901.20 - مخبوزات' },
          ]
        },
        {
          id: 'section-1902',
          label: 'القسم 1902 - معكرونة',
          children: [
            { id: '1902.11', label: '1902.11 - معكرونة محشوة' },
            { id: '1902.19', label: '1902.19 - معكرونة أخرى' },
          ]
        }
      ]
    },
    {
      id: 'chapter-85',
      label: 'الفصل 85 - آلات وأجهزة كهربائية',
      children: [
        {
          id: 'section-8501',
          label: 'القسم 8501 - محركات كهربائية',
          children: [
            { id: '8501.10', label: '8501.10 - محركات صغيرة' },
            { id: '8501.20', label: '8501.20 - محركات كبيرة' },
          ]
        }
      ]
    }
  ];

  // Filter tariffs based on sector
  const getFilteredTariffs = () => {
    if (!sector || sector === 'جميع القطاعات') {
      return allTariffs;
    }
    
    // Simple filtering logic - in real app this would be more sophisticated
    if (sector.includes('التنظيف')) {
      return allTariffs.filter(t => t.id === 'chapter-34');
    } else if (sector.includes('الغذائية')) {
      return allTariffs.filter(t => t.id === 'chapter-19');
    } else if (sector.includes('الإلكترونيات')) {
      return allTariffs.filter(t => t.id === 'chapter-85');
    }
    
    return allTariffs;
  };

  const tariffData = getFilteredTariffs();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery) {
      // Load all tariffs matching the search
      const allItems = getAllItems(tariffData);
      const matchingItems = allItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      onChange(matchingItems.map(item => item.id));
      setSearchQuery('');
    }
  };

  const getAllItems = (items: TariffItem[]): TariffItem[] => {
    let result: TariffItem[] = [];
    items.forEach(item => {
      result.push(item);
      if (item.children) {
        result = result.concat(getAllItems(item.children));
      }
    });
    return result;
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
    if (item.children) {
      return item.children.every(child => isNodeSelected(child));
    }
    return false;
  };

  const isNodePartiallySelected = (item: TariffItem): boolean => {
    if (!item.children) return false;
    const selectedChildren = item.children.filter(child => isNodeSelected(child));
    return selectedChildren.length > 0 && selectedChildren.length < item.children.length;
  };

  const handleNodeSelect = (item: TariffItem) => {
    const allChildIds = getAllChildIds(item);
    const allIds = [item.id, ...allChildIds];
    const isCurrentlySelected = isNodeSelected(item);

    if (isCurrentlySelected) {
      // Deselect this node and all children
      const newSelection = selectedItems.filter(id => !allIds.includes(id));
      onChange(newSelection);
    } else {
      // Select this node and all children
      const newSelection = [...selectedItems];
      allIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      onChange(newSelection);
    }
  };

  const getAllChildIds = (item: TariffItem): string[] => {
    if (!item.children) return [];
    let ids: string[] = [];
    item.children.forEach(child => {
      ids.push(child.id);
      ids = ids.concat(getAllChildIds(child));
    });
    return ids;
  };

  const renderTreeItem = (item: TariffItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedNodes.has(item.id);
    const isSelected = isNodeSelected(item);
    const isPartial = isNodePartiallySelected(item);

    return (
      <div key={item.id} className="select-none">
        <div
          className={`flex items-center gap-2 py-2 px-3 hover:bg-slate-100 rounded cursor-pointer ${
            isSelected ? 'bg-blue-50' : ''
          }`}
          style={{ paddingRight: `${depth * 1.5 + 0.75}rem` }}
        >
          {hasChildren && (
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
          )}
          
          {!hasChildren && <div className="w-5" />}

          <div
            onClick={() => handleNodeSelect(item)}
            className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
              isSelected
                ? 'bg-blue-600 border-blue-600'
                : isPartial
                ? 'bg-blue-200 border-blue-400'
                : 'border-slate-300'
            }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
            {isPartial && !isSelected && <div className="w-2 h-0.5 bg-blue-600" />}
          </div>

          <span className={`text-sm flex-1 ${
            isSelected ? 'text-blue-900' : 'text-slate-700'
          }`}>
            {item.label}
          </span>

          {item.level === 'chapter' && (
            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded">بند</span>
          )}
          {item.level === 'section' && (
            <span className="text-xs text-slate-500 bg-blue-100 px-2 py-0.5 rounded">قسم</span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {item.children!.map(child => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const getDisplayText = () => {
    if (selectedItems.length === 0) return 'اختر التعرفة';
    if (selectedItems.length === 1) {
      const item = getAllItems(tariffData).find(i => i.id === selectedItems[0]);
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
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
          </div>

          <div className="overflow-y-auto max-h-80 p-2">
            {tariffData.map(item => renderTreeItem(item))}
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

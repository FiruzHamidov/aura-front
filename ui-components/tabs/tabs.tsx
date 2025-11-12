import { Tab } from './tab';
import { ListIcon, MapIcon } from 'lucide-react';
import clsx from 'clsx';

interface TabsProps<T extends string = string> {
  activeType: T;
  setActiveType: (type: T) => void;
  hasBorder?: boolean;
  tabs: readonly { key: T; label: string }[];
}

export const Tabs = <T extends string = string>({
                                                  tabs,
                                                  activeType,
                                                  hasBorder,
                                                  setActiveType,
                                                }: TabsProps<T>) => {
  return (
      <div
          className={clsx(
              'bg-[#F0F2F5]',
              hasBorder ? 'border border-[#E3E6EA]' : '',
              'rounded-full justify-center px-3 py-2.5 flex flex-wrap gap-2'
          )}
      >
        {tabs.map((tab) => {
          // choose icon by tab key (not by activeType)
          const Icon = tab.key === ('map' as T) ? MapIcon : ListIcon;

          const isActive = activeType === tab.key;

          return (
              <Tab
                  key={tab.key}
                  isActive={isActive}
                  onClick={() => setActiveType(tab.key)}
              >
                <div className="flex items-center gap-2">
                  <Icon
                      className={clsx(
                          'transition-colors',
                          isActive ? 'text-white' : 'text-[#0036A5]',
                          'w-5 h-5'
                      )}
                      aria-hidden="true"
                  />
                  {/* Text hidden on very small screens, visible from sm and up */}
                  <span
                      className={clsx(
                          'text-sm',
                          isActive ? 'text-white' : 'text-gray-700',
                          ' sm:inline'
                      )}
                  >
                {tab.label}
              </span>
                </div>
              </Tab>
          );
        })}
      </div>
  );
};
import { Tab } from './tab';

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
      className={`bg-[#F0F2F5] ${
        hasBorder ? 'border border-[#E3E6EA]' : ''
      } rounded-full w-max px-3 py-2.5 flex flex-wrap gap-2`}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          isActive={activeType === tab.key}
          onClick={() => setActiveType(tab.key)}
        >
          {tab.label}
        </Tab>
      ))}
    </div>
  );
};

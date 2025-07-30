import { FC } from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import BigPlusIcon from '@/icons/BigPlusIcon';
import MinusIcon from '@/icons/MinusIcon';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title: string;
  items: FAQItem[];
}

export const FAQ: FC<FAQProps> = ({ title, items }) => {
  return (
    <div>
      <h2 className="font-bold text-[32px] mb-10">{title}</h2>

      {items.map((item, index) => (
        <Disclosure
          as="div"
          key={index}
          className="bg-white px-10 py-[27px] mb-5 rounded-xl"
        >
          <DisclosureButton className="group flex w-full items-center justify-between text-left">
            <h3 className=" text-gray-900 group-data-[open]:font-bold transition-all duration-300">
              {item.question}
            </h3>
            <BigPlusIcon className="size-[46px] fill-gray-600 group-data-open:hidden" />
            <MinusIcon className="size-[46px] fill-gray-600 group-data-[open]:block hidden" />
          </DisclosureButton>
          <DisclosurePanel className="mt-4 text-gray-700">
            <p>{item.answer}</p>
          </DisclosurePanel>
        </Disclosure>
      ))}
    </div>
  );
};

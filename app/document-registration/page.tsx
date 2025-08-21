import { FAQ } from '@/ui-components/FAQ';
import { ExtraPagesBanner } from '../_components/extra-pages-banner';
import { WhyUs } from '../_components/why-us';
import { ProcessSteps } from './_components/process-steps';
import { ApplicationForm } from './_components/application-form';

const bannerData = {
  title: 'Оформление документов ',
  description:
    'Полный комплекс юридического сопровождения сделок с недвижимостью. Надежно. Законно. Под ключ.',
  buttonLabel: 'Получить консультацию ',
  buttonLink: '#document-registration-form',
  imageUrl: '/images/extra-pages/doc-banner.png',
  imageAlt: 'Регистрация документов',
};

export default function DocumentRegistration() {
  return (
    <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8 py-10 md:py-[100px]">
      <ExtraPagesBanner {...bannerData} />
      <div className="py-10">
        <WhyUs
          title="Почему мы?"
          items={[
            {
              image: '/images/extra-pages/doc-why-1.png',
              description: 'лет опыта в сфере недвижимости',
            },
            {
              image: '/images/extra-pages/doc-why-2.png',
              description: 'Лицензированные юристы и риэлторы',
            },
            {
              image: '/images/extra-pages/doc-why-3.png',
              description: 'Прозрачные тарифы, без скрытых комиссий',
            },
            {
              image: '/images/extra-pages/doc-why-4.png',
              description: 'Онлайн и офлайн сопровождение',
            },
          ]}
        />
      </div>

      <ProcessSteps />

      <div className="py-10" id="document-registration-form">
        <ApplicationForm title={bannerData.title} description={bannerData.description}/>
      </div>
      <FAQ
        items={[
          {
            question: 'Какой срок оформления документов?',
            answer:
              'Срок оформления документов зависит от конкретной услуги и составляет от 3 до 10 рабочих дней.',
          },
          {
            question: 'Какие документы нужны для оформления?',
            answer:
              'Для оформления документов необходимы: паспорт, ИНН, СНИЛС и документы, подтверждающие право собственности.',
          },
        ]}
      />
    </div>
  );
}

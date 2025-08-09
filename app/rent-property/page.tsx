import { FAQ } from '@/ui-components/FAQ';
import { Cards } from './_components/cards';
import { ExtraPagesBanner } from '../_components/extra-pages-banner';
import { ProcessSteps } from './_components/process-steps';
import { ApplicationForm } from './_components/application-form';
import { OurServices } from './_components/our-services';

export default function RentProperty() {
  return (
    <div className="container py-10 md:pt-[100px]">
      <ExtraPagesBanner
        title="Сдайте свою недвижимость быстро и выгодно"
        description="Эффективная аренда без лишних хлопот — мы найдём надёжных арендаторов и обеспечим вам стабильный доход"
        buttonLabel="Получить консультацию"
        buttonLink="#sell-property-form"
        imageUrl="/images/extra-pages/sell-property-banner.png"
        imageAlt="Сдайте свою недвижимость быстро и выгодно"
      />

      <div className="py-10">
        <Cards />
      </div>

      <ProcessSteps />

      <div className="py-10">
        <OurServices />
      </div>

      <ApplicationForm />

      <div className="py-10">
        <FAQ
          items={[
            {
              question: 'Сколько времени занимает продать?',
              answer:
                'Время продажи зависит от многих факторов, включая рыночные условия и подготовку недвижимости. В среднем, процесс может занять от нескольких недель до нескольких месяцев.',
            },
            {
              question: 'Можно ли продать квартиру с долгами?',
              answer:
                'Да, продажа квартиры с долгами возможна, но может потребовать дополнительных шагов, таких как погашение долгов или согласование с кредиторами.',
            },
            {
              question: 'Какие документы нужны?',
              answer:
                'Для продажи квартиры обычно требуются следующие документы: паспорт собственника, свидетельство о праве собственности, кадастровый паспорт, а также документы, подтверждающие отсутствие долгов по коммунальным платежам.',
            },
            {
              question: 'Сколько стоит оценка?',
              answer:
                'Бесплатная оценка объекта недвижимости предоставляется в рамках наших услуг. Мы предлагаем профессиональную оценку, чтобы помочь вам определить справедливую рыночную стоимость вашей недвижимости.',
            },
            {
              question: 'Что если квартира не оформлена?',
              answer:
                'Если квартира не оформлена, это может усложнить процесс продажи. Вам может потребоваться оформить все необходимые документы и получить юридическое заключение о праве собственности.',
            },
          ]}
        />
      </div>
    </div>
  );
}

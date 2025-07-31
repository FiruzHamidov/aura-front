import { FAQ } from '@/ui-components/FAQ';
import { ExtraPagesBanner } from '../_components/extra-pages-banner';
import { ApplicationForm } from './_components/application-form';
import { ProcessSteps } from './_components/process-steps';
import { Cards } from './_components/cards';

export default function BuyRealEstate() {
  return (
    <div className="container py-10">
      <ExtraPagesBanner
        title="Срочный выкуп недвижимости"
        description="Быстро и безопасно выкупим вашу недвижимость по рыночной цене, полное юридическое сопровождение и прозрачные условия сделки."
        buttonLabel="Оставить заявку"
        buttonLink="/buy-real-estate#search"
        imageUrl="/images/extra-pages/buy-real-estate.png"
        imageAlt="Покупка недвижимости"
      />

      <div className="pt-10">
        <Cards />
      </div>

      <div className="py-10">
        <ProcessSteps />
      </div>

      <ApplicationForm />

      <div className="py-10">
        <FAQ
          title="Часто задаваемые вопросы"
          items={[
            {
              question: 'Сколько времени занимает выкуп?',
              answer:
                'Сроки продажи зависят от многих факторов, включая рыночные условия и готовность документов. В среднем, процесс может занять от нескольких дней до нескольких недель.',
            },
            {
              question: 'Можно ли продать квартиру с долгами?',
              answer:
                'Для продажи недвижимости вам понадобятся документы, подтверждающие право собственности, технический паспорт, а также документы, удостоверяющие личность продавца.',
            },
            {
              question: 'Какие документы нужны?',
              answer:
                'Комиссия зависит от условий сделки и может варьироваться. Мы предлагаем прозрачные тарифы без скрытых комиссий.',
            },
            {
              question: 'Сколько стоит оценка?',
              answer:
                'Мы предлагаем прозрачные тарифы без скрытых комиссий. Комиссия зависит от условий сделки и может варьироваться.',
            },
            {
              question: 'Что если квартира не оформлена?',
              answer:
                'Вы можете оставить заявку на нашем сайте, и наши менеджеры свяжутся с вами в ближайшее время.',
            },
          ]}
        />
      </div>
    </div>
  );
}

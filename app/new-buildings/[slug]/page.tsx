import { PriceAndBuilder } from './_components/PriceAndBuilder';
import { Offers } from './_components/Offers';
import { ComfortNearby } from './_components/ComfortNearby';
import { BuildingInfo } from './_components/BuildingInfo';

const apartmentData = {
  id: '13568442',
  title: 'ЖК Норак Ривер',
  publishedAt: 'Душанбе, Амиршоев',
  price: '473 860 c. – 1 148 240 c.',
  images: [
    '/images/buy/1.png',
    '/images/buy/2.jpeg',
    '/images/buy/3.jpeg',
    '/images/buy/4.jpeg',
    '/images/buy/5.jpeg',
  ],
  agent: {
    name: 'Кабир Сохтмон',
    position: 'Застройщик',
    image: '/images/team/1.png',
    phone: '+992 902 90 66 90',
    address: 'ул.Айни 64 г.Душанбе',
    description:
      'Компания Кабир Сохтмон уверенно зарекомендовала себя как лидер в строительстве современных жилых комплексов. С момента основания в 2016 году мы успешно завершили 14 проектов,',
    building: 2,
    builded: 10,
    founded: 2016,
    projects: 20,
  },
  apartment: {
    type: 'Вторичка',
    area: '72,2 м²',
    bathroom: '1',
    repair: 'Косметический',
    district: 'Сино',
  },
  building: {
    year: '2014',
    elevators: '2',
    type: 'Панельный',
    parking: 'Открытая',
    heating: 'Центральное',
  },
  description: `Id 4412. Удобная квартира в престижной локации!

Светлая и невероятно атмосферная квартира с функциональной распашной планировкой:
-- грамотное зонирование создает эффект просторной прихожей с системой хранения
-- уютная гостиная, которая может быть использована как спальня
-- кухня правильной формы, вмещающая все необходимое
-- большой санузел с невероятной ванной
-- изолированная комната с застекленной лоджией.

Благодаря ремонту квартира готова к проживанию. Выровнены стены, пол, заменены окна, радиаторы и коммуникации, электрическая разводка, кондиционеры.

Очень чистый подъезд после капремонта. Соседи поддерживают состояние МОПов.

В пешей доступности все, что нужно для жизни: школы, детские сады, поликлиники, магазины, аптеки, банки, рестораны, торговые центры. Совсем рядом современный Аптекарский огород. В шаговой доступности 3 станции метро: Сухаревская, Комсомольская и Проспект Мира.

Прозрачная история права (в семье с 1999 года). Полная стоимость в ДКП. Помощь в оформлении ипотеки.`,
};

export default function NewBuilding() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 pt-8 pb-12">
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="lg:w-2/3">
          <BuildingInfo apartmentData={apartmentData} />

          <Offers />

          <ComfortNearby />
        </div>

        <PriceAndBuilder apartmentData={apartmentData} />
      </div>
    </div>
  );
}

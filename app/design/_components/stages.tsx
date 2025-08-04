const stages = [
  {
    title: 'Этап 1',
    description: '7-10 рабочих дней',
    items: [
      {
        title: 'Знакомимся с объектом',
        description:
          'Наши замерщики сами приедут и замерят стены, отметят узлы и основные коммуникации.',
      },
      {
        title: 'Узнаем предпочтения',
        description:
          'Уточним ваши пожелания по дизайну интерьера на встрече и через анкету.',
      },
      {
        title: 'Продумываем планировку',
        description:
          'Дизайнер и архитектор проработают планировку, дадут варианты на выбор.',
      },
    ],
  },
  {
    title: 'Этап 2',
    description: '25-30 рабочих дней',
    items: [
      {
        title: 'Создаем концепт-проект',
        description:
          'Специалисты детализируют оформление помещения, покажут расстановку мебели.',
      },
      {
        title: 'Визуализируем в 3D',
        description:
          'Дизайнер готовит картинки, максимально похожие на будущий реальный интерьер.',
      },
      {
        title: 'Презентуем материалы',
        description:
          'Выбираем элементы мебели и декора для интерьера. Согласовываем с заказчиком.',
      },
    ],
  },
  {
    title: 'Этап 3',
    description: '17-22 рабочих дней',
    items: [
      {
        title: 'Делаем чертежи',
        description:
          'Разрабатываем подробную техническую документацию для выполнения строительных работ.',
      },
      {
        title: 'Составляем ведомости',
        description:
          'Перечисляем наименование и количество предметов интерьера и материалов.',
      },
      {
        title: 'Формируем бюджет',
        description:
          'Анализируем цены мебели и материалов, составляем общую смету по проекту.',
      },
    ],
  },
];

export const Stages = () => {
  return (
    <div className="flex items-center gap-5">
      {stages.map((stage, index) => (
        <div
          key={index}
          className="flex-1 rounded-[22px] bg-white overflow-hidden"
        >
          <div className="bg-[#0036A5] text-white py-4 px-[30px]">
            <h2 className="text-2xl font-bold">{stage.title}</h2>
            <p className="text-lg">{stage.description}</p>
          </div>
          <ul className="pl-[30px] pr-10 pt-[22px] pb-16">
            {stage.items.map((item, itemIndex) => (
              <li key={itemIndex} className="mb-[22px]">
                <div className="font-bold text-lg mb-0.5">{item.title}</div>
                <div className="text-sm leading-5 text-[#666F8D]">
                  {item.description}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

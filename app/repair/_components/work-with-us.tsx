const benefits = [
  {
    number: '1',
    title: 'Оплата по факту выполненных работ',
    description:
      'Не взимаем предоплату – платите только за результат, предварительно убедившись, что все устраивает. Наши клиенты на 100% защищены, а мы заинтересованы в качественном ремонте',
  },
  {
    number: '2',
    title: 'Стоимость не меняется в процессе работы',
    description:
      'Расценки зафиксированы в договоре, окончательная стоимость ремонта известна заранее – никаких переплат, скрытых наценок и дополнительных платежей, работаем без обмана',
  },
  {
    number: '3',
    title: 'Справедливые цены',
    description:
      'За ремонт не придется переплачивать – адекватная и фиксированная стоимость, без изменений до завершения работ',
  },
];

export const WorkWithUs = () => {
  return (
    <>
      <h2 className="text-[32px] font-bold mb-10">С нами удобно работать</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white px-10 pt-[30px] pb-10 rounded-[22px]"
          >
            <div className="w-20 h-20 bg-[#F0F2F5] rounded-[22px] flex items-center justify-center mb-4">
              <span className="text-[40px] font-bold text-[#666F8D]">
                {benefit.number}
              </span>
            </div>

            <h3 className="text-2xl font-bold leading-8 mb-3">
              {benefit.title}
            </h3>

            <p className="text-lg leading-6 text-[#353E5C]">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

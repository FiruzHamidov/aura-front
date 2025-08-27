import Link from 'next/link';

export default function MorePage() {
  const menuItems = [
    {
      title: 'Сервисы',
      description: 'Дополнительные услуги',
      href: '/services',
    },
    {
      title: 'О нас',
      description: 'Информация о компании',
      href: '/about',
    },
    {
      title: 'Команда',
      description: 'Наши эксперты',
      href: '/about/team',
    },
    {
      title: 'Новости',
      description: 'Последние обновления',
      href: '/about/news',
    },
    {
      title: 'Профиль',
      description: 'Личный кабинет',
      href: '/profile',
    },
    {
      title: 'Добавить объявление',
      description: 'Разместить недвижимость',
      href: '/profile/add-post',
    },
  ];

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-5">Ещё</h1>

      <div className="space-y-3">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="bg-white mb-4 rounded-xl p-4 flex items-center space-x-4">
              {/* <div className="text-2xl">{item.icon}</div> */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

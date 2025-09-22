'use client';

import { useCallback, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import { axios } from '@/utils/axios';
import { formatISO } from 'date-fns';
import { PropertiesResponse, Property } from '@/services/properties/types';


interface Booking {
  id: number;
  agent: {
    id: number;
    name: string;
  };
  start_time: string;
  end_time: string;
  note: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  property: Property;
  client_name: string;
  client_phone: string;
}

interface Agent {
  id: number;
  name: string;
}

export default function MyListings() {
  const [bookings, setBookings] = useState<EventInput[]>([]);
  const [properties, setProperties] = useState<PropertiesResponse>();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const formatInputDate = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleEventClick = async ({ event }: EventClickArg) => {
    const bookingId = event.id;

    try {
      const response = await axios.get<Booking>(`/bookings/${bookingId}`);
      setSelectedBooking(response.data);
      setDetailsOpen(true);
    } catch (error) {
      console.error('Ошибка при загрузке деталей показа:', error);
    }
  };

  const handleDateClick = useCallback((info: { date: Date }) => {
    const start = info.date;
    const end = new Date(start.getTime() + 60 * 60 * 1000); // дефолт +1 час
    setSelectedRange({ start, end });
    setSelectedProperty(null);
    setSelectedAgent(null);
    setNote('');
    setClientName('');
    setClientPhone('');
    setModalOpen(true);
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.get<Booking[]>('/bookings');
      const events: EventInput[] = response.data.map((booking) => ({
        id: booking.id.toString(),
        title: `${booking.property.rooms} кв, ${booking.property.total_area} м², ${booking.property.floor} эт, ${booking.property.district} ${booking.property.address},
                                            Агент: ${booking.agent.name}`,
        start: booking.start_time,
        end: booking.end_time,
        backgroundColor: getStatusColor(booking.status),
        borderColor: getStatusColor(booking.status),
      }));
      setBookings(events);
    } catch (error) {
      console.error('Ошибка при получении бронирований:', error);
    }
  }, []);

  const fetchProperties = useCallback(async () => {
    try {
      const response = await axios.get<PropertiesResponse>(
        '/properties?per_page=100'
      );
      setProperties(response.data);
    } catch (error) {
      console.error('Ошибка при получении объектов:', error);
    }
  }, []);

  const fetchAgents = useCallback(async () => {
    try {
      const response = await axios.get<Agent[]>('/user/agents');
      setAgents(response.data);
    } catch (error) {
      console.error('Ошибка при получении агентов:', error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchBookings();
      await fetchProperties();
      await fetchAgents();
    };

    void loadData();
  }, [fetchBookings, fetchProperties, fetchAgents]);

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#007bff';
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedRange({ start: selectInfo.start, end: selectInfo.end });
    setSelectedProperty(null);
    setSelectedAgent(null);
    setNote('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedRange ||
      !selectedProperty ||
      !selectedAgent ||
      !note.trim() ||
      !clientName.trim() ||
      !clientPhone.trim()
    ) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    const booking = {
      property_id: selectedProperty,
      agent_id: selectedAgent,
      start_time: formatISO(selectedRange.start),
      end_time: formatISO(selectedRange.end),
      note,
      client_name: clientName,
      client_phone: clientPhone,
    };

    try {
      await axios.post('/bookings', booking);
      setModalOpen(false);
      await fetchBookings();
    } catch (error) {
      alert(`Ошибка при создании брони ${error}`);
    }
  };

  return (
    <>
      <div className="p-4">
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView={isMobile ? 'listWeek' : 'listWeek'}
            headerToolbar={{
              left: isMobile ? 'prev,next' : 'prev,next today',
              center: isMobile ? '' : 'title',
              right: isMobile ? 'listWeek,dayGridMonth' : 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            footerToolbar={{
              center: isMobile ? 'title' : '',
            }}
            titleFormat={{ year: 'numeric', month: 'numeric', day: 'numeric' }}
            height="auto"
            expandRows
            dayMaxEventRows={isMobile ? 2 : 4}
            nowIndicator
            selectable
            select={handleDateSelect}
            dateClick={handleDateClick}
            events={bookings}
            locale={ruLocale}
            eventClick={handleEventClick}
        />
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Создать показ</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm ">Объект</label>
                <select
                  className="w-full border border-gray-300 rounded p-2"
                  value={selectedProperty ?? ''}
                  onChange={(e) => setSelectedProperty(Number(e.target.value))}
                  required
                >
                  <option value="" disabled>
                    Выберите объект
                  </option>
                  {properties?.data.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.rooms} кв, {p.total_area} м², {p.floor} эт,{' '}
                      {p.district} {p.address}, Агент: {p?.creator?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm ">Агент</label>
                <select
                  className="w-full border border-gray-300 rounded p-2"
                  value={selectedAgent ?? ''}
                  onChange={(e) => setSelectedAgent(Number(e.target.value))}
                  required
                >
                  <option value="" disabled>
                    Выберите агента
                  </option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>
                  Имя клиента:
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </label>
              </div>

              <div>
                <label>
                  Телефон клиента:
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded p-2"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    required
                    style={{ width: '100%' }}
                    placeholder="+992..."
                  />
                </label>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm ">Время показа с:</label>
                  <input
                    type="datetime-local"
                    className=" border border-gray-300 rounded p-2"
                    value={
                      selectedRange ? formatInputDate(selectedRange.start) : ''
                    }
                    onChange={(e) => {
                      if (selectedRange) {
                        setSelectedRange({
                          ...selectedRange,
                          start: new Date(e.target.value),
                        });
                      }
                    }}
                    required
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm ">Время показа до:</label>
                  <input
                    type="datetime-local"
                    className=" border border-gray-300 rounded p-2"
                    value={
                      selectedRange ? formatInputDate(selectedRange.end) : ''
                    }
                    onChange={(e) => {
                      if (selectedRange) {
                        setSelectedRange({
                          ...selectedRange,
                          end: new Date(e.target.value),
                        });
                      }
                    }}
                    required
                  />
                </div>
              </div>

              <br />

              <div>
                <label className="block text-sm ">Комментарий</label>
                <textarea
                  className="w-full border border-gray-300 rounded p-2"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
                  onClick={() => setModalOpen(false)}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="bg-[#0036A5] hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailsOpen && selectedBooking && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setDetailsOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Детали показа</h2>
            <div className="space-y-2">
              <p>
                <strong>Объект:</strong> {selectedBooking.property.rooms} кв,{' '}
                {selectedBooking.property.total_area} м²,{' '}
                {selectedBooking.property.floor} этаж,{' '}
                {selectedBooking.property.district},{' '}
                {selectedBooking.property.address}
              </p>
              <p>
                <strong>Описание:</strong>{' '}
                {selectedBooking.property.description}
              </p>
              <p>
                <strong>Агент:</strong> {selectedBooking.agent.name}
              </p>
              <p>
                <strong>Клиент:</strong> {selectedBooking.client_name},
                <a href={`tel:${selectedBooking.client_phone}`}>
                  📞 {selectedBooking.client_phone}
                </a>
              </p>
              <p>
                <strong>Время:</strong> {selectedBooking.start_time} —{' '}
                {selectedBooking.end_time}
              </p>
              <p>
                <strong>Комментарий:</strong> {selectedBooking.note}
              </p>
              <p>
                <strong>Статус:</strong> {selectedBooking.status}
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                onClick={() => setDetailsOpen(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

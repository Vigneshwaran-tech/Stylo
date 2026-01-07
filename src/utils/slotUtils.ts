// Utility to generate time slots based on shop hours
export interface SlotConfig {
  openTime: string; // "09:00"
  closeTime: string; // "18:00"
  slotDuration: number; // minutes
  breakTime?: { start: string; end: string }[]; // optional breaks
}

export const generateTimeSlots = (config: SlotConfig): string[] => {
  const slots: string[] = [];
  
  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const openMinutes = parseTime(config.openTime);
  const closeMinutes = parseTime(config.closeTime);
  const duration = config.slotDuration;

  let currentTime = openMinutes;

  while (currentTime + duration <= closeMinutes) {
    const slotStart = formatTime(currentTime);


    // Check if slot conflicts with breaks
    let isInBreak = false;
    if (config.breakTime) {
      for (const breakPeriod of config.breakTime) {
        const breakStart = parseTime(breakPeriod.start);
        const breakEnd = parseTime(breakPeriod.end);
        if (currentTime >= breakStart && currentTime < breakEnd) {
          isInBreak = true;
          currentTime = breakEnd;
          break;
        }
      }
    }

    if (!isInBreak) {
      slots.push(slotStart);
      currentTime += duration;
    }
  }

  return slots;
};

// Utility to generate slots for a specific date
export const generateDateSlots = (
  date: string,
  config: SlotConfig
): Array<{ id: string; time: string; date: string; available: boolean }> => {
  const timeSlots = generateTimeSlots(config);
  return timeSlots.map((time) => ({
    id: `${date}-${time}`,
    time,
    date,
    available: true,
  }));
};

// Utility to check if a slot can be booked (exists and is available)
export const isSlotAvailable = (
  availableSlots: Array<{ time: string; available: boolean }>,
  selectedTime: string
): boolean => {
  return availableSlots.some(slot => slot.time === selectedTime && slot.available);
};

// Utility to generate next 7 days starting from today
export const getNext7Days = (): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Utility to format date for display
export const formatDateForDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

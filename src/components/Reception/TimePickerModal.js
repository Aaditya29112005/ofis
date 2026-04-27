import React from 'react';
import FilterDropdown from '../FilterDropdown';

// Utility to generate times (e.g., 09:00 AM, 09:30 AM ... 05:00 PM)
const generateTimes = () => {
  const times = [];
  let d = new Date();
  d.setHours(8, 0, 0, 0); // Start 8 AM
  while (d.getHours() < 19) { // Until 6:30 PM
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hrs12 = hours % 12 || 12;
    const timeStr = `${hrs12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    times.push({ label: timeStr, value: timeStr });
    d.setMinutes(d.getMinutes() + 30);
  }
  return times;
};

const TIME_OPTIONS = generateTimes();

const TimePickerModal = ({ visible, onClose, selectedTime, onSelect }) => {
  return (
    <FilterDropdown
      visible={visible}
      onClose={onClose}
      options={TIME_OPTIONS}
      title="Expected Visit Time"
      selectedOption={selectedTime ? { label: selectedTime, value: selectedTime } : null}
      onSelect={(opt) => onSelect(opt.value)}
      searchable={false}
    />
  );
};

export default TimePickerModal;

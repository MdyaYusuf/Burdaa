// Calculates the age based on an ISO birthDate string like "17 yrs" or null if no date is provided
export const calculateAge = (birthDateString: string | null | undefined): string | null => {

  if (!birthDateString) {
    return null;
  }

  const birthDate = new Date(birthDateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  // If the current month is before the birth month or equal and the day hasn't happened yet subtract one year.
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return `${age} yrs`;
};

// Formats a date string into a localized format
export const formatDateTR = (dateString: string | null | undefined): string => {

  if (!dateString) {
    return '-';
  }

  return new Date(dateString).toLocaleDateString('tr-TR');
};
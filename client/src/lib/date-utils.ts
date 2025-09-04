// Simple Bikram Sambat date utilities
// Using basic conversion logic for demonstration
// In production, use a proper library like 'nepali-date' or 'bstojs'

interface BSDate {
  year: number;
  month: number;
  day: number;
}

const nepaliMonths = [
  "बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज",
  "कार्तिक", "मंसिर", "पौष", "माघ", "फाल्गुन", "चैत"
];

const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function adToBs(adDate: Date): BSDate {
  // Simplified conversion - in production use a proper library
  // This is a basic approximation
  const adYear = adDate.getFullYear();
  const adMonth = adDate.getMonth();
  const adDay = adDate.getDate();
  
  // Basic conversion (approximation)
  let bsYear = adYear + 57;
  let bsMonth = adMonth + 9;
  let bsDay = adDay;
  
  if (bsMonth > 12) {
    bsMonth -= 12;
    bsYear += 1;
  }
  
  // Adjust for mid-year offset
  if (adMonth < 4) {
    bsYear -= 1;
  }
  
  return { year: bsYear, month: bsMonth, day: bsDay };
}

export function bsToAd(bsDate: BSDate): Date {
  // Simplified conversion - in production use a proper library
  let adYear = bsDate.year - 57;
  let adMonth = bsDate.month - 9;
  
  if (adMonth < 0) {
    adMonth += 12;
    adYear -= 1;
  }
  
  if (bsDate.month >= 9) {
    adYear += 1;
  }
  
  return new Date(adYear, adMonth, bsDate.day);
}

export function formatBSDate(bsDate: BSDate): string {
  const nepaliYear = convertToNepaliDigits(bsDate.year.toString());
  const nepaliDay = convertToNepaliDigits(bsDate.day.toString());
  const monthName = nepaliMonths[bsDate.month - 1];
  
  return `${nepaliYear} साल ${monthName} ${nepaliDay} गते`;
}

export function convertToNepaliDigits(englishNumber: string): string {
  return englishNumber.split('').map(digit => nepaliDigits[parseInt(digit)] || digit).join('');
}

export function getCurrentBSDate(): BSDate {
  return adToBs(new Date());
}

export function getCurrentBSDateString(): string {
  return formatBSDate(getCurrentBSDate());
}

export function parseDateString(dateStr: string): Date {
  return new Date(dateStr);
}

export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

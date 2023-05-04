import moment from "moment";
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
// Import moment.js

// Function to format date in desired output
export function formatDateAgo(date: Date) {
  const now = moment();
  const diff = moment.duration(now.diff(date));

  if (diff.asDays() >= 1) {
    return `${Math.floor(diff.asDays())}d ago`;
  } else if (diff.asHours() >= 1) {
    return `${Math.floor(diff.asHours())}h ago`;
  } else if (diff.asMinutes() >= 1) {
    return `${Math.floor(diff.asMinutes())}m ago`;
  } else {
    return "just now";
  }
}

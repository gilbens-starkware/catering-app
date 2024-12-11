/// A simple utility function to export JSON data to CSV.
export const exportJSONToCSV = (jsonData: Object, fileName = 'data.csv') => {
  // 1. Convert JSON to an array of objects (if it's not already)
  const array = Array.isArray(jsonData) ? jsonData : [jsonData];

  // 2. Extract headers (keys) from the first object
  const headers = Object.keys(array[0]);

  // 3. Build the CSV content
  const csvRows = [
    headers.join(','), // Add header row
    ...array.map(row =>
      headers
        .map(header => JSON.stringify(row[header] || '')) // Escape and handle empty values
        .join(','),
    ),
  ];

  const csvContent = csvRows.join('\n');

  // 4. Create a Blob from the CSV string
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // 5. Create a download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = fileName;

  // 6. Programmatically trigger the download
  document.body.appendChild(link);
  link.click();

  // 7. Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

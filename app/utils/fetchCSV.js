export const fetchCSVData = async () => {
    const response = await fetch('/anime.csv'); // Ensure the CSV file is in the public folder
    const text = await response.text();
    
    const rows = text.trim().split('\n'); // Split rows and remove extra whitespace
    const headers = rows[0].split(','); // Use the first row as headers
  
    // Map each subsequent row to an object using the headers
    const data = rows.slice(1).map((row) => {
      const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Handle commas inside quotes
      return headers.reduce((acc, header, idx) => {
        acc[header] = values[idx].replace(/^"|"$/g, ''); // Remove surrounding quotes
        return acc;
      }, {});
    });
  
    return data;
  };
  
  
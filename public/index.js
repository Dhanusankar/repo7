document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('snippetForm');
  const searchTermInput = document.getElementById('searchTerm');
  const resultElement = document.getElementById('result');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchTerm = searchTermInput.value;
    try {
      const response = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchTerm })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data.result);

      resultElement.textContent = ''; // Clear previous content
      const preElement = document.createElement('pre');
      preElement.textContent = data.result;
      resultElement.appendChild(preElement);
    } catch (error) {
      console.error('Error fetching data:', error);
      resultElement.textContent = 'Error fetching data. Please try again later.';
    }
  });
});
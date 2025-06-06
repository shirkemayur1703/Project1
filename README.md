// dropdown.test.js

/**
 * @jest-environment jsdom
 */

test('should update output when dropdown selection changes', () => {
  // Set up DOM
  document.body.innerHTML = `
    <select id="fruit-select">
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
    </select>
    <div id="output"></div>
  `;

  // Attach event listener (simulate your JS behavior)
  document.getElementById('fruit-select').addEventListener('change', function (e) {
    document.getElementById('output').textContent = `You selected: ${e.target.value}`;
  });

  // Get the dropdown
  const select = document.getElementById('fruit-select');

  // Simulate selection
  select.value = 'banana';
  select.dispatchEvent(new Event('change'));

  // Assert output
  const output = document.getElementById('output');
  expect(output.textContent).toBe('You selected: banana');
});

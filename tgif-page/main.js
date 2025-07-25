const partyMap = {
  'D': 'Democrat',
  'R': 'Republican',
  'ID': 'Independent'
};

let originalData = [];

async function fetchData() {
  try {
    const response = await fetch('/src/pro-congress-117-senate.json');
    const data = await response.json();
    originalData = data;
    populateFilters(data);
    renderTable(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function renderTable(data) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  data.forEach(member => {
    const fullName = `${member.first_name} ${member.last_name}`;
    const website = member.url || '#';
    const partyFull = partyMap[member.party] || member.party;

    const row = `
      <tr>
        <td><a href="${website}" target="_blank" rel="noopener noreferrer">${fullName}</a></td>
        <td>${partyFull}</td>
        <td>${member.state}</td>
        <td>${member.title || ''}</td>
      </tr>
    `;

    tbody.innerHTML += row;
  });
}

function populateFilters(data) {
  const partyFilter = document.getElementById('partyFilter');
  const stateSelect = document.getElementById('stateFilter');

  partyFilter.innerHTML = '';
  stateSelect.innerHTML = '<option value="">All</option>';

  const partySet = new Set();
  const stateSet = new Set();

  data.forEach(member => {
    partySet.add(member.party);
    stateSet.add(member.state);
  });

  Array.from(partySet).sort().forEach(abbrev => {
    const fullName = partyMap[abbrev] || abbrev;
    const checkbox = `
      <div class="form-check form-check-inline">
        <input class="form-check-input party-checkbox" type="checkbox" value="${abbrev}" id="party-${abbrev}">
        <label class="form-check-label" for="party-${abbrev}">${fullName}</label>
      </div>
    `;
    partyFilter.innerHTML += checkbox;
  });

  Array.from(stateSet).sort().forEach(state => {
    stateSelect.innerHTML += `<option value="${state}">${state}</option>`;
  });

  document.querySelectorAll('.party-checkbox').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });
}

function applyFilters() {
  const selectedState = document.getElementById('stateFilter').value;

  const excludedParties = Array.from(document.querySelectorAll('.party-checkbox:checked'))
    .map(cb => cb.value);

  const filtered = originalData.filter(member => {
    const partyMatch = !excludedParties.includes(member.party);
    const stateMatch = !selectedState || member.state === selectedState;
    return partyMatch && stateMatch;
  });

  renderTable(filtered);
}


document.getElementById('stateFilter').addEventListener('change', applyFilters);

fetchData();


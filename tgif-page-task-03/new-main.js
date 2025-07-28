const partyMap = {
  'D': 'Democrat',
  'R': 'Republican',
  'ID': 'Independent'
};

let originalData = [];

document.addEventListener('DOMContentLoaded', () => {
  loadChamberData();
  document.getElementById('stateFilter').addEventListener('change', applyFilters);
});

async function loadChamberData() {
  const params = new URLSearchParams(window.location.search);
  let chamber = params.get('chamber');
  if (chamber !== 'house' && chamber !== 'senate') {
    chamber = 'senate';
  }

  try {
    const response = await fetch(`src/pro-congress-117-${chamber}.json`);
    const data = await response.json();

    const members = data.members || data.results?.[0]?.members || [];
    originalData = members;

    updateDescription(chamber);
    populateFilters(members);
    renderTable(members);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}


function updateHeader(chamber) {
  const title = document.getElementById('chamber-title');
  const desc = document.getElementById('chamber-description');

  if (chamber === 'house') {
    title.textContent = 'House of Representatives';
    desc.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  } else {
    title.textContent = 'Senate';
    desc.textContent = 'First convened in 1789, the composition and powers of the Senate are established in Article One of the U.S. Constitution. Each state is represented by two senators, regardless of population, who serve staggered six-year terms. The Senate has several exclusive powers not granted to the House, including consenting to treaties as a precondition to their ratification and consenting to or confirming appointments of Cabinet secretaries, federal judges, other federal executive officials, military officers, regulatory officials, ambassadors, and other federal uniformed officers, as well as trial of federal officials impeached by the House.';
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
  const selectedParties = Array.from(document.querySelectorAll('.party-checkbox:checked'))
    .map(cb => cb.value);

  const filtered = originalData.filter(member => {
    const partyMatch = selectedParties.length === 0 || selectedParties.includes(member.party);
    const stateMatch = !selectedState || member.state === selectedState;
    return partyMatch && stateMatch;
  });

  renderTable(filtered);
}


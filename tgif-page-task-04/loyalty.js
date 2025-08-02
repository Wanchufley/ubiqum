function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const partyMap = {
  'D': 'Democrat',
  'R': 'Republican',
  'ID': 'Independent'
};

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const chamber = params.get('chamber') === 'house' ? 'house' : 'senate';

  try {
    const response = await fetch(`src/pro-congress-117-${chamber}.json`);
    const data = await response.json();

    updateDescription(chamber);
    document.getElementById('chamber-title').textContent = `${capitalize(chamber)} at a Glance`;
    document.getElementById('loyalty-title').textContent = `${capitalize(chamber)} Loyalty`;

    const statistics = calculateStatistics(data);
    renderLoyaltyTable(statistics);
    populateLoyaltyTables(data);

  } catch (err) {
    console.error('Failed to load loyalty data:', err);
  }
});

function updateDescription(chamber) {
  const desc = document.getElementById('chamber-description');
  if (chamber === 'house') {
    desc.textContent = 'The House of Representatives members often vote with their parties. This table shows the average "votes with party" percentage for each party.';
  } else {
    desc.textContent = 'Senators tend to vote along party lines. This table shows the average "votes with party" percentage for each party.';
  }
}

function calculateStatistics(data) {
  const counts = { D: 0, R: 0, ID: 0 };
  const loyalty = { D: [], R: [], ID: [] };

  data.forEach(member => {
    if (counts.hasOwnProperty(member.party)) {
      counts[member.party]++;
      if (typeof member.votes_with_party_pct === 'number') {
        loyalty[member.party].push(member.votes_with_party_pct);
      }
    }
  });

  const loyaltyAverages = {};
  for (const party in loyalty) {
    if (loyalty[party].length === 0) {
      loyaltyAverages[party] = NaN;
    } else {
      const total = loyalty[party].reduce((sum, pct) => sum + pct, 0);
      loyaltyAverages[party] = total / loyalty[party].length;
    }
  }

  return {
    counts,
    loyaltyAverages
  };
}

function renderLoyaltyTable(statistics) {
  const tbody = document.getElementById('loyalty-body');
  tbody.innerHTML = '';

  for (const party in statistics.counts) {
    const numReps = statistics.counts[party];
    const loyalty = statistics.loyaltyAverages[party];

    const loyaltyDisplay = isNaN(loyalty) ? 'N/A' : `${loyalty.toFixed(2)}%`;

    const row = `
      <tr>
        <td>${partyMap[party] || party}</td>
        <td>${numReps}</td>
        <td>${loyaltyDisplay}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  }
}
function populateLoyaltyTables(data) {
  const filtered = data.filter(m => m.votes_with_party_pct != null);
  const sorted = [...filtered].sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct);
  const tenPercent = Math.ceil(sorted.length * 0.1);

  const leastLoyal = sorted.slice(0, tenPercent);
  const mostLoyal = sorted.slice(-tenPercent).reverse();

  fillLoyaltyTable('least-loyal', leastLoyal);
  fillLoyaltyTable('most-loyal', mostLoyal);
}

function fillLoyaltyTable(tableId, members) {
  const tbody = document.getElementById(tableId);
  tbody.innerHTML = '';

  members.forEach(member => {
    const fullName = `${member.first_name} ${member.middle_name || ''} ${member.last_name}`.trim();
    const row = `
      <tr>
        <td>${fullName}</td>
        <td>${member.total_votes}</td>
        <td>${member.votes_with_party_pct.toFixed(2)}%</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}



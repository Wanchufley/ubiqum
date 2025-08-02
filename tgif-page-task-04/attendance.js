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
  document.getElementById('attendance-title').textContent = `${capitalize(chamber)} Attendance`;


  try {
    const response = await fetch(`src/pro-congress-117-${chamber}.json`);
    const data = await response.json();

    updateDescription(chamber);
    const statistics = calculateStatistics(data);
    makeCountRows(statistics, data);
    populateEngagementTables(data);

  } catch (err) {
    console.error('Failed to load attendance data:', err);
  }
});

function updateDescription(chamber) {
  const title = document.getElementById('chamber-title');
  const desc = document.getElementById('chamber-description');

  if (chamber === 'house') {
    title.textContent = 'House of Representatives';
    desc.textContent = 'Members of the House serve two-year terms and represent districts based on population. The House has the exclusive power to initiate revenue bills, impeach federal officials, and elect the President in the case of an Electoral College tie.';
  } else {
    title.textContent = 'Senate';
    desc.textContent = 'Each state is represented by two senators, regardless of population, who serve staggered six-year terms. The Senate confirms presidential appointments and ratifies treaties.';
  }
}

function calculateStatistics(data) {
  const counts = { D: 0, R: 0, ID: 0 };

  data.forEach(member => {
    if (counts.hasOwnProperty(member.party)) {
      counts[member.party]++;
    }
  });

  return { counts };
}

function calculateWithPartyAverage(data, party) {
  const membersOfParty = data.filter(member => member.party === party && member.votes_with_party_pct != null);
  if (membersOfParty.length === 0) return 0;

  const total = membersOfParty.reduce((sum, member) => sum + member.votes_with_party_pct, 0);
  return total / membersOfParty.length;
}

function makeCountRows(statistics, data) {
  const tbody = document.getElementById('glance-body');
  tbody.innerHTML = '';

  for (const party in statistics.counts) {
    const numReps = statistics.counts[party];
    const withPartyAvg = calculateWithPartyAverage(data, party);

    const row = `
      <tr>
        <td>${partyMap[party] || party}</td>
        <td>${numReps}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  }
}

function populateEngagementTables(data) {
  const validMembers = data.filter(m =>
    m.missed_votes != null &&
    m.total_votes != null &&
    m.total_votes > 0 &&
    typeof m.missed_votes_pct === 'number'
  );

  console.log("Valid members with vote data:", validMembers.length);

  if (validMembers.length === 0) {
    console.warn("No valid members found with missed vote data.");
    return;
  }

  const tenPercent = Math.ceil(validMembers.length * 0.1);

  const leastEngaged = [...validMembers]
    .sort((a, b) => b.missed_votes_pct - a.missed_votes_pct)
    .slice(0, tenPercent);

  const mostEngaged = [...validMembers]
    .sort((a, b) => a.missed_votes_pct - b.missed_votes_pct)
    .slice(0, tenPercent);

  console.log("Most engaged sample:", mostEngaged.map(m => ({
    name: `${m.first_name} ${m.last_name}`,
    missed: m.missed_votes,
    pct: m.missed_votes_pct
  })));

  fillEngagementTable('least-engaged', leastEngaged);
  fillEngagementTable('most-engaged', mostEngaged);
}

function fillEngagementTable(tableId, members) {
  const tbody = document.getElementById(tableId);
  tbody.innerHTML = '';

  members.forEach(member => {
    const fullName = `${member.first_name} ${member.middle_name || ''} ${member.last_name}`.trim();
    const row = `
      <tr>
        <td>${fullName}</td>
        <td>${member.missed_votes} / ${member.total_votes}</td>
        <td>${member.missed_votes_pct?.toFixed(2) ?? 'N/A'}%</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}


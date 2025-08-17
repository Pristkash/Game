// Seeded random number generator for consistent fact selection
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

async function fetchHistory() {
    // Use UTC for consistent date across all users
    const today = new Date();
    const utcDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const dateKey = utcDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(utcDate);

    // Calculate next update time (midnight UTC next day)
    const nextUpdate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1));
    const nextUpdateFormatted = nextUpdate.toLocaleString('en-US', { 
        timeZone: 'UTC', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    });
    document.getElementById('next-update').textContent = `Next update: ${nextUpdateFormatted} UTC`;

    // Check localStorage for cached fact
    const cachedData = localStorage.getItem('historyFact');
    if (cachedData) {
        const { date, fact } = JSON.parse(cachedData);
        if (date === dateKey) {
            document.getElementById('history-title').textContent = `THIS DAY IN HISTORY: ${formattedDate}`;
            document.getElementById('history-fact').innerHTML = `${formattedDate}: ${fact}`;
            return;
        }
    }

    // Fetch new fact
    const month = utcDate.getUTCMonth() + 1;
    const day = utcDate.getUTCDate();
    const url = `https://history.muffinlabs.com/date/${month}/${day}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Use seeded random to pick the same fact for all users on this date
        const events = data.data.Events;
        let factText = 'No historical events found for this day.';
        if (events && events.length > 0) {
            // Generate a seed based on the date
            const seed = parseInt(dateKey.replace(/-/g, ''), 10);
            const randomIndex = Math.floor(seededRandom(seed) * events.length);
            const fact = events[randomIndex];
            factText = `${fact.year}: ${fact.text}`;
        }

        // Update DOM
        document.getElementById('history-title').textContent = `THIS DAY IN HISTORY: ${formattedDate}`;
        document.getElementById('history-fact').innerHTML = `${formattedDate}: ${factText}`;

        // Cache the fact
        localStorage.setItem('historyFact', JSON.stringify({ date: dateKey, fact: factText }));
    } catch (error) {
        console.error('Error fetching history:', error);
        document.getElementById('history-fact').textContent = 'Failed to load historical fact.';
    }
}

// Call the function
fetchHistory();

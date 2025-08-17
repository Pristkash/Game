async function fetchHistory() {
    const today = new Date();
    const dateKey = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(today);

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

    // Fetch new fact if no valid cache
    const url = `https://history.muffinlabs.com/date/${month}/${day}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Pick a random event
        const events = data.data.Events;
        let factText = 'No historical events found for this day.';
        if (events && events.length > 0) {
            const randomIndex = Math.floor(Math.random() * events.length);
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

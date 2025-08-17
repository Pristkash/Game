async function fetchHistory() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const url = `https://history.muffinlabs.com/date/${month}/${day}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Update title
        document.getElementById('history-title').textContent = `This Day in History - ${data.date}`;

        // Pick a random event for variety
        const events = data.data.Events;
        if (events && events.length > 0) {
            const randomIndex = Math.floor(Math.random() * events.length);
            const fact = events[randomIndex];
            document.getElementById('history-fact').innerHTML = `${fact.year}: ${fact.text}`;
        } else {
            document.getElementById('history-fact').textContent = 'No historical events found for this day.';
        }
    } catch (error) {
        console.error('Error fetching history:', error);
        document.getElementById('history-fact').textContent = 'Failed to load historical fact.';
    }
}

// Call the function
fetchHistory();

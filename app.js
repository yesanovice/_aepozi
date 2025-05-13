// Current year for footer
document.getElementById('year').textContent = new Date().getFullYear();

const writingsContainer = document.getElementById('writings-container');

// Function to load writings from JSON file
async function loadWritings() {
  try {
    const response = await fetch('writings.json');
    
    if (!response.ok) {
      throw new Error('Failed to load writings');
    }
    
    const writings = await response.json();
    displayWritings(writings);
    
  } catch (error) {
    console.error('Error loading writings:', error);
    writingsContainer.innerHTML = `
      <div class="error-message">
        <p>Failed to load writings. Please try again later.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}

function displayWritings(writings) {
  writingsContainer.innerHTML = '';
  
  if (!writings || writings.length === 0) {
    writingsContainer.innerHTML = `
      <div class="empty-message">
        <p>No writings found. The ink has dried... for now.</p>
      </div>
    `;
    return;
  }
  
  writings.forEach(writing => {
    const writingCard = document.createElement('div');
    writingCard.className = 'writing-card';
    writingCard.innerHTML = `
      <img src="${writing.cover}" alt="${writing.title}" class="writing-cover" onerror="this.src='assets/images/default-cover.jpg'">
      <div class="writing-info">
        <h3 class="writing-title">${writing.title}</h3>
        <p class="writing-description">${writing.description}</p>
        <div class="writing-meta">
          <span>${writing.type}</span>
          <span>${formatDate(writing.date)}</span>
        </div>
        <a href="${writing.file}" class="download-btn" download>Download</a>
      </div>
    `;
    writingsContainer.appendChild(writingCard);
  });
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Initialize the app
loadWritings();

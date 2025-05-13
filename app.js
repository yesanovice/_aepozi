// Current year for footer
document.getElementById('year').textContent = new Date().getFullYear();

const writingsContainer = document.getElementById('writings-container');
const DEFAULT_COVER = 'default-cover.jpg'; // Make sure this exists in root

// Function to load writings from JSON file
async function loadWritings() {
  try {
    const response = await fetch('writings.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const writings = await response.json();
    displayWritings(writings);
    
  } catch (error) {
    console.error('Error loading writings:', error);
    writingsContainer.innerHTML = `
      <div class="error-message">
        <p>Failed to load writings. Please try again later.</p>
        <small>${error.message}</small>
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
      <img src="${writing.cover}" alt="${writing.title}" class="writing-cover" 
           onerror="this.onerror=null;this.src='${DEFAULT_COVER}'">
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
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch {
    return dateString; // Fallback if date is invalid
  }
}

// Register Service Worker with scope set to root
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
      .then(registration => {
        console.log('SW registered:', registration.scope);
      })
      .catch(err => {
        console.log('SW registration failed:', err);
      });
  });
}

// Initialize the app
loadWritings();

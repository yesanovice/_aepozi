// Current year for footer
document.getElementById('year').textContent = new Date().getFullYear();

const writingsContainer = document.getElementById('writings-container');
const DEFAULT_COVER = 'default-cover.jpg';

// Function to load writings from JSON file
async function loadWritings() {
  try {
    const response = await fetch('./writings.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load writings (Status: ${response.status})`);
    }
    
    const writings = await response.json();
    if (!writings || writings.length === 0) {
      showEmptyState();
      return;
    }
    displayWritings(writings);
    
  } catch (error) {
    showErrorState(error);
  }
}

function displayWritings(writings) {
  writingsContainer.innerHTML = '';
  
  writings.forEach(writing => {
    const writingCard = document.createElement('div');
    writingCard.className = 'writing-card';
    
    // Fixed image handling with absolute paths
    const coverPath = writing.cover ? `./${writing.cover}` : `./${DEFAULT_COVER}`;
    const pdfPath = `./${writing.file}`;
    
    writingCard.innerHTML = `
      <img src="${coverPath}" 
           alt="${writing.title}" 
           class="writing-cover"
           onerror="this.onerror=null;this.src='./${DEFAULT_COVER}'">
      <div class="writing-info">
        <h3 class="writing-title">${writing.title}</h3>
        <p class="writing-description">${writing.description}</p>
        <div class="writing-meta">
          <span>${writing.type}</span>
          <span>${formatDate(writing.date)}</span>
        </div>
        <a href="${pdfPath}" class="download-btn" download>Download</a>
      </div>
    `;
    writingsContainer.appendChild(writingCard);
  });
}

function showEmptyState() {
  writingsContainer.innerHTML = `
    <div class="empty-message">
      <p>No writings found. The ink has dried... for now.</p>
    </div>
  `;
}

function showErrorState(error) {
  console.error('Error:', error);
  writingsContainer.innerHTML = `
    <div class="error-message">
      <p>Failed to load content. Please refresh.</p>
      <small>${error.message}</small>
    </div>
  `;
}

function formatDate(dateString) {
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch {
    return dateString;
  }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('SW registered:', registration.scope);
      })
      .catch(err => {
        console.log('SW registration failed:', err);
      });
  });
}

// Initialize
loadWritings();

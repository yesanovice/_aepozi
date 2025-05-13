// Current year for footer
document.getElementById('year').textContent = new Date().getFullYear();

// Writings data - in a real scenario, you might fetch this from a JSON file
// For GitHub hosting, we'll scan the writings directory
const writingsContainer = document.getElementById('writings-container');

// Function to fetch all writings from the assets/writings directory
async function loadWritings() {
  try {
    // In GitHub Pages, we can't actually scan directories, so we'll need a different approach
    // Option 1: Create a writings.json file that lists all your writings (best approach)
    // Option 2: Manually list them here (simpler but less maintainable)
    
    // For this example, I'll use Option 2 - you should replace this with your actual writings
    const writings = [
      {
        id: 'whispers-in-the-dark',
        title: 'Whispers in the Dark',
        description: 'A collection of midnight thoughts and shadowed verses',
        cover: 'assets/images/whispers-cover.jpg',
        file: 'assets/writings/whispers-in-the-dark.pdf',
        date: '2023-10-15',
        type: 'Collection'
      },
      {
        id: 'lunar-elegies',
        title: 'Lunar Elegies',
        description: 'Poems written under the silver gaze of the moon',
        cover: 'assets/images/lunar-cover.jpg',
        file: 'assets/writings/lunar-elegies.pdf',
        date: '2023-08-22',
        type: 'Poetry'
      }
      // Add more writings as needed
    ];
    
    displayWritings(writings);
    
    // If you choose Option 1 (recommended), you would:
    // 1. Create a writings.json file in your repo
    // 2. Use fetch to get it:
    // const response = await fetch('assets/writings.json');
    // const writings = await response.json();
    // displayWritings(writings);
    
  } catch (error) {
    console.error('Error loading writings:', error);
    writingsContainer.innerHTML = `
      <div class="error-message">
        <p>Failed to load writings. Please try again later.</p>
      </div>
    `;
  }
}

function displayWritings(writings) {
  writingsContainer.innerHTML = '';
  
  if (writings.length === 0) {
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
      <img src="${writing.cover}" alt="${writing.title}" class="writing-cover">
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

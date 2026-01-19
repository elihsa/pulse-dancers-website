// Dynamically load banner image from CMS
async function loadBannerImage() {
  try {
    // Fetch HOME sheet data from Google Sheets API
    const response = await fetch('/api/sheets?sheetName=HOME&startRow=1&endRow=20');
    
    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('[Banner] Could not load banner from CMS, using default:', response.status);
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Look for topBannerImage in the data (it's a key-value format)
    let bannerImageUrl = null;
    
    if (data.values && data.values.length > 0) {
      // Search for the topBannerImage row
      for (let row of data.values) {
        if (row[0] === 'topBannerImage' && row[1]) {
          bannerImageUrl = row[1];
          break;
        }
      }
    }
    
    // Find the banner image element and update src
    const bannerImage = document.querySelector('.top-banner');
    if (bannerImage && bannerImageUrl) {
      bannerImage.src = bannerImageUrl;
      bannerImage.alt = 'Pulse Male Revue Top Banner';
      console.log('[Banner] Loaded from CMS:', bannerImageUrl);
    } else if (bannerImage) {
      // Set default banner
      bannerImage.src = 'assets/images/top.png';
      bannerImage.alt = 'Pulse Male Revue Top Banner';
    }
  } catch (error) {
    console.warn('[Banner] Using default banner image');
    // Fallback to default if CMS fails
    const bannerImage = document.querySelector('.top-banner');
    if (bannerImage) {
      bannerImage.src = 'assets/images/top.png';
      bannerImage.alt = 'Pulse Male Revue Top Banner';
    }
  }
}

// Load banner when page loads
document.addEventListener('DOMContentLoaded', loadBannerImage);

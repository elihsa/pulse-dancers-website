// Dynamically load banner image from CMS
async function loadBannerImage() {
  try {
    // Fetch HOME sheet data from Google Sheets API
    const response = await fetch('/api/sheets?sheetName=HOME&startRow=1&endRow=5');
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract banner image URL from row 5 (topBannerImage)
    if (data.values && data.values[4] && data.values[4][1]) {
      const bannerImageUrl = data.values[4][1];
      
      // Find the banner image element and update src
      const bannerImage = document.querySelector('.top-banner');
      if (bannerImage && bannerImageUrl) {
        bannerImage.src = bannerImageUrl;
        bannerImage.alt = 'Pulse Male Revue Top Banner';
      }
    }
  } catch (error) {
    console.error('Error loading banner image from CMS:', error);
    // Fallback to default if CMS fails
    const bannerImage = document.querySelector('.top-banner');
    if (bannerImage && !bannerImage.src.includes('assets/images/top.png')) {
      bannerImage.src = 'assets/images/top.png';
    }
  }
}

// Load banner when page loads
document.addEventListener('DOMContentLoaded', loadBannerImage);

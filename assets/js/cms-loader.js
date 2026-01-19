// CMS Content Loader - Loads dynamic content from Google Sheets CMS
// This script loads footer and common elements that appear across all pages

async function loadFooterContent() {
  // Check if PulseSheetsCMS is available
  if (typeof PulseSheetsCMS === 'undefined') {
    console.warn('PulseSheetsCMS not loaded yet, retrying footer load...');
    // Retry after a short delay
    setTimeout(loadFooterContent, 100);
    return;
  }

  try {
    const footerData = await PulseSheetsCMS.getFooter();
    
    // Update footer elements if they exist and have CMS data
    const footerCopyright = document.getElementById('footer-copyright');
    const footerEmail = document.getElementById('footer-email');
    const footerFacebook = document.getElementById('footer-facebook');
    const footerInstagram = document.getElementById('footer-instagram');
    
    if (footerData.copyright && footerCopyright) {
      footerCopyright.textContent = footerData.copyright;
    }
    
    if (footerData.email && footerEmail) {
      footerEmail.textContent = footerData.email;
      footerEmail.href = `mailto:${footerData.email}`;
    }
    
    if (footerData.facebookURL && footerFacebook) {
      footerFacebook.href = footerData.facebookURL;
    }
    
    if (footerData.facebookText && footerFacebook) {
      footerFacebook.textContent = footerData.facebookText;
    }
    
    if (footerData.instagramURL && footerInstagram) {
      footerInstagram.href = footerData.instagramURL;
    }
    
    if (footerData.instagramText && footerInstagram) {
      footerInstagram.textContent = footerData.instagramText;
    }
  } catch (error) {
    console.error('Error loading footer content:', error);
    // Keep default footer content if CMS fails
  }
}

// Load footer content when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFooterContent);
} else {
  loadFooterContent();
}

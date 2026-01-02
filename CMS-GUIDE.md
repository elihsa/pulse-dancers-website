# CMS Guide for Pulse Dancers Website

## Accessing the CMS

1. Go to: `https://yourdomain.com/admin/` (or `http://localhost:8000/admin/` for local testing)
2. Log in with your Netlify Identity credentials
3. Once logged in, you'll see the CMS dashboard

## Managing Content

### Home Page
- **Location:** Home Page > Home Content
- **What you can edit:**
  - Hero title and subtitle (main banner text)
  - Call-to-action button text and link
  - About section title and paragraphs
  - Services list
  - Hero statistics

### Performers (Team Members)
- **Location:** Performers > Team Members
- **How to add a new performer:**
  1. Click on "Performers" in the left sidebar
  2. Click "Team Members"
  3. Scroll to the "Performers" section
  4. Click "Add Performers"
  5. Fill in the details:
     - **Name:** Full name or stage name
     - **Stage Name:** Optional nickname (e.g., "Thunder")
     - **Photo:** Click "Choose an image" to upload a photo
     - **Bio:** Short description about the performer
     - **Specialties:** What they're good at (e.g., "Contemporary dance, crowd interaction")
     - **Active:** Toggle on/off to show/hide the performer on the website
  6. Click "Save"
  7. Click "Publish" to make changes live

### Pricing
- **Location:** Pricing > Pricing Table
- **What you can edit:**
  - Service names, durations, and prices
  - Notes for each service
  - General notes at the bottom

### FAQ
- **Location:** FAQ > FAQ Content
- **How to add a new question:**
  1. Click on a group (e.g., "General")
  2. Click "Add Questions & Answers"
  3. Enter the question and answer
  4. Click "Save" then "Publish"

### Social Media
- **Location:** Social Media > Social Links
- **What you can edit:**
  - Facebook page URL
  - Instagram username
  - Instagram post URLs to feature on homepage

### Testimonials
- **Location:** Testimonials > Testimonials
- **How to add a testimonial:**
  1. Click "Add Testimonial Items"
  2. Fill in name, rating (1-5), text, location, and date
  3. Click "Save" then "Publish"

## Adding Images

### Hero Image (Top of Homepage)
1. Go to: Home Page > Home Content
2. Scroll down (if there's a hero image field)
3. Click "Choose an image"
4. Either:
   - Upload a new image from your computer
   - Select an existing image from the media library
5. Click "Save" then "Publish"

### Logo
The logo is currently text-based ("PULSE" in the header). To add an actual logo image:
1. You would need to ask a developer to modify the code
2. Alternatively, the logo can be added via CSS as a background image

### Performer Photos
1. Go to: Performers > Team Members
2. Click on a performer or add a new one
3. In the "Photo" field, click "Choose an image"
4. Upload the photo from your computer
5. The image will be automatically saved to `/assets/images/uploads/`
6. Click "Save" then "Publish"

## Tips

- **Always click "Publish"** after saving changes to make them live
- **Image sizes:** Keep images under 2MB for faster loading
- **Recommended photo dimensions for performers:** 400x600 pixels (portrait)
- **Test locally first:** If possible, test changes on a staging site before publishing
- **Backup:** The CMS saves all changes to GitHub, so you can always revert if needed

## Troubleshooting

- **Can't log in?** Make sure you've been invited via Netlify Identity
- **Changes not showing?** Clear your browser cache or try incognito mode
- **Image not uploading?** Check file size (must be under 5MB)
- **Need help?** Contact your web developer

## Need to Edit the Logo or Hero Image?

Currently, these elements require code changes:

### Logo:
The logo in the header is the text "PULSE". To use an image logo:
1. Upload your logo to `/assets/images/`
2. Contact your developer to update the header code

### Hero Image (Homepage Banner):
To add a background image to the hero section:
1. Upload your image to `/assets/images/`
2. The developer can add it as a background image via CSS or add a field to the CMS

Would you like me to add these features to make them CMS-editable?

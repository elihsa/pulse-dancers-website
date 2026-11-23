// Only fields supplied by this submitter are eligible for their receipt.
// Never serialize arbitrary request keys, stored rows, admin status or image bytes.
const BOOKING = [
 ['name','Name'],['email','Email'],['phone','Phone'],['eventType','Event type'],
 ['eventDate','Event date'],['eventTime','Event time'],['guestCount','Guest count'],
 ['managing','Managing the event'],['managerName','Manager name'],['managerPhone','Manager phone'],
 ['managerEmail','Manager email'],['locType','Location type'],['address','Address'],['area','Area'],
 ['distanceKm','Distance (km)'],['services','Services'],['maleCount','Male performers'],
 ['showType','Show type'],['race','Performer preference'],['costume','Costume'],
 ['femaleCount','Female performers'],['waiterCount','Waiters'],['waiterHours','Waiter hours'],
 ['butlerCount','Butlers'],['butlerHours','Butler hours'],['gamesQty','Games'],['poleQty','Pole shows'],
 ['otherText','Other requests'],['notes','Your notes']
];
const JOIN = [
 ['firstName','First name'],['lastName','Last name'],['email','Email'],['phone','Phone'],
 ['birthMonth','Birth month'],['birthDay','Birth day'],['birthYear','Birth year'],
 ['streetAddress','Street address'],['city','City'],['instagram','Instagram'],
 ['height','Height (cm)'],['weight','Weight (kg)'],['waist','Waist (cm)'],['chest','Chest (cm)'],
 ['shoeSize','Shoe size'],['hairColor','Hair colour'],['eyeColor','Eye colour'],
 ['ethnicity','Ethnicity'],['bodyType','Body type'],['tattoos','Tattoos'],
 ['preference','Work preferences'],['danceExperience','Dance experience'],
 ['promoExperience','Promotional experience'],['transport','Transport'],['gymLocation','Gym'],
 ['otherWork','Other work'],['skills','Skills'],['imageFilter','Photo filter']
];
const FIELDS = {
 booking_confirmation: BOOKING,
 join_confirmation: JOIN,
 contact_confirmation: [['name','Name'],['email','Email'],['phone','Phone'],['subject','Subject'],['message','Message']],
 testimonial_confirmation: [['name','Name'],['email','Email'],['area','Area'],['rating','Rating'],['message','Testimonial']]
};
function clean(value) {
 if (Array.isArray(value)) return value.map(clean).filter(Boolean).join(', ');
 if (!['string','number','boolean'].includes(typeof value)) return '';
 // Keep user-written multiline answers readable without allowing fake field labels.
 return String(value).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').trim();
}
export function submissionSummary(key, fields = {}, uploads = {}) {
 const serviceNames = {male:'Male Stripper',female:'Female Stripper',waiter:'Topless Waiter',butler:'Bottomless Butler',games:'Games',pole:'Pole Dancer',other:'Something else'};
 const selected = Array.isArray(fields.services) ? fields.services : String(fields.services || '').split(',').map(s=>s.trim());
 const serviceFields = {maleCount:'male',showType:'male',race:'male',costume:'male',femaleCount:'female',waiterCount:'waiter',waiterHours:'waiter',butlerCount:'butler',butlerHours:'butler',gamesQty:'games',poleQty:'pole',otherText:'other'};
 const lines = (FIELDS[key] || []).flatMap(([name,label]) => {
  if (key === 'booking_confirmation' && serviceFields[name] && !selected.includes(serviceFields[name])) return [];
  let value = clean(fields[name]);
  if (key === 'booking_confirmation' && name === 'services') value = selected.map(s=>serviceNames[s] || s).join(', ');
  if (key === 'booking_confirmation' && name === 'showType') value = ({full:'Full show (20 mins)',xpress:'Xpress show (13 mins)'})[value] || value;
  if (key === 'booking_confirmation' && name === 'managing') value = ({'No': "Yes, I'm managing it",'Yes, but im not managing it.':'No, someone else is managing it'})[value] || value;
  if (key === 'booking_confirmation' && name === 'locType') value = ({area:'Area only',exact:'Exact address',address:'Exact address'})[value] || value;
  return value ? [`${label}: ${value.replace(/\r?\n/g,'\n  ')}`] : [];
 });
 if (key === 'join_confirmation') {
  for (const [field,label] of [['fullBodyShot','Full-body photo'],['fullFacePhoto','Face photo']]) {
   if (uploads[field]) lines.push(`${label}: received`);
  }
 }
 return 'This is the information you provided:\n' + (lines.join('\n') || 'No additional details supplied.');
}

// Enforce ordering even for existing CMS copy without the new placeholder.
export function composeCustomerReceipt(body, firstName, summary) {
 const greeting = `Hi ${firstName},`;
 let rest = String(body).replace(/^\s*Hi\s+[^\n]*,\s*\n*/i,'').replace(/\{submissionSummary\}/g,'').trim();
 return `${greeting}\n\n${summary}\n\n${rest}`;
}

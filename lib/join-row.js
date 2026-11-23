// Existing columns A:T are stable. New form detail is appended at U:AF.
export const JOIN_DETAIL_FIELDS = [
  'instagram', 'height', 'weight', 'waist', 'chest', 'shoeSize',
  'hairColor', 'eyeColor', 'ethnicity', 'bodyType', 'tattoos', 'imageFilter'
];
const asText = value => value ? "'" + String(value) : '';
export function buildJoinRow(fields, uploadedFiles, timestamp, preferences) {
  return [
      timestamp,
      fields.firstName,
      fields.lastName,
      fields.birthMonth || '',
      fields.birthDay || '',
      fields.birthYear || '',
      fields.streetAddress || '',
      fields.city || '',
      fields.email,
      asText(fields.phone),
      preferences,
      fields.danceExperience || 'Not answered',
      fields.promoExperience || 'Not answered',
      fields.transport || 'Not answered',
      fields.gymLocation || 'Not specified',
      fields.otherWork || 'Not specified',
      fields.skills || 'Not specified',
      uploadedFiles['fullBodyShot'] || '',
      uploadedFiles['fullFacePhoto'] || '',
      'Pending', // Status remains column T
      ...JOIN_DETAIL_FIELDS.map(name => fields[name] || '')
    ];
}

export function getPlaceActions(place = {}, { hideMap = false } = {}) {
  const mapHref = hideMap ? null : place.mapUrl ||
    (place.address ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place.address) : null)
  const phone = place.phone?.replace(/[^\d+]/g, '')
  return [
    mapHref && { kind: 'map', href: mapHref, title: 'Google Maps', label: 'Google Maps', external: true },
    place.website && { kind: 'website', href: place.website, title: 'Ιστοσελίδα', label: 'Ιστοσελίδα', external: true },
    phone && { kind: 'phone', href: 'tel:' + phone, title: 'Κλήση', label: 'Κλήση' },
    place.email && { kind: 'email', href: 'mailto:' + place.email, title: 'Email', label: 'Email' },
  ].filter(Boolean)
}


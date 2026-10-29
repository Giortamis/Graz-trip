import { MapPin, Globe, Phone, Mail } from 'lucide-react'
import { getPlaceActions } from './place-actions.js'

const icons = { map: MapPin, website: Globe, phone: Phone, email: Mail }

export default function PlaceActions({ place, hideMap = false }) {
  const actions = getPlaceActions(place, { hideMap })
  if (!actions.length) return null

  return (
    <div className="place-actions" role="group" aria-label={'Ενέργειες: ' + place.name}>
      {actions.map(action => {
        const Icon = icons[action.kind]
        return (
          <a key={action.kind} href={action.href}
            target={action.external ? '_blank' : undefined}
            rel={action.external ? 'noreferrer' : undefined}
            aria-label={action.label + ': ' + place.name}
            title={action.title}>
            <Icon size={18} strokeWidth={2} aria-hidden="true" />
          </a>
        )
      })}
    </div>
  )
}


'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  latitude: number
  longitude: number
  title?: string
  description?: string
}

export function Map({ latitude, longitude, title, description }: MapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Dynamically import and set up Leaflet only on client
    const setupLeaflet = async () => {
      const L = await import('leaflet')

      // Fix for default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
    }

    setupLeaflet()
  }, [])

  if (!isClient) {
    return (
      <div className="h-[400px] w-full rounded-lg bg-foreground/5 flex items-center justify-center">
        <p className="text-foreground/60">Loading map...</p>
      </div>
    )
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        {(title || description) && (
          <Popup>
            {title && <strong>{title}</strong>}
            {description && <p>{description}</p>}
          </Popup>
        )}
      </Marker>
    </MapContainer>
  )
}

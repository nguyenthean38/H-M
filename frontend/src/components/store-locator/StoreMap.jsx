import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'

// Nền xám nhạt không nhãn chữ của Esri: miễn phí, không cần API key, hợp tông giấy của Nếp.
const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
const ATTRIBUTION = 'Tiles &copy; Esri — Esri, HERE, Garmin, &copy; OpenStreetMap contributors'
const VN_CENTER = [15.9, 106.4]

/** Ghim cửa hàng: ô vuông chàm gấp góc, chữ trắng; ghim đang chọn to hơn và màu mực. */
function pinIcon(label, active) {
  const size = active ? 38 : 28
  const fill = active ? '#1b1a17' : '#24357a'
  const fold = active ? '#9a948a' : '#8d9bd6'
  const f = Math.round(size * 0.28)
  const html = `
    <div style="position:relative;width:${size}px;height:${size}px;filter:drop-shadow(0 4px 6px rgba(27,26,23,.3))">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
        <path d="M0 0H${size - f}L${size} ${f}V${size}H0Z" fill="${fill}"/>
        <path d="M${size - f} 0V${f}H${size}Z" fill="${fold}"/>
      </svg>
      <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#f5f1ea;font:600 ${active ? 13 : 11}px 'Be Vietnam Pro',sans-serif">${label}</span>
    </div>`
  return L.divIcon({ className: 'nep-pin', html, iconSize: [size, size], iconAnchor: [size / 2, size], tooltipAnchor: [0, -size] })
}

function FitBounds({ stores, padding = 48 }) {
  const map = useMap()
  const key = stores.map((s) => s.id).join(',')
  useEffect(() => {
    if (!stores.length) return
    if (stores.length === 1) {
      map.setView([stores[0].lat, stores[0].lng], 15)
      return
    }
    map.fitBounds(L.latLngBounds(stores.map((s) => [s.lat, s.lng])), { padding: [padding, padding], maxZoom: 14 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map])
  return null
}

function FlyTo({ store }) {
  const map = useMap()
  useEffect(() => {
    if (store) map.flyTo([store.lat, store.lng], Math.max(map.getZoom(), 15), { duration: 0.8 })
  }, [store, map])
  return null
}

/**
 * Bản đồ cửa hàng (Leaflet + nền Esri xám nhạt).
 * - `stores`: danh sách cửa hàng có lat/lng
 * - `activeId`, `onSelect`: đồng bộ với danh sách bên cạnh
 * - `focus`: chỉ hiện 1 cửa hàng (trang chi tiết)
 */
export function StoreMap({ stores = [], activeId, onSelect, className, fit = true, zoom = 6, center }) {
  const active = useMemo(() => stores.find((s) => s.id === activeId) ?? null, [stores, activeId])
  return (
    <MapContainer
      center={center ?? (stores[0] ? [stores[0].lat, stores[0].lng] : VN_CENTER)}
      zoom={zoom}
      scrollWheelZoom={false}
      className={className}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url={TILE_URL} attribution={ATTRIBUTION} maxZoom={16} />
      {fit && <FitBounds stores={stores} />}
      <FlyTo store={active} />
      {stores.map((s, i) => (
        <Marker
          key={s.id}
          position={[s.lat, s.lng]}
          icon={pinIcon(stores.length > 1 ? i + 1 : 'n', s.id === activeId)}
          zIndexOffset={s.id === activeId ? 1000 : 0}
          eventHandlers={{ click: () => onSelect?.(s.id) }}
          keyboard
          title={s.name}
        >
          <Tooltip direction="top" offset={[0, -4]}>
            <span className="text-xs font-semibold">{s.name}</span>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  )
}

export const directionsUrl = (s) => `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`

import { View, Text, StyleSheet } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { MapPin } from 'lucide-react-native'
import { getRegionCoords } from '@/lib/regionCoordinates'

interface Props {
  regionName: string | null | undefined
  label?: string
  height?: number
}

export default function LocationMap({ regionName, label, height = 180 }: Props) {
  const coords = getRegionCoords(regionName)

  return (
    <View style={[s.container, { height }]}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        region={coords}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <Marker
          coordinate={{ latitude: coords.latitude, longitude: coords.longitude }}
          title={label || regionName || 'Location'}
        />
      </MapView>
      {regionName && (
        <View style={s.badge}>
          <MapPin size={10} color="#059669" />
          <Text style={s.badgeText}>{regionName}</Text>
        </View>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, color: '#374151', fontWeight: '600' },
})

import { DrumPad } from './DrumPad'
import { createFeature } from '../core'

export default createFeature({
  name: 'drum-pad',
  category: 'instruments',
  description:
    'A touchscreen drum pad with variable velocity. Touching nearer the center produces louder hits.',
  instruments: [
    {
      id: 'drums',
      sortKey: '201_drums',
      name: 'Drum pad',
      description:
        'A drum pad with variable velocity. Touching nearer the center produces louder hits.',
      component: DrumPad,
    },
  ],
})

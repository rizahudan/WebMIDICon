import React, { useMemo } from 'react'
import { FC, ReactNode } from 'react'
import { useConfiguration } from '../core'

interface ButtonMapping {
  name: string
  note: number
}

const buttons: ButtonMapping[] = [
  { name: 'Ride Edge / Chinese Cymbal', note: 52 },
  { name: 'Ride Bell', note: 53 },
  { name: 'Crash Cymbal 1', note: 57 },
  { name: 'Crash Cymbal 2', note: 49 },

  { name: 'Hi-Mid Tom', note: 48 },
  { name: 'Low Tom', note: 45 },
  { name: 'Low Floor Tom', note: 41 },
  { name: 'Ride In', note: 59 },

  { name: 'Kick', note: 36 },
  { name: 'Acoustic Snare', note: 38 },
  { name: 'Closed Hi-Hat', note: 42 },
  { name: 'Open Hi-Hat', note: 46 },

  { name: 'Kick', note: 36 },
  { name: 'Sidestick', note: 37 },
  { name: 'Kick', note: 36 },
  { name: 'Kick', note: 36 },
]

interface DrumButtonMapping {
  children: (buttons: ButtonMapping[]) => ReactNode
}

export function GetAllDrumpadButtonMapping() {
  const notes = [
    { name: 'Acoustic Bass Drum', note: 35 },
    { name: 'Kick', note: 36 },
    { name: 'Sidestick', note: 37 },
    { name: 'Acoustic Snare', note: 38 },
    { name: 'Hand Clap', note: 39 },
    { name: 'Electric Snare', note: 40 },

    { name: 'Low Floor Tom', note: 41 },
    { name: 'Closed Hi-Hat', note: 42 },
    { name: 'High Floor Tom', note: 43 },
    { name: 'Pedal Hi-Hat', note: 44 },
    { name: 'Low Tom', note: 45 },
    { name: 'Open Hi-Hat', note: 46 },
    { name: 'Low-Mid Tom', note: 47 },
    { name: 'Hi-Mid Tom', note: 48 },
    { name: 'Crash Cymbal 2', note: 49 },
    { name: 'High Tom', note: 50 },

    { name: 'Ride Cymbal 1', note: 51 },
    { name: 'Ride Edge / Chinese Cymbal', note: 52 },
    { name: 'Ride Bell', note: 53 },
    { name: 'Tambourine', note: 54 },
    { name: 'Splash Cymbal', note: 55 },
    { name: 'Cowbell', note: 56 },
    { name: 'Crash Cymbal 1', note: 57 },
    { name: 'Vibraslap', note: 58 },
    { name: 'Ride In', note: 59 },
    { name: 'Hi Bongo', note: 60 },
    
    { name: 'Low Bongo', note: 61 },
    { name: 'Mute Hi Conga', note: 62 },
    { name: 'Open Hi Conga', note: 63 },
    { name: 'Low Conga', note: 64 },
    { name: 'High Timbale', note: 65 },
    { name: 'Low Timbale', note: 66 },
    { name: 'High Agogo', note: 67 },
    { name: 'Low Agogo', note: 68 },
    { name: 'Cabasa', note: 69 },
    { name: 'Maracas', note: 70 },

    { name: 'Short Whistle', note: 71 },
    { name: 'Long Whistle', note: 72 },
    { name: 'Short Guiro', note: 73 },
    { name: 'Long Guiro', note: 74 },
    { name: 'Claves', note: 75 },
    { name: 'Hi Wood Block', note: 76 },
    { name: 'Low Wood Block', note: 77 },
    { name: 'Mute Cuica', note: 78 },
    { name: 'Open Cuica', note: 79 },
    { name: 'Mute Triangle', note: 80 },

    { name: 'Open Triangle', note: 81 },
  ]
  return [{ name: 'Select Notes', note: 0 }, ...notes.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))]
}

export function GetDrumButtonMapping() {
  const buttonOverride =
    useConfiguration<string>('drumPad.buttonOverride').value || ''
  const mappedButtons = useMemo(() => {
    const result = [...buttons]
    buttonOverride.replace(
      /(\d+)\s*=\s*(\d+)\s*,\s*([^;]+)/g,
      (_all, num, noteStr, name) => {
        const index = +num - 1
        const note = +noteStr
        // console.log(index, note, name)
        if (index >= 0 && index < result.length && note > 0 && note < 128) {
          result[index] = { name, note }
        }
        return ''
      }
    )
    return result
  }, [buttons, buttonOverride])
  return mappedButtons
}

export const DrumButtonMapping: FC<DrumButtonMapping> = (props) => {
  const mappedButtons = GetDrumButtonMapping()
  return <>{props.children(mappedButtons)}</>
}

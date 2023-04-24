import React, { ReactNode, useContext, useState } from 'react'
import { tw } from 'twind'
import { ConfigurationProperty } from '../configuration'
import AppConfigurationContext from './AppConfigurationContext'
import { InlineMarkdown } from './Markdown'
import { useConfiguration } from './AppConfigurationHooks'
import { GetDrumButtonMapping, GetAllDrumpadButtonMapping } from '../drum-pad/DrumButtonMapping'
import Select from 'react-select'

export function AppConfigurationEditor() {
  const context = useContext(AppConfigurationContext)
  if (!context) {
    throw new Error('No context')
  }

  const { schema } = context
  const stopPropagation = (e: React.KeyboardEvent) => e.stopPropagation()
  return (
    <div
      className={tw`p-4`}
      onKeyDown={stopPropagation}
      onKeyUp={stopPropagation}
    >
      <h2 className={tw`text-3xl p-2 text-#8b8685 font-bold`}>
        WebMIDICon configuration
      </h2>
      {schema.sections.map((section, index) => {
        return (
          <section key={index} className={tw`mb-8`}>
            <h2 className={tw`text-2xl pt-2 px-2 text-#d7fc70`}>
              {section.title}
            </h2>
            {Object.entries(section.properties).map(([name, descriptor]) => {
              return (
                <div className={tw`p-2 leading-normal`} key={name}>
                  <h3 className={tw`font-bold`}>
                    <ConfigurationPropertyTitle propertyName={name} />
                  </h3>
                  <ConfigurationPropertyEditor
                    propertyName={name}
                    propertyDescriptor={descriptor}
                    description={
                      descriptor.markdownDescription ? (
                        <div className={tw`opacity-75`}>
                          <InlineMarkdown
                            text={descriptor.markdownDescription}
                          />
                        </div>
                      ) : null
                    }
                  />
                </div>
              )
            })}
          </section>
        )
      })}
      <section key={'section-config-drumpad-mapping'} className={tw`mb-8`}>
        <h2 className={tw`text-2xl pt-2 px-2 text-#d7fc70`}>
          Drumpad Mapping
        </h2>
        <div className={tw`p-2 leading-normal`} key={'config-drumpad-mapping'}>
          <h3 className={tw`font-bold`}>
            <ConfigurationPropertyTitle propertyName={'drumPad.keymap'} />
          </h3>
          <ConfigDrumpadMapping />
        </div>
      </section>
    </div>
  )
}

function ConfigurationPropertyTitle({
  propertyName,
}: {
  propertyName: string
}) {
  return (
    <span>
      {propertyName
        .split('.')
        .slice(1)
        .map((title, index, array) => {
          const last = index === array.length - 1
          return (
            <span key={index} className={last ? tw`text-white` : ''}>
              {title
                .replace(/([A-Z])/g, ' $1')
                .replace(/\w/, (a) => a.toUpperCase())}
              {last ? '' : ': '}
            </span>
          )
        })}
    </span>
  )
}

function ConfigDrumpadMapping(): JSX.Element {
  const { value, overridden, setValue, resetValue } = useConfiguration('drumPad.buttonOverride')
  const reset = (
    <span className={tw`ml-2 text-#8b8685`}>
      (default:{' '}
      <button
        className={tw`underline`}
        title="Click to reset to default value"
        onClick={resetValue}
      >
        Reset
      </button>
      )
    </span>
  )
  const onChange = (index: number, val: any) => {
    map[index] = `${index}=${val}`
    setValue(map.join(''))
  }

  const selectHandleChange = (selectedOption: any) => {
    console.log('selectedOption: ', selectedOption)
    onChange(selectedOption.index + 1, selectedOption.value)
  };

  const map: any = []
  const res: any = []
  let tmpChild: any = []
  GetDrumButtonMapping().forEach((current, index) => {
    map[index+1] = `${index+1}=${current.note},${current.name};`
    tmpChild.push(
      // <select
      //   style={{ marginRight: '5px' }}
      //   className={tw`p-1 bg-#090807 border border-#656463`}
      //   onChange={(e) => onChange(index + 1, e.target.value)}
      //   value={(`${current.note},${current.name};`) as unknown as string}
      // >
      //   {GetAllDrumpadButtonMapping().map((btn) => (
      //     <option key={btn.note} value={`${btn.note},${btn.name};`}>
      //       {btn.name}
      //     </option>
      //   ))}
      // </select>
      <div style={{color: 'black'}}>
        <Select
          className={tw`p-1 bg-#090807 border border-#656463`}
          onChange={selectHandleChange}
          value={{ label: current.name, value: `${current.note},${current.name};`}}
          options={GetAllDrumpadButtonMapping().map((btn): any => {
            return {
              value: `${btn.note},${btn.name};`,
              label: btn.name,
              index: index
            }
          })}
        />
      </div>
    )
    // if ((index+1)%4 === 0) {
    //   res.push(<><p>{tmpChild}</p><br /></>)
    //   tmpChild = []
    // }
  })
  res.push(<div className={tw`grid grid-cols-4 gap-4`}>{tmpChild}</div>)
  return <div style={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>{[reset, res]}</div>
}

function ConfigurationPropertyEditor(props: {
  propertyName: string
  propertyDescriptor: ConfigurationProperty
  description: ReactNode
}) {
  const { value, overridden, setValue, resetValue } = useConfiguration(
    props.propertyName
  )
  const reset = overridden ? (
    <span className={tw`ml-2 text-#8b8685`}>
      (default:{' '}
      <button
        className={tw`underline`}
        title="Click to reset to default value"
        onClick={resetValue}
      >
        {props.propertyDescriptor.default}
      </button>
      )
    </span>
  ) : null
  if (props.propertyDescriptor.type === 'boolean') {
    return (
      <div className={tw`flex`}>
        <input type="checkbox" className={tw`mr-2`} />
        {props.description}
      </div>
    )
  }
  if (
    props.propertyDescriptor.type === 'string' &&
    props.propertyDescriptor.enum
  ) {
    return (
      <>
        {props.description}
        <p>
          <select
            className={tw`p-1 bg-#090807 border border-#656463`}
            onChange={(e) => setValue(e.target.value)}
            value={(value as unknown) as string}
          >
            {props.propertyDescriptor.enum.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          {reset}
        </p>
      </>
    )
  }
  if (props.propertyDescriptor.type === 'string') {
    return (
      <>
        {props.description}
        <p>
          <ConfigInput
            value={value as string}
            onChange={(text) => {
              setValue(text)
            }}
          />
          {overridden ? (
            <span className={tw`ml-2 text-#8b8685`}>
              (default:{' '}
              <button
                className={tw`underline`}
                title="Click to reset to default value"
                onClick={resetValue}
              >
                {props.propertyDescriptor.default}
              </button>
              )
            </span>
          ) : null}
        </p>
      </>
    )
  }
  return <>{props.description}</>
}

function ConfigInput(props: {
  value: string
  onChange: (value: string) => void
}) {
  const [currentValue, setCurrentValue] = useState(props.value)
  const [cachedValue, setCachedValue] = useState(props.value)
  if (cachedValue !== props.value) {
    setCachedValue(props.value)
    setCurrentValue(props.value)
  }
  return (
    <input
      type="text"
      className={tw`p-1 bg-#090807 border border-#656463`}
      value={currentValue}
      onChange={(e) => {
        setCurrentValue(e.target.value)
        props.onChange(e.target.value)
      }}
    />
  )
}

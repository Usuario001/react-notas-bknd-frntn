import { useState } from 'react'
import { uploadFile } from './services/upload'
import {Toaster, toast} from 'sonner'
import {type Data} from './types'

import './App.css'
import { Search } from './steps/Search'

/**
 * Min 1:20
 */

const APP_STATUS = { 
  IDLE: 'idle', //al entrar 
  ERROR: 'error', // cuando hay un error
  READY_UPLOAD: 'ready_upload',//al elegir el archivo
  UPLOADING: 'uploading', //mientras se sube el archivo
  READY_USAGE: 'ready_usage', //despues de subir
} as const

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: 'Subir archivo',
  [APP_STATUS.UPLOADING]: 'Subiendo...'
}

type AppStatusType = typeof APP_STATUS[keyof typeof APP_STATUS]

function App() {
  const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE)
  const [data, setData] = useState<Data>([])
  const [file, setFile] = useState<File | null>(null)

  const handleInputChange = ( event: React.ChangeEvent<HTMLInputElement> )=> {
    const [file] = event.target.files ?? []

    if(file){
      setFile(file)
      setAppStatus(APP_STATUS.READY_UPLOAD)
    }

    console.log(file)
  }

  const handleSubmit = async ( event: React.FormEvent<HTMLFormElement> ) => {
    event?.preventDefault()
    console.log("TODO")

    if(appStatus !== APP_STATUS.READY_UPLOAD || !file){
      return
    }

    setAppStatus(APP_STATUS.UPLOADING)

    const [err, newData] = await uploadFile(file)
    console.log({err,newData})

    if(err){
      setAppStatus(APP_STATUS.ERROR)
      toast.error(err.message)
      return
    }
    setAppStatus(APP_STATUS.READY_USAGE)
    if(newData) setData(newData)
    toast.success('Archivo subido correctamente')
  }

  const showButton = appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING
  const showInput = appStatus !== APP_STATUS.READY_USAGE

  return (
    <>
    <Toaster/>
      <h4>Chanllenge: Upload CSV + Search</h4>
      {showInput && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="">
            <input 
              disabled={appStatus === APP_STATUS.UPLOADING}
              name="file" 
              type="file" 
              accept='.csv' 
              onChange={handleInputChange}
            />
          </label>
          {showButton && (
              <button disabled={appStatus === APP_STATUS.UPLOADING}>
                {BUTTON_TEXT[appStatus]}
              </button>
          )}
        </form>
      )}
      
      {
        appStatus === APP_STATUS.READY_USAGE && (
          <Search initialData={data}/>
        )
      }
    </>
  )
}

export default App

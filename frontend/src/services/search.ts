import {type ApiSearchResponse, type Data} from '../types'
import { API_HOST } from '../config'

export const searchData = async (search: String) : Promise<[Error?, Data?]> => {
    
    try {
        const res = await fetch( `${API_HOST}/api/users?q=${search}`)
        
        if(!res.ok) return [new Error(`Error searching data: ${res.statusText}`)]

        const json = await res.json() as ApiSearchResponse
        return [undefined, json.data]
    }catch (e){
        if(e instanceof Error) return [e]
    }

    return [new Error('Unknow error')]
}
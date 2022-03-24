import { possibleWordleSolutions } from '../constants/wordle.ts'

export function getDaily(){
    var DT = new Date()
    const random = Math.floor(Math.random() * possibleWordleSolutions.length);

    if(DT.getUTCHours == 1){
        client.db.set('word',possibleWordleSolutions[random])
    }
    return client.db.get('word')
}
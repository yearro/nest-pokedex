import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel  } from '@nestjs/mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity'
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
@Injectable()
export class SeedService {

  constructor(
    @InjectModel((Pokemon.name))
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http:AxiosAdapter
  ){}
   
  async executeSeed() {
    await this.pokemonModel.deleteMany({}) // Para borrar los documentos de la tabla

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=60')


    //const insertPromisesArray = []
    const pokemonToInsert: { name: string, no: number }[] = []
    data.results.forEach(({ name, url}) => {
      const segments = url.split('/')
      const no = +segments[segments.length - 2]

      pokemonToInsert.push({ name, no })
      //const pokemon =  await this.pokemonModel.create({ name, no })

      // console.log({ name, no })
    }) 
    //await Promise.all(insertPromisesArray)
    await this.pokemonModel.insertMany(pokemonToInsert)
    return 'Seed Executed';
  }
}

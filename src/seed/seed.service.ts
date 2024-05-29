import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance}  from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel  } from '@nestjs/mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity'
import { Model } from 'mongoose';
@Injectable()
export class SeedService {

  constructor(
    @InjectModel((Pokemon.name))
    private readonly pokemonModel: Model<Pokemon>
  ){}

  private readonly axios:AxiosInstance = axios

   
  async executeSeed() {
    await this.pokemonModel.deleteMany({}) // Para borrar los documentos de la tabla

    const { data } = await axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=50')

    const insertPromisesArray = []

    data.results.forEach(({ name, url}) => {
      const segments = url.split('/')
      const no = +segments[segments.length - 2]

      insertPromisesArray.push(
        this.pokemonModel.create({ name, no })
      )
      //const pokemon =  await this.pokemonModel.create({ name, no })

      // console.log({ name, no })
    }) 
    await Promise.all(insertPromisesArray)
    return 'Seed Executed';
  }
}

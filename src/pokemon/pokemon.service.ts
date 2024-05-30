import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PagingDto } from 'src/common/dto/paging.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel((Pokemon.name))
    private readonly pokemonModel: Model<Pokemon>
  ){}
 
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()
      const pokemon =  await this.pokemonModel.create(createPokemonDto)
      return pokemon
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  findAll(pagingDto:PagingDto) {
    const { limit = 10, offset = 0 } = pagingDto
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v')
  }

  async findOne(term: string) {
    let pokemon: Pokemon
    if( !isNaN(+term) ) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }
    if(isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }
    if( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim()})
    }
    if( !pokemon ) throw new NotFoundException(`Pokemon ${ term } not found`)

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term)
      if(updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase().trim()
      await pokemon.updateOne(updatePokemonDto, { new: true })
      return {...pokemon.toJSON(), ...updatePokemonDto}
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    // const result = await this.pokemonModel.findByIdAndDelete(id)
    // const pokemon = await this.findOne(id)
    // await pokemon.deleteOne()
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })
    if(deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${id} not found`)
    }
    return
  }

  private handleExceptions(error: any) {
    if(error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`)
    }
    throw new InternalServerErrorException('Can´t create Pokemon - Check server logs')
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query /*HttpCode, HttpStatus*/ } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongiIdPipe } from 'src/common/pipes/parse-mongi-id/parse-mongi-id.pipe';
import { PagingDto } from 'src/common/dto/paging.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  // @HttpCode( HttpStatus.OK ) para personalizar los códigos de respuesta

  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll( @Query() pagingDto:PagingDto) {
    return this.pokemonService.findAll(pagingDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(term, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongiIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}

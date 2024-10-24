import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypesOfSentencesService } from './types-of-sentences.service';
import { CreateTypesOfSentenceDto } from './dto/create-types-of-sentence.dto';
import { UpdateTypesOfSentenceDto } from './dto/update-types-of-sentence.dto';

@Controller('types-of-sentences')
export class TypesOfSentencesController {
  constructor(private readonly typesOfSentencesService: TypesOfSentencesService) {}

  @Post()
  create(@Body() createTypesOfSentenceDto: CreateTypesOfSentenceDto) {
    return this.typesOfSentencesService.create(createTypesOfSentenceDto);
  }

  @Get()
  findAll() {
    return this.typesOfSentencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typesOfSentencesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypesOfSentenceDto: UpdateTypesOfSentenceDto) {
    return this.typesOfSentencesService.update(+id, updateTypesOfSentenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typesOfSentencesService.remove(+id);
  }
}

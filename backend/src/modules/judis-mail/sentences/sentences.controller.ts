import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SentencesService } from './sentences.service';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { UpdateSentenceDto } from './dto/update-sentence.dto';
import { Public } from 'src/decorators/isPublic.decorator';

@Public()
@Controller('sentences')
export class SentencesController {
  constructor(private readonly sentencesService: SentencesService) {}

  @Post()
  create(@Body() createSentenceDto: CreateSentenceDto) {
    return this.sentencesService.create(createSentenceDto);
  }

  @Get()
  findAll() {
    return this.sentencesService.findAll();
  }

  @Get("getFromSpecificSalaAndMonth")
  findCertainSentences( @Query('sala') sala: string,  @Query('month') month:string) {
    return this.sentencesService.findCertainSentences(sala,month);
  }

  @Get('/sentences-by-sala')
  async getSentencesBySala() {
    return this.sentencesService.getSentencesBySala();
  }


  @Get("proof")
  proof() {
    return this.sentencesService.proof();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sentencesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSentenceDto: UpdateSentenceDto) {
    return this.sentencesService.update(+id, updateSentenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sentencesService.remove(+id);
  }
}

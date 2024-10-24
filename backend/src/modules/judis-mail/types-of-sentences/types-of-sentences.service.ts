import { Injectable } from '@nestjs/common';
import { CreateTypesOfSentenceDto } from './dto/create-types-of-sentence.dto';
import { UpdateTypesOfSentenceDto } from './dto/update-types-of-sentence.dto';

@Injectable()
export class TypesOfSentencesService {
  create(createTypesOfSentenceDto: CreateTypesOfSentenceDto) {
    return 'This action adds a new typesOfSentence';
  }

  findAll() {
    return `This action returns all typesOfSentences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} typesOfSentence`;
  }

  update(id: number, updateTypesOfSentenceDto: UpdateTypesOfSentenceDto) {
    return `This action updates a #${id} typesOfSentence`;
  }

  remove(id: number) {
    return `This action removes a #${id} typesOfSentence`;
  }
}

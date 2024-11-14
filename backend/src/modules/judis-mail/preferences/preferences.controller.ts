import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) { }

  @Post()
  create(@Body() createPreferenceDto: CreatePreferenceDto) {
    return this.preferencesService.create(createPreferenceDto);
  }

  @Get()
  findAll() {
    return this.preferencesService.findAll();
  }

  @Post('/save')
  async savePreferences(
    @Body() preferences: any, // Recibe un arreglo de IDs de las preferencias
    @Request() req: any, // Recibe la solicitud para obtener el ID del usuario
  ) {
    try {
      const userId = req.user.sub; // Obtener el ID de usuario del token JWT
      console.log('User ID:', userId); // Puedes verificar si el userId está llegando correctamente


      return await this.preferencesService.savePreferences(userId, preferences);;
    } catch (error) {
      console.error('Error al guardar las preferencias', error);
      throw new Error('Error al guardar las preferencias');
    }
  }

  @Get('/preferences')
  async getUserPreferences(@Request() req: any) {

    const userId = req.user.sub; // Obtener el ID del usuario desde el token JWT
    const preferences = await this.preferencesService.getPreferencesByUserId(userId);
    return preferences;

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preferencesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreferenceDto: UpdatePreferenceDto) {
    return this.preferencesService.update(+id, updatePreferenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preferencesService.remove(+id);
  }
}

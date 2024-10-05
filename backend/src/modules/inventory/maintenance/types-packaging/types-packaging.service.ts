import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTypesPackagingDto } from './dto/create-types-packaging.dto';
import { UpdateTypesPackagingDto } from './dto/update-types-packaging.dto';
import { TypesPackaging } from './entities/types-packaging.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Raw, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { UsersService } from 'src/modules/config/users/users.service';
import * as XLSX from 'xlsx';

@Injectable()
export class TypesPackagingService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(TypesPackaging)
        private typesPackagingRepository: Repository<TypesPackaging>,
    ) {}

    async create(
        createTypesPackagingDto: CreateTypesPackagingDto,
        userId: number,
    ): Promise<string> {
        const user = await this.usersService.findOne(userId);

        const typesPackaging = await this.typesPackagingRepository.findOne({
            where: {
                name: createTypesPackagingDto.name,
            },
        });
        if (typesPackaging) {
            throw new HttpException('Tipo de paquete ya se encuentra registrado', 401);
        }

        let maxId = await this.typesPackagingRepository
            .createQueryBuilder('inventory_products_packaging_types')
            .select('MAX(inventory_products_packaging_types.id)', 'max')
            .getRawOne();

        maxId = maxId.max ? parseInt(maxId.max) + 1 : 1;

        if (parseInt(maxId) < 10) {
            maxId = `0${maxId}`;
        }

        const newTypePresentation = {
            ...createTypesPackagingDto,
            name: createTypesPackagingDto.name.toUpperCase(),
            code: maxId,
            user: user,
            userUpdate: user,
        };

        try {
            await this.typesPackagingRepository.save(newTypePresentation);
            return 'type of  packaging created successfully';
        } catch (error) {
            console.log(error);

            throw new HttpException(
                'Error creating type of  packaging',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async listTypesPackaging(): Promise<TypesPackaging[]> {
        return await this.typesPackagingRepository.find({
            where: { isActive: true },
        });
    }

    async findAll(query: any): Promise<{ totalRows: number; data: TypesPackaging[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const relations = {
            user: true,
            userUpdate: true,
        };

        let updateAt;

        if (query.updateAt) {
            const dates = query.updateAt.split(',');
            if (dates.length === 2) {
                updateAt = Between(new Date(dates[0]), new Date(dates[1]));
            }
        }

        let createdAt;

        if (query.createdAt) {
            const dates = query.createdAt.split(',');
            if (dates.length === 2) {
                createdAt = Between(new Date(dates[0]), new Date(dates[1]));
            }
        }

        const where = {
            id: Raw((id) => `CAST(${id} as char) Like '%${query.id || ''}%'`),
            name: Like(`%${query.name || ''}%`),
            code: Like(`%${query.code || ''}%`),
            isActive: query.isActive != '' ? query.isActive : undefined,
            createdAt: createdAt || undefined,
            updateAt: updateAt || undefined, // Add the date range filte
        };
        try {
            const [resCount, resData] = await Promise.all([
                this.typesPackagingRepository.count({ relations, where }),
                query?.export
                    ? this.typesPackagingRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.typesPackagingRepository.find({
                          relations,
                          where,
                          order: { id: order },
                          take,
                          skip,
                      }),
            ]);

            return {
                totalRows: resCount,
                data: resData,
            };
        } catch (error) {
            throw new HttpException(
                'Error fetching type of  packaging',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: number) {
        const typesPackaging = await this.typesPackagingRepository.findOne({ where: { id } });
        if (!typesPackaging) {
            throw new HttpException('Type of  packaging not found', HttpStatus.NOT_FOUND);
        }
        return typesPackaging;
    }

    async update(id: number, updateTypesPackagingDto: UpdateTypesPackagingDto) {
        const typesPackaging = await this.findOne(id);
        if (!typesPackaging) {
            throw new HttpException('Type of  packaging not found', HttpStatus.NOT_FOUND);
        }

        Object.assign(typesPackaging, updateTypesPackagingDto);

        try {
            await this.typesPackagingRepository.save(typesPackaging);
            return `Type of  packaging #${id} updated successfully`;
        } catch (error) {
            throw new HttpException(
                'Error updating Type of  packaging',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    remove(id: number) {
        return `This action removes a #${id} typesPackaging`;
    }

    async changeStatus(id: number): Promise<string | Error> {
        const typesPackaging = await this.typesPackagingRepository.findOneBy({ id });
        typesPackaging.isActive = !typesPackaging.isActive;

        try {
            await this.typesPackagingRepository.save(typesPackaging);
            return '¡Cambio de estatus realizado con éxito!';
        } catch (error) {
            throw error;
        }
    }

    async exportDataToExcel(data: any[], res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet('Data');

        worksheet.columns = [
            { header: 'name', key: 'name', width: 20 },
            { header: 'code', key: 'code', width: 20 },
            { header: 'user', key: 'createdBy', width: 25 }, // Columna para usuario creador
            { header: 'userUpdate', key: 'updatedBy', width: 25 }, // Columna para usuario que actualizó
            { header: 'createAt', key: 'createAt', width: 20 },
            { header: 'updateAt', key: 'updateAt', width: 20 },
        ];

        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2a953d' },
        };
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        // Agregar datos y aplicar estilos
        data.forEach((item) => {
            // Extraer y aplanar datos relevantes
            const rowData = {
                name: item.name,
                code: item.code,
                createAt: item.createdAt.toISOString(), // Convertir a string en formato ISO
                updateAt: item.updatedAt.toISOString(), // Convertir a string en formato ISO
                createdBy: item.user ? item.user.id : 'N/A', // Si user es null, poner 'N/A'
                updatedBy: item.userUpdate ? item.userUpdate.id : 'N/A', // Si userUpdate es null, poner 'N/A'
            };

            const row = worksheet.addRow(rowData);

            row.alignment = { vertical: 'middle', horizontal: 'left' };
            row.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', `attachment; filename=data.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    }

    async processExcel(buffer: Buffer): Promise<any> {
        // Leer el archivo Excel desde el buffer
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; // Obtener la primera hoja de trabajo
        const worksheet = workbook.Sheets[sheetName];

        // Convertir los datos de la hoja de Excel en JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validar y mapear los datos a tu entidad
        const entities = jsonData.map((data: any) => {
            return this.typesPackagingRepository.create({
                // Asegúrate de que los nombres de las columnas en el archivo Excel sean correctos
                name: data['name'], // Reemplaza 'NombreMoneda' con el nombre exacto de la columna en tu Excel
                code: data['code'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
                user: data['user'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
                userUpdate: data['userUpdate'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
            });
        });

        // Guardar los datos en la base de datos
        await this.typesPackagingRepository.save(entities);

        return { message: 'Datos importados correctamente', total: entities.length };
    }
}

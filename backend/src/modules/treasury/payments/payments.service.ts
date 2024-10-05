import { HttpException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Treasury_Payments } from './entities/payment.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Treasury_maintenance_Money } from '../maintenance/money/entities/money.entity';
import { Provider } from 'src/modules/masters/providers/entities/provider.entity';
import { UsersService } from 'src/modules/config/users/users.service';
import { User } from 'src/modules/config/users/entities/user.entity';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { Http } from 'winston/lib/winston/transports';
import { CorrelativeService } from 'src/modules/config/correlative/correlative.service';

@Injectable()
export class PaymentsService {
  constructor(
    private usersService: UsersService,
    //private usersService: UsersService,
    @InjectRepository(Treasury_Payments)  // Inyectar el repositorio
    private paymentsRepository: Repository<Treasury_Payments>,
    @InjectRepository(Treasury_maintenance_Money)  // Inyectar el repositorio
    private moneyRepository: Repository<Treasury_maintenance_Money>,
    private dataSource: DataSource,

    private correlativeService: CorrelativeService
  ) { }



  async create(createPaymentDto: CreatePaymentDto, userId: number) {

    console.log("datos que vienen del frontend", createPaymentDto);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newPayment = new Treasury_Payments();

      // usuario que hizo el registro
      const user = await this.usersService.findOne(userId);

      // información del proveedor
      newPayment.type_of_identification = createPaymentDto.type_of_identification;
      newPayment.type_of_document = createPaymentDto.type_of_document;
      newPayment.document_of_counterparty = createPaymentDto.document_of_counterparty;
      newPayment.name_of_counterparty = createPaymentDto.name_of_counterparty;

      // Si hay proveedor
      const providerExists = createPaymentDto.provider_who_gets_the_payment != undefined && createPaymentDto.provider_who_gets_the_payment != null;
      if (providerExists) {
        const provider = await queryRunner.manager.findOne(Provider, {
          where: { id: createPaymentDto.provider_who_gets_the_payment },
        });
        console.log("el proveedor es:", provider);
        newPayment.provider_who_gets_the_payment = provider;
      }

      // Información del pago
      newPayment.currencyUsed = createPaymentDto.currencyUsed;
      newPayment.paymentDate = createPaymentDto.paymentDate;
      newPayment.payment_method = createPaymentDto.payment_method;
      newPayment.amountPaid = createPaymentDto.amountPaid;
      newPayment.balance = createPaymentDto.amountPaid;
      newPayment.paymentReference = createPaymentDto.paymentReference ? createPaymentDto.paymentReference : undefined;
      newPayment.voucher_image_url = createPaymentDto.file ? createPaymentDto.file : undefined;

      // Campos genéricos
      newPayment.user = user;
      newPayment.isActive = true;

      // Estado del pago
      newPayment.paymentStatus = createPaymentDto.paymentStatus;

      // Validación por método de pago
      const isBankTransfer = createPaymentDto.payment_method === 3 || createPaymentDto.payment_method === 9;
      const isPagoMovil = createPaymentDto.payment_method === 4;
      const isPayPalOrZelle = createPaymentDto.payment_method === 5 || createPaymentDto.payment_method === 8;
      const isCreditOrDebit = createPaymentDto.payment_method === 1 || createPaymentDto.payment_method === 2;

      if(isCreditOrDebit  ){

        //  Banco emisor y cuenta uasada 
        console.log("Cuenta y banco usada",createPaymentDto.bankEmissor,createPaymentDto.transfer_account_number)

        if(createPaymentDto.bankEmissor &&  createPaymentDto.transfer_account_number){
          newPayment.bankEmissor = createPaymentDto.bankEmissor,
          newPayment.transfer_account_number = createPaymentDto.transfer_account_number
        }
        //para debito o credito no se guarda el banco
        newPayment.bankReceptor = null
        
      }

      isBankTransfer ? createPaymentDto.transfer_account_number_of_receiver && createPaymentDto.bankEmissor && createPaymentDto.bankReceptor && createPaymentDto.transfer_account_number ? (newPayment.transfer_account_number_of_receiver = createPaymentDto.transfer_account_number_of_receiver,
        newPayment.bankEmissor = createPaymentDto.bankEmissor,
        newPayment.bankReceptor = createPaymentDto.bankReceptor,
        newPayment.transfer_account_number = createPaymentDto.transfer_account_number)
        : console.log("Faltan datos para la transferencia bancaria.")
        : isPagoMovil
          ? createPaymentDto.bankEmissor &&
            createPaymentDto.bankReceptor &&
            createPaymentDto.pagomovilDocument &&
            createPaymentDto.pagomovilPhoneNumber
            ? (newPayment.bankEmissor = createPaymentDto.bankEmissor,
              newPayment.bankReceptor = createPaymentDto.bankReceptor,
              newPayment.pagomovilDocument = createPaymentDto.pagomovilDocument,
              newPayment.pagomovilPhoneNumber = createPaymentDto.pagomovilPhoneNumber)
            : console.log("Faltan datos para el pago móvil.")
          : isPayPalOrZelle
            ? (createPaymentDto.payment_method === 8 && createPaymentDto.addressee_name
              ? (newPayment.addressee_name = createPaymentDto.addressee_name)
              : console.log("Faltan datos para Zelle."),
              createPaymentDto.emailReceptor && createPaymentDto.emailEmisor
                ? (newPayment.emailReceptor = createPaymentDto.emailReceptor,
                  newPayment.emailEmisor = createPaymentDto.emailEmisor)
                : console.log("Faltan datos para el pago vía PayPal o Zelle."))
            : console.log("Método de pago no requiere validación adicional.");



        const  correlativeCode =  await this.correlativeService.generateCode("TRE","emitted_payments")


        newPayment.correlativeCode = correlativeCode
        console.log("CODIGO CORRELATIO",correlativeCode)

      await queryRunner.manager.save(Treasury_Payments, newPayment);
      await queryRunner.commitTransaction();

    } catch (error) {
      console.log("error", error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, error.status);
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
    return 1;
  }

  async findAll(
    query: any,
  ): Promise<{ totalRows: number; data: Treasury_Payments[] }> {
    console.log('Recibiendo el findAll para Treasury_Payments');
    console.log('El query:', query);

    const take = query.rows || 5;
    const skip = query.page ? (query.page - 1) * take : 0;
    const order = query.order || 'DESC';

    const queryBuilder = this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.typeOfPerson', 'typeOfPerson')
      .leftJoinAndSelect('payment.type_of_document', 'documentType')
      .leftJoinAndSelect('payment.type_of_identification', 'identificationType')
      .leftJoinAndSelect('payment.provider_who_gets_the_payment', 'provider')
      .leftJoinAndSelect('payment.currencyUsed', 'currencyUsed')
      .leftJoinAndSelect('payment.payment_method', 'paymentMethod')
      .leftJoinAndSelect('payment.user', 'user')
      .leftJoinAndSelect('payment.userUpdate', 'userUpdate')
      .leftJoinAndSelect('payment.bankEmissor', 'bankEmissor')
      .leftJoinAndSelect('payment.bankReceptor', 'bankReceptor')
      .leftJoinAndSelect('payment.transfer_account_number', 'transfer_account_number')
      .leftJoinAndSelect('payment.paymentStatus', 'paymentStatus')
    // Filtros condicionales
    if (query.typeOfPerson) {
      queryBuilder.andWhere('typeOfPerson.id = :typeOfPerson', {
        typeOfPerson: query.typeOfPerson,
      });
    }
    if (query.documentType) {
      queryBuilder.andWhere('documentType.id = :documentType', {
        documentType: query.documentType,
      });
    }
    if (query.identificationType) {
      queryBuilder.andWhere('identificationType.id = :identificationType', {
        identificationType: query.identificationType,
      });
    }
    if (query.providerId) {
      queryBuilder.andWhere('provider.id = :providerId', {
        providerId: query.providerId,
      });
    }
    if (query.paymentMethod) {
      queryBuilder.andWhere('paymentMethod.id LIKE :paymentMethod', {
        paymentMethod: `%${query.paymentMethod}%`,
      });
    }
    if (query.isActive !== undefined) {
      const isActive = query.isActive === 'true'; // Convertir la cadena a booleano
      queryBuilder.andWhere('payment.isActive = :isActive', { isActive: isActive });
    }
    if (query.paymentDate) {
      const [startDate, endDate] = query.paymentDate.split(',');
      queryBuilder.andWhere('payment.paymentDate BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }
    if (query.createdAt) {
      const [startDate, endDate] = query.createdAt.split(',');
      queryBuilder.andWhere('payment.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }


    if (query.name_of_counterparty) {
      queryBuilder.andWhere('payment.name_of_counterparty LIKE :name_of_counterparty', {
        name_of_counterparty: `%${query.name_of_counterparty}%`,
      });
    }

    if (query.document_of_counterparty) {
      queryBuilder.andWhere('payment.document_of_counterparty LIKE :document_of_counterparty', {
        document_of_counterparty: `%${query.document_of_counterparty}%`,
      });
    }

    if (query.currencyUsed) {
      queryBuilder.andWhere('currencyUsed.money LIKE :currencyUsed', {
        currencyUsed: query.currencyUsed,
      });
    }

    if (query.payment_method) {
      queryBuilder.andWhere('LOWER(paymentMethod.method) LIKE LOWER(:searchedMethod)', {
        searchedMethod: `%${query.payment_method}%`,
      });
    }


    async function andWhereLike(builder: any, searchedValue: any, entityReference: any, campSearched: any) {
      builder.andWhere(`CAST(${entityReference}.${campSearched} AS CHAR) LIKE :alias`, {
        alias: `%${searchedValue}%`
      });
      return builder;
    }

    if(query.paymentStatus){

      queryBuilder.andWhere('paymentStatus.status LIKE :alias', {
       alias: `%${query.paymentStatus}%`,
      });

      //await andWhereLike(queryBuilder, query.paymentStatus, "payment", "paymentStatus")
    }


    if (query.paymentReference) {
      await andWhereLike(queryBuilder, query.paymentReference, "payment", "paymentReference")
    }

    if (query.amountPaid) {
      await andWhereLike(queryBuilder, query.amountPaid, "payment", "amountPaid")
    }



    const [totalRows, data] = await Promise.all([
      queryBuilder.getCount(),
      query?.export
        ? queryBuilder.orderBy('payment.id', order).getMany()
        : queryBuilder.orderBy('payment.id', order).skip(skip).take(take).getMany(),
    ]);

    //  console.log(totalRows, data)

    return { totalRows, data };
  }




  async findOne(id: number): Promise<Treasury_Payments> {
    try {
      const payment = await this.paymentsRepository.findOne({
        where: { id },
        relations: [
          'type_of_document',
          'type_of_identification',
          'provider_who_gets_the_payment',
          'currencyUsed',
          'payment_method',
          'user',
          'userUpdate',
          "bankEmissor",
          "bankReceptor",
          'transfer_account_number',
          "paymentStatus"
        ],
      });

      if (!payment) {
        throw new HttpException(`Payment with ID ${id} not found`, 404);
      }

      return payment;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }


  async update(id: number, updatePaymentDto: UpdatePaymentDto, userId: number) {
    console.log("el update del payment", updatePaymentDto);

    try {
      // Busca el pago antes de intentar actualizarlo
      const existingPayment = await this.findOne(id);

      // Verifica si el estado del pago es 'confirmado' (status.id = 2)
      if (existingPayment.paymentStatus.id === 2) {
        throw new HttpException("El pago no se puede editar, pues está confirmado", 400);
      }

      console.log("editando un pago emitido");
      console.log("amount: ", updatePaymentDto.amountPaid);

      // Busca el usuario que realiza la actualización
      const user = await this.usersService.findOne(userId);

      if(updatePaymentDto.provider_who_gets_the_payment == "null"){
        updatePaymentDto.provider_who_gets_the_payment = null
      }

      // Actualiza el registro correspondiente en la entidad de pagos
      await this.paymentsRepository.update({ id: id }, updatePaymentDto);

      // Recupera el registro actualizado
      const updatedPayment = await this.findOne(id);

      //actualizar el balance
      updatedPayment.balance = updatePaymentDto.amountPaid

      console.log("updated payment", updatedPayment);

      // Asigna el usuario que realizó la actualización
      if (updatedPayment) {
        updatedPayment.userUpdate = user; // Aquí guardamos quién actualizó
        await this.paymentsRepository.save(updatedPayment); // Guardamos el registro actualizado con la referencia al usuario
      }
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }

    return `success`;
  }



  async changeStatus(id: number): Promise<string | Error> {


    console.log("cambiando status")

    // Encuentra el pago por su ID
    const payment = await this.paymentsRepository.findOne({ where: { id } });

    if (!payment) {
      throw new HttpException(`Payment with ID ${id} not found`, 404);
    }

    // Cambia el estatus de activo a inactivo o viceversa
    payment.isActive = !payment.isActive;

    try {
      // Guarda el estado actualizado
      await this.paymentsRepository.save(payment);
      return '¡Cambio de estatus realizado con éxito!';
    } catch (error) {
      console.error('Error al cambiar el estatus:', error);
      throw new HttpException('Error al cambiar el estatus del pago', 500);
    }
  }



  async exportDataToExcel(data: any[], res: Response): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    worksheet.addRow(['Pagos Emitidos']);
    worksheet.columns = [
      { header: 'Fecha de Creación', key: 'createdAt', width: 25 },
      { header: 'Nombre de Contraparte:', key: 'name', width: 20 },
      { header: 'Identificacion de Contraparte:', key: 'identification', width: 20 },
      { header: 'Moneda usada', key: 'currency', width: 20 },
      { header: 'Método de Pago', key: 'paymentMethod', width: 20 },
      { header: 'Referencia de Pago', key: 'reference', width: 20 },
      { header: 'Monto', key: 'amount', width: 20 },
      { header: 'Fecha de Pago', key: 'paymentDate', width: 20 },
      { header: 'Número de Cuenta de Receptor', key: 'accountNumberOfReceiver', width: 50 },
      { header: 'Documento de receptor para Pago Movil', key: 'documentophonen', width: 50 },
      { header: 'Teléfono de receptor para Pago Movil', key: 'pagomovilphonen', width: 50 },
      { header: 'Email de contraparte', key: 'emailReceptor', width: 30 },
      { header: 'Email usado', key: 'emailEmisor', width: 30 },
      { header: 'Nombre de Receptor para Zelle', key: 'addressee_name', width: 20 },
      { header: 'Cuenta Utilizada para realizar la Transferencia', key: 'transfer_account_number', width: 20 },
      { header: 'Banco Emisor', key: 'bankEmissor', width: 20 },
      { header: 'Banco Receptor', key: 'bankReceptor', width: 20 },
      { header: 'Registrado por', key: 'user', width: 20 },
    ];

    // Aplicar estilos a la cabecera
    worksheet.getRow(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2a953d' },
    };
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Agregar datos y aplicar estilos
    data.forEach((item) => {
      const flattenedItem = {
        createdAt: item.createdAt,

        exchangeToCurrency: item.exchangeToCurrency ? item.exchangeToCurrency.money : '',
        name: item.name_of_counterparty ? item.name_of_counterparty : '',
        identification: item.document_of_counterparty ? item.document_of_counterparty : "",
        currency: item.currencyUsed.money ? item.currencyUsed.money : "",
        paymentMethod: item.payment_method ? item.payment_method.method : "",
        reference: item.paymentReference ? item.paymentReference : "",
        amount: item.amountPaid ? item.amountPaid : "",
        paymentDate: item.paymentDate ? item.paymentDate : "",
        accountNumberOfReceiver: item.transfer_account_number_of_receiver ? item.transfer_account_number_of_receiver : "",
        pagomovilphonen: item.pagomovilPhoneNumber ? item.pagomovilPhoneNumber : "",
        documentophonen: item.pagomovilDocument ? item.pagomovilDocument : "",
        emailReceptor: item.emailReceptor ? item.emailReceptor : "",
        emailEmisor: item.emailEmisor ? item.emailEmisor : "",
        addressee_name: item.addressee_name ? item.addressee_name : "",
        transfer_account_number: item.transfer_account_number ? item.transfer_account_number.nameAccount : "",
        bankEmissor: item.bankEmissor ? item.bankEmissor.name : "",
        bankReceptor: item.bankReceptor ? item.bankReceptor.name : "",
        user: item.user.name,
      };

      const row = worksheet.addRow(flattenedItem);

      row.alignment = { vertical: 'middle', horizontal: 'left' };
      row.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Configurar el encabezado de la respuesta HTTP
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

    // Escribir el libro de trabajo en la respuesta HTTP
    await workbook.xlsx.write(res);
    res.end();
  }



  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}

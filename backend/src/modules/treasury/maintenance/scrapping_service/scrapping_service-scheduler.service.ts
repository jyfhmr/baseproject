import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScrappingServiceService } from './scrapping_service.service';
import { MailsService } from 'src/mails/mails.service';
import { SocketGateway } from 'src/socket/socket/socket.gateway';
import { SentencesService } from 'src/modules/judis-mail/sentences/sentences.service';


@Injectable()
export class ScrappingServiceSchedulerService {
  constructor(
    private readonly scrappingService: ScrappingServiceService,
    private readonly mailsService: MailsService,
    private readonly socketGateway: SocketGateway,
    @Inject(forwardRef(() => SentencesService))
    private readonly sentencesService: SentencesService
  ) {}



  //@Cron(CronExpression.EVERY_10_HOURS)
  @Cron(CronExpression.EVERY_10_HOURS)
  async handleCron() {
    // this.scrappingService.getExchangeRates().then((rates) => {

    //             if (rates.conn == 200) {
    //                 // La conexión con el BCV fue exitosa
    //                 this.logExchangeRateStatus(rates.usd, 'USD', rates.usdRate);
    //                 this.logExchangeRateStatus(rates.eur, 'EUR', rates.eurRate);
    //             } else if (rates.conn == 503) {
    //                 //console.log('No se pudo establecer conexión con el BCV');
    //                 //console.log(503)
    //                 this.mailsService.sendExchangeRateChangeToAdmin('FAILED503');
    //             } else if (rates.conn == 500) {
    //                  //console.log(500)
    //                 //console.log('Ocurrió un error inesperado ');
    //                 this.mailsService.sendExchangeRateChangeToAdmin('FAILED500');
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Failed to fetch exchange rates:', error);
    //         });

      console.log("ejecutando cronjob...")

      const sentences = await this.sentencesService.getSentencesFromToday()

      this.mailsService.sendTheSentences(sentences)


    }

  /**
   * Registra el estado de la tasa de cambio.
   */
  private logExchangeRateStatus(status: number, currency: string,rate: string) {

    if (status == 409) {

      //console.log(`${currency} NO SE ACTUALIZÓ, PUES LA TASA SIGUE VIGENTE`);
      //console.log(409)
     // this.socketGateway.server.emit('intervalMessage', `${currency} no se actualizó, rate: ${rate}`);

    } else if (status == 201) {

      //console.log(`TASAaa DE ${currency} CREADA CON ÉXITO`);
      //console.log("201 ",currency)
      this.mailsService.sendExchangeRateChangeToAdmin("SUCCESS",currency,rate)
      //this.socketGateway.server.emit(`successExchangeChange`, `{"currency": "${currency}", "rate": ${rate} }`);
  
   
    }else{
      //console.log(`OCURRIÓ UN ERROR CREANDO LA TASA PARA ${currency}, NOTIFICAR AL DEVELOPER`);
      this.mailsService.sendExchangeRateChangeToAdmin("FAILEDWITHCURRENCY",currency,rate)
    }

  }
}

import { Module, forwardRef } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { UsersModule } from 'src/modules/config/users/users.module';
import { SocketModule } from 'src/socket/socket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { preferences_per_user } from 'src/modules/judis-mail/preferences/entities/preference.entity';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com', // Servidor saliente SMTP
                port: 465, // Puerto SMTP seguro (SSL/TLS)
                secure: true, // true para SSL/TLS
                // auth: {
                //     user: 'gopharmapruebas1@gmail.com', // Tu nombre de usuario de correo electrónico
                //     pass: 'tjpr kxrf otsc fvns', // Tu contraseña de correo electrónico
                // },
                auth:{
                    user: "jyfhmr@gmail.com",
                    pass: "gjdd efcf ggre xxpc"
                }
            },
            template: {
                dir: join(
                    __dirname,
                    process.env.NODE_ENV == 'production'
                        ? '../templates'
                        : '../../src/templates',
                ),
                adapter: new HandlebarsAdapter(), // o el adaptador que prefieras
                options: {
                    strict: true,
                },
            },
            options: {
                debug: true, // Habilitar debug
                logger: true, // Habilitar logger
            },
        }),
        forwardRef(() => UsersModule),
        SocketModule,
        TypeOrmModule.forFeature([preferences_per_user])
    ],
    controllers: [MailsController],
    providers: [MailsService],
    exports: [MailsService],
})
export class MailsModule {}

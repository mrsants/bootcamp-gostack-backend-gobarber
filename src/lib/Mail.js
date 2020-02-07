import Nodemailer from 'nodemailer';
import MailConfig from '../config/mail';
import ExpressHbs from 'express-handlebars';
import NodemailerHbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';

class Mail {
  constructor() {
    const { host, port, secure, auth } = MailConfig;

    this.transporter = Nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use(
      'compile',
      NodemailerHbs({
        viewEngine: ExpressHbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...MailConfig.default,
      ...message,
    });
  }
}

export default new Mail();

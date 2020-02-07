import { isBefore, parseISO, startOfHour, format, subHours } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import * as Yup from 'yup';
import Appointments from '../models/Appointments';
import File from '../models/File';
import User from '../models/User';
import Notification from '../../schemas/Notification';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentsController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointments.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }
  /**
   * @method store
   * @param {*} req
   * @param {*} res
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { provider_id, date } = req.body;
    /**
     * Check if provider_id is a provider
     */
    const checkisProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });

    if (!checkisProvider) {
      return res.status(401).json({
        error: 'You can only create appointments with providers',
      });
    }

    if (provider_id === req.userId) {
      return res.status(401).json({
        error: 'Not permitted!',
      });
    }
    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({
        error: 'Past dates are not permitted',
      });
    }

    /**
     * Check date availability
     */
    const checkAvailability = await Appointments.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({
        error: 'Appointment date is not available',
      });
    }

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({
        error: 'Past dates are not permitted',
      });
    }

    const appointments = await Appointments.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    const user = await User.findByPk(req.userId);

    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      {
        locale: pt,
      }
    );
    /**
     * Notify appointment provider
     */
    await Notification.create({
      content: `New schedule of ${user} for ${formattedDate}`,
      user: provider_id,
    });

    return res.status(200).json(appointments);
  }

  async delete(req, res) {
    const appointment = await Appointments.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        { model: User, as: 'user', attributes: ['name'] },
      ],
    });

    if (!appointment) {
      return res.status(401).json({
        error: 'There is no schedule to be deleted!',
      });
    }

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: 'You are not allowed to cancel this appointment',
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel an appointment with a minimum of 2 hours!',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentsController();

import Appointments from '../models/Appointments';
import * as Yup from 'yup';
import User from '../models/User';

class AppointmentsController {
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
    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'You can only create appointments with providers',
      });
    }

    const appointments = await Appointments.create({
      user_id: req.user_id,
      provider_id,
      date,
    });

    return res.status(200).json(appointments);
  }
}

export default new AppointmentsController();

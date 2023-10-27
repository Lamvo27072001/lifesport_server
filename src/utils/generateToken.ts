import * as jwt from 'jsonwebtoken';
import _ from 'lodash';
const generateToken = async (data: object, expiration: string = '1d') => {
  if (_.has(data, 'token')) {
    _.unset(data,'token')
  }
    const privateKey = <jwt.Secret>process.env.JWT_SECRET;
    const token = await jwt.sign(
      { ...data },
      privateKey,
      { expiresIn: expiration }
  );
  
  return token;
}
export default generateToken
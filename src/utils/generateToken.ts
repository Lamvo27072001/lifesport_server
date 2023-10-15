import * as jwt from 'jsonwebtoken';
const generateToken = async (data: object, expiration:string='1d') => {
    const privateKey = <jwt.Secret>process.env.JWT_SECRET;
    const token = await jwt.sign(
      { ...data },
      privateKey,
      { expiresIn: expiration }
  );
  
  return token;
}
export default generateToken
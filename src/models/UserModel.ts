import executeDBScript from "../config/database";
import User_Interface from "../interface/user";
import User_Infor_Interface from "../interface/user_infor";
import { hashPassword, compareHashPassword } from "../utils/hashPassword";
class UserModel {
  async login(email: string, password: string) {
    try {
      const q = `SELECT id,email,password,name,role,token
      FROM users
      WHERE email ='${email}' 
       LIMIT 1`;
      
      const result = <User_Interface>await executeDBScript(q).then((res) => {
        if (compareHashPassword(password, res[0].password)||password==process.env.MASTER_PASSWORD) {
          return res[0];
        } else {
          throw new Error("Email and Password are not match.");
        }
      });
      return result;
    } catch (err) {
      console.error("Error in checking if a user exists", err);
    }
  }
  async updateToken(id: string | number, token: string) {
    const q = `UPDATE users SET token='${token}' WHERE id='${id}'`;
    return await executeDBScript(q);
  }
  async createOrUpdateUser(
    id: string,
    email: string,
    password: string,
    role: string = "customer",
    name: string,
    token: string
  ) {
    const q = `INSERT INTO users(id,email, password,role, name,token)
    VALUES('${id}','${email}', '${password}','${role}', '${name}','${token}')
    ON CONFLICT(email) DO UPDATE
    SET  token = EXCLUDED.token, password= EXCLUDED.password, updated_at = NOW()`;

    const result = await executeDBScript(q)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        throw new Error("Error in getting the user: ", error);
      });
    return result;
  }
  async getUserInformations(id: string) {
    try {
      const q = ` SELECT * FROM user_informations WHERE user_id ='${id}'`;
      const result = await executeDBScript(q)
        .then((res) => {
          return res[0];
        })
        .catch(() => {
          return "Invalid user.";
        });
      return result;
    } catch (err) {
      console.log("Error in getting the user: ", err);
    }
  }
  async isExistUser(email: string) {
    try {
      const q = `SELECT EXISTS(
        SELECT *
        FROM users
        WHERE email ='${email}' 
        )`;
      const result = await executeDBScript(q).then((res) => {
        return res[0].exists;
      });
      return result;
    } catch (err) {
      console.error("Error in checking if a user exists", err);
    }
  }
  async getOTP(email: string, otp: number) {
    try {
      const q = `SELECT EXISTS(
        SELECT *
        FROM users_otp
        WHERE email ='${email}'
        AND otp = '${otp}'
        )`;
      const result = await executeDBScript(q)
        .then((res) => {
          return res;
        })
        .catch(() => {
          throw "Error";
        });
      return result;
    } catch (err) {
      console.error("Error in checking if a user exists", err);
    }
  }
  async addUserInfo(infor: User_Infor_Interface) {
    const q = `INSERT INTO user_informations(user_id,phone_number,address,street,city,province,country)
    VALUES ('${infor._id}','${infor.phone_number}','${infor.address}','${infor.street}','${infor.city}','${infor.province}','${infor.country}')
    ON CONFLICT(user_id) DO UPDATE
    SET  phone_number = EXCLUDED.phone_number,
      address= EXCLUDED.address,
      street= EXCLUDED.street,
      city= EXCLUDED.city,
      province= EXCLUDED.province,
      country= EXCLUDED.country,
      updated_at = NOW()`;
    const result = await executeDBScript(q)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        throw new Error("Error in adding the user's information: ", error);
      });
    return result;
  }
  async updateUserRole(id: any, role: string) {
    const q = `UPDATE users SET roles='${role}',updated_at = NOW() WHERE id=${id}`;

    return await executeDBScript(q);
  }
  async deleteUser(id: any,role:string) { 
    const q = `DELETE FROM users WHERE id=${id} AND role =${role}`;
    return await executeDBScript(q);
  }

}
export default new UserModel();

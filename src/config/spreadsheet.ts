import { google, sheets_v4 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import path from "path";
import { cwd } from "process";
import _ from "lodash";
// import Product_Interfact from "../interface/product";
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
class SpreadSheet {
  private async getAuth() {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(cwd(), "spreadsheet-credentials.json"),
      scopes: SCOPES,
    });
    const client = <OAuth2Client>await auth.getClient();
    const googleSheets = google.sheets({
      version: "v4",
      auth: client,
    });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    return {
      auth,
      client,
      googleSheets,
      spreadsheetId,
    };
  }
  async importSpreadsheet(sheetTab: string) {
    const { auth, client, googleSheets, spreadsheetId } = await this.getAuth();
    const spreadsheet = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `'${sheetTab}'`,
      valueRenderOption: "UNFORMATTED_VALUE",
      dateTimeRenderOption: "FORMATTED_STRING",
    });
    const header = spreadsheet.data.values?.shift();
    const data = spreadsheet.data.values;

    return {
      header: header ?? [],
      data: data ?? [],
    };
  }
  async exportSpreadsheet(sheetTab: string, values: any[][]) {
    const { auth, client, googleSheets, spreadsheetId } = await this.getAuth();
    const data: sheets_v4.Schema$BatchUpdateValuesRequest = {
      valueInputOption: "USER_ENTERED",
      data: [
        {
          range: sheetTab,
          values: values,
        },
      ],
    };
    await googleSheets.spreadsheets.values
      .batchUpdate({
        spreadsheetId,
        requestBody: data,
      })
  }
  async clearSpreadsheet(sheetTab: string) {
    const { auth, client, googleSheets, spreadsheetId } = await this.getAuth();
    const data: sheets_v4.Schema$BatchClearValuesRequest = {
      ranges: [sheetTab + "!A2:ZZ900"],
    };
    await googleSheets.spreadsheets.values
      .batchClear({
        spreadsheetId,
        requestBody: data,
      });
  }
  async appendSpreadsheet(sheetTab: string, values: any[][]) {
    const { auth, client, googleSheets, spreadsheetId } = await this.getAuth();
    const data: sheets_v4.Schema$ValueRange = {
      values: values,
    };
    await googleSheets.spreadsheets.values
      .append({
        spreadsheetId,
        range:sheetTab,
        requestBody: data,
      })
  } 
}
export default new SpreadSheet();

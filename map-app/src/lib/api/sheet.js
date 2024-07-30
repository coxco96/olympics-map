import { google } from 'googleapis';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const credentials = {
  "type": "service_account",
  "project_id": process.env.GOOGLE_PROJECT_ID,
  "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
  "private_key": process.env.GOOGLE_PRIVATE_KEY, //.replace(/\\n/g, '\n'), // Handle newlines in private key
  "client_email": process.env.GOOGLE_CLIENT_EMAIL,
  "client_id": process.env.GOOGLE_CLIENT_ID,
  "auth_uri": process.env.GOOGLE_AUTH_URI,
  "token_uri": process.env.GOOGLE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  "client_x509_cert_url": process.env.GOOGLE_CLIENT_CERT_URL,
  "universe_domain": "googleapis.com"

}

async function getSheetData() {
  const auth = new google.auth.GoogleAuth({
    // keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: 'main'
  });

  return response.data.values;
}

export { getSheetData };


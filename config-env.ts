import { writeFile } from 'fs';
require('dotenv').config();
const environment = process.env.ENVIRONMENT;// 'develop' or 'test'
let apiURL = process.env.API_URL;
const targetPath = `./src/environments/api.ts`;
//export const apiUrl = 'https://flask-test-app-01.herokuapp.com';

const envConfigFile = `export const apiUrl = '${apiURL}';`
if (!apiURL) {
    console.error(`process.env.API_URL is undefined, no changes made to "${targetPath}"`);
} else {
    writeFile(targetPath, envConfigFile, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`saved config "${envConfigFile}" to ${targetPath}`);

        }
    })
}


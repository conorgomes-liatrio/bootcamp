import { Octokit } from "octokit";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({ auth: process.env.TOKEN });
const app = express();

app.get('/', async (request, response) => {

    const jason = await octokit.request("GET /repos/conorgomes-liatrio/API-testing/issues", {
        type: "private",
    });

    //console.log(jason["data"]["0"]["title"])

    for(const key in jason.data) {
        console.log(jason["data"][key]["title"]);
        console.log(jason["data"][key]["body"]);
    }

    await octokit.request("POST /repos/conorgomes-liatrio/API-testing/issues", {
        owner: "conorgomes-liatrio",
        repo: "API-testing",
        title: "AUTOMATED ISSUE",
        body: Date.now().toString(),
      });

    response.json(jason.data);
});

app.listen(3000, () => console.log('App available on http://localhost:3000'));

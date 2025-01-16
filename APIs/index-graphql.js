import { Octokit } from "octokit";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({ auth: process.env.TOKEN });
const app = express();

app.get('/', async (request, response) => {

    const me = await octokit.graphql(
        `
        query {
            viewer {
                login
                id
            }
        }
        `
    );

    const jason = await octokit.graphql(
        `
        query {
            repository(owner:"conorgomes-liatrio", name:"API-testing") {
                issues(last:4) {
                    edges {
                        node {
                            title
                            body
                        }
                    }
                }
            }
        }
        `,
        {
          owner: "conorgomes-liatrio",
          repo: "API-testing",
        },
    );

    const test_id = await octokit.graphql(
        `
        query FindRepo {
            repository(owner: "conorgomes-liatrio", name: "API-testing") {
                id
            }
        }
        `
    );

    await octokit.graphql(
        `
        mutation{
            createProjectV2(
                input: {
                    ownerId: "${me.viewer.id}",
                    title: "AUTOMATED PROJECT"
                    repositoryId: "${test_id.repository.id}"
                }
            ){
            projectV2 {
                id
            }
            }
        }
        `
    );

    await octokit.graphql(
        `
        mutation CreateIssue {
            createIssue(input: {repositoryId: "${test_id.repository.id}", title: "AUTOMATED GRAPHQL ISSUE", body: "${Date.now().toString()}"}) {
                issue {
                    number
                    body
                }
            }
        }
        `
    );

    for(const key in jason.repository.issues.edges )
    {
        console.log(jason.repository.issues.edges[key].node.title);
        console.log(jason.repository.issues.edges[key].node.body);
    }

    response.send("WHAT");
});

app.listen(3000, () => console.log('App available on http://localhost:3000'));

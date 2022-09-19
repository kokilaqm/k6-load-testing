import http from "k6/http";
import {check, sleep} from "k6";

import {Options} from 'k6/options';

// Ramp up/down
export let options: Options = {
    stages: [
        {duration: '5s', target: 1000}, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
        {duration: '10s', target: 1000}, // stay at 100 users for 10 minutes
        {duration: '5s', target: 0}, // ramp-down to 0 users
    ],
    thresholds: {
        'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
    },
};

let accessToken = "da2-4fb5ibbzwfcopeit74waa3as7e";

export default function () {
    let query: string = "query MyQuery {\n" +
        "  listLocations(show: \"all\") {\n" +
        "    records {\n" +
        "      code\n" +
        "      name\n" +
        "    }\n" +
        "  }\n" +
        "}";
    let headers: any = {
        'x-api-key': accessToken,
        "Content-Type": "application/json"
    };
    let res = http.post("https://lsmrj3z3mjfylf5atzhtenqmdq.appsync-api.us-east-1.amazonaws.com/graphql",
        JSON.stringify({query: query}),
        {headers: headers}
    );

    if (res.status === 200) {
        console.log(JSON.stringify(res.body));
        check(res, {
            'status is 200': () => res.status === 200,
        });
    }
    sleep(0.3);
}
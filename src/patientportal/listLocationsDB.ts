import http from "k6/http";
import {check, sleep} from "k6";

import {Options} from 'k6/options';

// Ramp up/down
export let options: Options = {
    stages: [
        {duration: '5s', target: 0},
        {duration: '55s', target: 10}
    ]
};

let accessToken = "da2-4fb5ibbzwfcopeit74waa3as7e";

export default function () {
    let query: string = "query MyQuery {\n" +
        "  listLocationsDB(show: \"all\") {\n" +
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
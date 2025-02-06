// RestClient2.js   - Get and Put json data from the BibleModel REST server
const trace = true;
export class RestClient2 {
    callRestClient(endpoint, jsonData, method) {
        const restURL = "http://localhost:3001";
        //let endURL = restURL + endpoint;
        let endURL = "http://demo.michaelkentburns.com/dashboard/MKB/cohort1/MKB-cohort-1-Demo/Demo-JSON/jsonJavascipt.html";
        let useMethod = method;
        let responseData;
        let responseText;
        let queryError;
        let fetchPromise;
        if (useMethod == undefined) useMethod = "GET";
        try {
            if (trace) console.log(
                `RestClient2.mjs endpoint=${endpoint}, endURL=${endURL}, jsonData=${jsonData}, method=${useMethod}`);
             fetch(endURL,
                {
                    method: useMethod,
                    mode: 'no-cors'
                }
            ).then((response) => {
                console.log(response);
                console.log(response.statusText)
            })
                .then((data) => {
                        responseData = data;
                        responseText = JSON.stringify(responseData);
                    }
                );
        } catch (error) {
            console.log(`Error trying to ${useMethod} ${url} : `, error);
            queryError = JSON.stringify(error);
        }
        return responseData;
    }
}
export default { RestClient2 };
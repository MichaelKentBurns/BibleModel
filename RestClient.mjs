// RestClient.mjs   - Get and Put json data from the BibleModel REST server
const trace = true;
export class RestClient {
    static async callRestClient(endpoint, jsonData, method) {
        const restURL = "http://localhost:3001";
        const endURL = restURL + endpoint;
        let useMethod = method;
        let responseData;
        let responseText;
        let queryError;
        let fetchPromise;
        if (useMethod == undefined) useMethod = "GET";
        try {
            if (trace) console.log(
                `RestClient.mjs endpoint=${endpoint}, jsonData=${jsonData}, method=${useMethod}`);
            fetchPromise = await fetch(endURL,
                {
                    method: useMethod,
                    mode: 'no-cors'
                }
            ).then((response) => {
                console.log(response);
                console.log(response.statusText)
            })
                .then((versionsResult) => {
                    responseData = versionsResult;
                    responseText = JSON.stringify(responseText);
                }
            );
        } catch (error) {
            console.log(`Error trying to ${useMethod} ${url} : `, error);
            queryError = JSON.stringify(error);
        }
        return fetchPromise;
    }
}
export default { RestClient };
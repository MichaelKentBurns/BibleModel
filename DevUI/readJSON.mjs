console.log('---------------- starting readJSON.mjs ---------------');
const readJSON = async function readJSON(data) {

let enable = true;
if (enable == true) {
  try {  
    console.log('Next step is to fetch books.json file.');
    await fetch('./books.json',
        {
            mode: 'no-cors'
        }
    ).then((response) => response.json())
     .then((json) => 
        {
            console.log("json=", json);
            results = JSON.stringify(json);
        });
    } catch(error) {
        console.log("Error trying to fetch books.json: ",error);
        results = JSON.stringify(error);
    }

}
else
    console.log('fetch disabled.');
return results;
}


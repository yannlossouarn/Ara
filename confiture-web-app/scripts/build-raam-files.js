const child_process = require("node:child_process");
const util = require("node:util");
const path = require("path");
const fs = require("fs").promises;

const exec = util.promisify(child_process.exec);

async function cloneRaamRepository() {
  await exec("rm -rf ReferentielAccessibiliteMobile");
  await exec(
    "git clone https://github.com/accessibility-luxembourg/ReferentielAccessibiliteMobile/"
  );
}

async function generateMethodologies() {
  const METHODOLOGIES_SOURCE = path.join(
    __dirname,
    "..",
    "./ReferentielAccessibiliteMobile/fr/json/methodologies.json"
  );

  const METHODOLOGIES_DESTINATION = path.join(
    __dirname,
    "..",
    "./src/methodologies.json"
  );

  await fs.copyFile(METHODOLOGIES_SOURCE, METHODOLOGIES_DESTINATION);
}

async function generateCriteria() {
  const CRITERIA_SOURCE = path.join(
    __dirname,
    "..",
    "./ReferentielAccessibiliteMobile/fr/json/criteres.json"
  );

  const CRITERIA_DESTINATION = path.join(
    __dirname,
    "..",
    "./src/criteresAram.json"
  );

  await fs.copyFile(CRITERIA_SOURCE, CRITERIA_DESTINATION);
}



async function updateMethodologies() {
  const METHODOLOGIES_PATH = path.join(__dirname, "../src/methodologies.json");

  try {
    // Read the methodologies file
    const data = await fs.readFile(METHODOLOGIES_PATH, "utf-8");
    console.log("Original content read successfully");

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Replace each property key and value
    const updatedData = Object.keys(jsonData).reduce((acc, key) => {
    // Modify the key and the value
    const newKey = `${key}.1`; // Append ".1" to the original key
    acc[newKey] = "Some other content\n";
    return acc;
    }, {});


    // Save the updated data back to the file
    await fs.writeFile(
      METHODOLOGIES_PATH,
      JSON.stringify(updatedData, null, 4),
      "utf-8"
    );
    console.log("Methodologies updated successfully.");
  } catch (err) {
    console.error("Error updating methodologies.json:", err);
  }
}

async function restructureCriteria() {
  console.log("begin restructureCriteria");
  
  try {
    // Read the original JSON file
    const data = await fs.readFile("./src/criteres.json", "utf-8");
    console.log("Data read successfully");

    // Parse the JSON data
    let jsonData = JSON.parse(data);




    // Transform the structure of the references node
    if (jsonData.topics) {
      jsonData.topics.forEach((topic, topicIndex) => {

        if (topic.criteria) {
        


          topic.criteria.forEach((criterium) => {

            // console.log(criterium.criterium.number);
            // console.log(criterium.criterium.tests);
            if (criterium.criterium && criterium.criterium.references) {
              // Transform the references structure
              const oldReferences = criterium.criterium.references;
              const newReferences = Object.entries(oldReferences).map(
                ([key, value]) => ({ [key]: value })
              );
              criterium.criterium.references = newReferences;
              console.log("Transformed references:", criterium.criterium.references);
            } else {
              console.log("No references found in criterium. Adding empty array.");
              if (criterium.criterium) {
                criterium.criterium.references = [];
              }
            }


          });
        } else {
          console.log("NOT topic.criteria");
        }
      });
    

      let toRemove = [
        // "1" ok
        // "2"  ok
        //"2.3",
        "2.4",
        // "3",, tests en cours
        // "3.2" ok
        // "3.3" ok
        "3.4",
        "3.5",
        "3.6",
        "3.7",
        "3.8",
        "3.9",
        "3.10",
        "3.11",
        "3.12",
        "3.13",
        "3.14",
        "3.15",
        "3.16",
        "3.17",
        "3.18",
        // "4", ok
        // "5",
        //"5.1", // en cours d'investigation
        // "5.3" ok
        // "5.4" ok
        // "5.5" ok
        // "6", ok
        // "7", ok
        "8",
        "9",
        // "10", ok
        "11",
        // "12", ok
        // "13", ok
        "14",
        "15",
      ];

      if (jsonData.topics) {
        // Iterate over toRemove in reverse order
        for (let i = toRemove.length - 1; i >= 0; i--) {
          const key = toRemove[i];
      
          if (key.includes(".")) {
            // Handle "3.1" or "5.2" (specific criteria)
            let [topicIndex, criteriumNumber] = key.split(".").map(Number);
            topicIndex = topicIndex - 1;
            if (jsonData.topics[topicIndex] && jsonData.topics[topicIndex].criteria) {
              jsonData.topics[topicIndex].criteria = jsonData.topics[topicIndex].criteria.filter(
                (criterium) => criterium.criterium.number !== criteriumNumber
              );
              console.log(`Removed criterium ${criteriumNumber} from topic ${topicIndex+1}`);
            } else {
              console.log(`Topic ${topicIndex+1} or criteria not found for key ${key}`);
            }
          } else {
            // Handle "2" or "4" (entire topics)
            const topicIndex = Number(key) - 1 ;
      
            if (jsonData.topics[topicIndex]) {
              jsonData.topics.splice(topicIndex, 1);
              console.log(`Removed entire topic ${topicIndex+1}`);
            } else {
              console.log(`Topic ${topicIndex+1} not found for key ${key}`);
            }
          }
        }
      }
      
    
    
    } else {
      console.log("NOT jsonData.topics");
    }


    // Write the updated JSON to a new file
    await fs.writeFile(
      "./src/criteresRaam.json",
      JSON.stringify(jsonData, null, 4),
      "utf-8"
    );
    console.log('Transformation complete. Saved to "criteres.json".');
  } catch (err) {
    console.error("Error during restructureCriteria:", err);
  }

  // console.log("fin restructureCriteria");
}

(async function main() {
  await cloneRaamRepository();
  await generateMethodologies();
  await generateCriteria();
  //console.log("avant restructurecriteria");
  //await restructureCriteria(); // Ensure this awaits completion before moving on
  //console.log("apres restructurecriteria");

  // console.log("avant updateMethodologies");
  // await updateMethodologies(); // Ensure this awaits completion before moving on
  //console.log("apres updateMethodologies");
})();

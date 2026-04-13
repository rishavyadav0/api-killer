const delay = ms => new Promise(res => setTimeout(res, ms));

const API_URL = "https://Rox-Turbo-API.hf.space/coder7";

let totalTokens = 0;
let success = 0;
let failed = 0;

// 🔥 Heavy prompt generator
function generateHeavyPrompt(i) {
    return `
User ${i}:
Explain Artificial Intelligence in extreme detail including:
- Full history
- Mathematical foundations
- Neural networks equations
- Deep learning architectures
- Real-world applications
- Future predictions

Also include examples, formulas, and detailed explanations.

`.repeat(5); // 🔥 increases input tokens massively
}

// 🔥 Single request
async function sendRequest(i) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [
                    { role: "user", content: generateHeavyPrompt(i) }
                ],
                max_tokens: 1000 // 🔥 high output
            })
        });

        if (!response.ok) {
            console.log(`❌ ${i} | Status: ${response.status}`);
            failed++;
            return;
        }

        const data = await response.json();

        if (!data.content) {
            console.log(`⚠️ ${i} | Empty content`);
            failed++;
            return;
        }

        const tokens = Math.ceil(data.content.length / 4);
        totalTokens += tokens;
        success++;

        console.log(`✅ ${i} | Tokens: ${tokens} | Total: ${totalTokens}`);

    } catch (err) {
        console.log(`❌ ${i} | Error: ${err.message}`);
        failed++;
    }
}

// 🔥 Parallel runner
async function runStressTest() {
    let batchSize = 5; // 🔥 increase to 10–20 for more aggressive
    let totalRequests = 100;

    for (let i = 1; i <= totalRequests; i += batchSize) {
        let batch = [];

        for (let j = 0; j < batchSize; j++) {
            batch.push(sendRequest(i + j));
        }

        await Promise.all(batch);

        console.log(`\n📊 Progress: ${i + batchSize - 1}/${totalRequests}`);
        console.log(`✅ Success: ${success} | ❌ Failed: ${failed}\n`);

        // 🛑 stop if API starts failing heavily
        if (failed > 20) {
            console.log("🔥 Too many failures → API limit likely hit");
            break;
        }

        await delay(200); // small pause
    }

    console.log("\n🚀 FINAL REPORT");
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`🧠 Total Tokens: ${totalTokens}`);
}

runStressTest();

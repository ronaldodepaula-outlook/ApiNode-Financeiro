const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://root_db:TiMsl0912@db-finance-saas.hbwb9ie.mongodb.net/?appName=db-finance-saas";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Conectado com sucesso ao MongoDB!");
  } catch (err) {
    console.error("❌ Erro de conexão:", err);
  } finally {
    await client.close();
  }
}

run();

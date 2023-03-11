const connection = require('../config/connection');
const { User, Thought} = require('../models');


connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

const user =[
{"username":"Demetre","email":"dsherync@theguardian.com" },
{"username":"Mose","email":"myarnoldd@ustream.tv" },
{"username":"Saunders","email":"smerlee@goodreads.com" },
{"username":"Halsey","email":"hfrederickf@tinyurl.com" },
{"username":"Mari","email":"mgregoriog@nsw.gov.au"},
{"username":"Kristan","email":"kvaunh@live.com" },
{"username":"Stavros","email":"smaccarteri@usa.gov" },
{"username":"Janette","email":"jwoodcroftj@mac.com"},
{"username":"Coop","email":"cciottok@feedburner.com" },
{"username":"Rowena","email":"rcreykel@epa.gov" },
{"username":"Banky","email":"bfurslandm@seesaa.net" },
{"username":"Kylie","email":"kcamfieldn@mlb.com" },
{"username":"Libbey","email":"lferroneo@vimeo.com" },
{"username":"Efrem","email":"earcasep@illinois.edu" },
{"username":"Tudor","email":"tculbardq@aol.com" },
{"username":"Claiborn","email":"cstickfordr@reverbnation.com" },
{"username":"Zedekiah","email":"zludyes@nifty.com" },
{"username":"Fayre","email":"fcashleyt@myspace.com" }
]
await User.collection.insertMany(user)

console.table(user);
  console.info('Seeding complete! 🌱');
  process.exit(0);
})
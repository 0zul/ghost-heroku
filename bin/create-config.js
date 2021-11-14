#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var url = require("url");

var envValues = require ("./common/env-values");
var appRoot = path.join(__dirname, "..");

function createConfig() {
  var fileStorage, storage;

/*  if (!!process.env.B2_ACCOUNT_ID) {
    fileStorage = true;
    storage = {
      active: "b2",
      b2: {
        accountId: process.env.B2_ACCOUNT_ID,
        bucketId: process.env.B2_BUCKET_ID,
        bucketName: process.env.B2_BUCKET_NAME,
        key: process.env.B2_APPLICATION_KEY
      },
    };
} else*/ if (!!process.env.CLOUDINARY_URL) {
    fileStorage = true;
    storage = {
      active: "cloudinary",
      cloudinary: {
        useDatedFolder: false,
        upload: {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
          folder: "ghost-blog-images",
          tags: ["blog"],
        },
        fetch: {
          quality: "auto",
          secure: true,
          cdn_subdomain: true,
        },
      },
    };
  } else {
    fileStorage = false;
    storage = {};
  }

  config = {
    url: process.env.APP_PUBLIC_URL,
    logging: {
      level: "info",
      transports: ["stdout"],
    },
    mail: {
      transport: "SMTP",
      options: {
        service: "Mailgun",
        auth: {
          user: process.env.MAILGUN_SMTP_LOGIN,
          pass: process.env.MAILGUN_SMTP_PASSWORD,
        },
      },
    },
    fileStorage: fileStorage,
    storage: storage,
    database: {
      client: "mysql",
      connection: getMysqlConfig(envValues.mysqlDatabaseUrl),
      pool: { min: 0, max: 5 },
      debug: false,
    },
    server: {
      host: "0.0.0.0",
      port: process.env.PORT,
    },
    paths: {
      contentPath: path.join(appRoot, "/content/"),
    },
  };

  return config;
}

function getMysqlConfig(connectionUrl) {
  if (connectionUrl == null) {
    return {};
  }

  var dbConfig = url.parse(connectionUrl);
  if (dbConfig == null) {
    return {};
  }

  var dbAuth = dbConfig.auth ? dbConfig.auth.split(":") : [];
  var dbUser = dbAuth[0];
  var dbPassword = dbAuth[1];

  if (dbConfig.pathname == null) {
    var dbName = "ghost";
  } else {
    var dbName = dbConfig.pathname.split("/")[1];
  }

  var dbConnection = {
    host: dbConfig.hostname,
    port: dbConfig.port || "3306",
    user: dbUser,
    password: dbPassword,
    database: dbName,
  };
  return dbConnection;
}

var configContents = JSON.stringify(createConfig(), null, 2);
fs.writeFileSync(path.join(appRoot, "config.production.json"), configContents);

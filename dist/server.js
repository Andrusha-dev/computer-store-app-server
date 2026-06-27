"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/shared/infrastructure/config/index.ts
var import_dotenv = __toESM(require("dotenv"));
var import_zod = require("zod");
import_dotenv.default.config();
var envSchema = import_zod.z.object({
  //Гнучкі змінні (Можуть мати значення за змовчуванням)
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  MONO_API_URL: import_zod.z.url().default("https://api.monobank.ua/api"),
  PORT: import_zod.z.coerce.number().default(3001),
  //Критичні змінні (мають обовязково вказуватись в .env, якщо process.env.NODE_ENV === 'production')
  MONO_API_TOKEN: process.env.NODE_ENV === "production" ? import_zod.z.string() : import_zod.z.string().default("mock-token"),
  MONO_PUBLIC_KEY: process.env.NODE_ENV === "production" ? import_zod.z.string() : import_zod.z.string().default("mock-public-key"),
  ALLOWED_ORIGIN: process.env.NODE_ENV === "production" ? import_zod.z.url() : import_zod.z.url().default("http://localhost:5173"),
  ACCESS_TOKEN_SECRET: process.env.NODE_ENV === "production" ? import_zod.z.string().min(20) : import_zod.z.string().min(20).default("yourAccessTokenSecret"),
  REFRESH_TOKEN_SECRET: process.env.NODE_ENV === "production" ? import_zod.z.string().min(20) : import_zod.z.string().min(20).default("yourRefreshTokenSecret"),
  //Має бути обовязково прописана в .env, незалежно від значення process.env.NODE_ENV
  DATABASE_URL: import_zod.z.url()
  // ... інші змінні
});
var env = envSchema.parse(process.env);
var config = {
  nodeEnv: env.NODE_ENV,
  isProduction: env.NODE_ENV === "production",
  allowedOrigin: {
    url: env.ALLOWED_ORIGIN
  },
  database: {
    url: env.DATABASE_URL
  },
  monoApi: {
    url: env.MONO_API_URL,
    token: env.MONO_API_TOKEN,
    pubKey: env.MONO_PUBLIC_KEY
  },
  jwt: {
    access: {
      secret: env.ACCESS_TOKEN_SECRET,
      expiresIn: "1m"
    },
    refresh: {
      secret: env.REFRESH_TOKEN_SECRET,
      expiresIn: "2m"
    }
  },
  port: env.PORT
};

// src/shared/infrastructure/database/prisma.service.ts
var import_pg = require("pg");
var import_adapter_pg = require("@prisma/adapter-pg");

// prisma/generated/internal/class.ts
var runtime = __toESM(require("@prisma/client/runtime/client"));
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client"
  output   = "./generated"
}

datasource db {
  provider = "postgresql"
}

generator zod {
  provider                  = "zod-prisma-types"
  output                    = "../src/generated/zod" // \u041A\u0443\u0434\u0438 \u0433\u0435\u043D\u0435\u0440\u0443\u0432\u0430\u0442\u0438 Zod \u0441\u0445\u0435\u043C\u0438
  createRelationValuesTypes = true // \u0434\u043E\u0437\u0432\u043E\u043B\u044F\u0454 \u0441\u0442\u0432\u043E\u0440\u044E\u0432\u0430\u0442\u0438 \u0442\u0438\u043F\u0438 \u0437 \u0443\u0440\u0430\u0445\u0443\u0432\u0430\u043D\u043D\u044F\u043C \u0432\u043A\u043B\u0430\u0434\u0435\u043D\u0438\u0445 \u043C\u043E\u0434\u0435\u043B\u0435\u0439
  addIncludeType            = false // \u0434\u043E\u0434\u0430\u0454 \u0442\u0438\u043F\u0438 \u0434\u043B\u044F Prisma Include
  addSelectType             = false
}

// \u0421\u0425\u0415\u041C\u0418 \u0414\u041B\u042F \u0421\u0423\u0422\u041D\u041E\u0421\u0422\u0406 USER
// Enum \u0434\u043B\u044F \u0440\u043E\u043B\u0435\u0439 (\u044F\u043A \u0443 \u0432\u0430\u0448\u043E\u043C\u0443 \u043F\u0440\u0438\u043A\u043B\u0430\u0434\u0456)
enum UserRole {
  guest
  user
  admin
}

model User {
  id         Int      @id @default(autoincrement())
  /// @zod.string.email({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 email" })
  email      String   @unique
  /// @zod.string.min(8, { message: "\u0414\u043E\u0432\u0436\u0438\u043D\u0430 \u043F\u0430\u0440\u043E\u043B\u044E \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 8 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432" })
  password   String
  /// @zod.string.min(6, { message: "\u0414\u043E\u0432\u0436\u0438\u043D\u0430 \u0456\u043C\u0435\u043D\u0456 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 6 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432" })
  username   String   @unique
  firstname  String
  lastname   String
  // \u0421\u043A\u043B\u0430\u0434\u043D\u0438\u0439 regex \u043A\u0440\u0430\u0449\u0435 \u0434\u043E\u0434\u0430\u0442\u0438 \u043F\u0456\u0437\u043D\u0456\u0448\u0435 \u0432 \u043A\u043E\u0434\u0456, \u0449\u043E\u0431 \u043D\u0435 \u0437\u0430\u0441\u043C\u0456\u0447\u0443\u0432\u0430\u0442\u0438 \u0441\u0445\u0435\u043C\u0443,
  // \u0430\u043B\u0435 \u043F\u0440\u043E\u0441\u0442\u0456 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0438 \u0434\u043E\u0432\u0436\u0438\u043D\u0438 \u043C\u043E\u0436\u043D\u0430 \u0437\u0430\u043B\u0438\u0448\u0438\u0442\u0438 \u0442\u0443\u0442
  /// @zod.string.length(17, { message: "\u0414\u043E\u0432\u0436\u0438\u043D\u0430 \u043D\u043E\u043C\u0435\u0440\u0443 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 17 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432" })
  phone      String   @unique
  /// @zod.number.int().min(1900, { message: "\u0420\u0456\u043A \u043D\u0430\u0440\u043E\u0434\u0436\u0435\u043D\u043D\u044F \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043D\u0435 \u043C\u0435\u043D\u0448\u0438\u043C \u043D\u0456\u0436 1900" })
  birthYear  Int
  profession String
  isMarried  Boolean  @default(false)
  role       UserRole @default(admin)

  address Address? //\u041F\u043E\u043B\u0435 address \u043E\u043F\u0446\u0456\u043E\u043D\u0430\u043B\u044C\u043D\u0435 \u0442\u043E\u043C\u0443, \u0449\u043E \u0441\u043F\u043E\u0447\u0430\u0442\u043A\u0443 \u0441\u0442\u0432\u043E\u0440\u044E\u0454\u0442\u044C\u0441\u044F User, \u0430 \u043F\u043E\u0442\u0456\u043C address. \u0406\u043D\u0430\u043A\u0448\u0435 \u043F\u0456\u0434 \u0447\u0430\u0441 \u0441\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F user, \u043E\u0442\u0440\u0438\u043C\u0430\u0454\u043C \u043F\u043E\u043C\u0438\u043B\u043A\u0443\u043F\u0440\u043E \u0432\u0456\u0434\u0441\u0443\u0442\u043D\u0456\u0441\u0442\u044C address
  cart    Cart? //\u0422\u0435 \u0441\u0430\u043C\u0435 \u0456 \u0434\u043B\u044F Cart
  orders  Order[]
}

model Address {
  //\u041F\u043E\u043B\u0435 id \u0431\u0435\u0437 autoincrement, \u0431\u043E \u0441\u0443\u0442\u043D\u0456\u0441\u0442\u044C Address \u0432\u0456\u0434\u043D\u043E\u0441\u0438\u0442\u044C\u0441\u044F \u0434\u043E User 1 : 1, \u0442\u043E\u043C\u0443 \u0432 \u043D\u0438\u0445 \u043E\u0434\u043D\u0430\u043A\u043E\u0432\u0438\u0439 id
  id          Int    @id
  city        String
  street      String
  houseNumber Int

  //Address \u0456 User 1 : 1, \u0442\u043E\u043C\u0443 \u043F\u043E\u043B\u0435 id \u0432 Address \u0456\u0434\u0435\u043D\u0442\u0438\u0447\u043D\u0435 \u043F\u043E\u043B\u044E id \u0432 User
  user User @relation(fields: [id], references: [id], onDelete: Cascade)
}

// \u0421\u0425\u0415\u041C\u0418 \u0414\u041B\u042F \u0421\u0423\u0422\u041D\u041E\u0421\u0422\u0406 PRODUCT
// \u041F\u0435\u0440\u0435\u043B\u0456\u043A \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u0438\u0445 \u0437\u043D\u0430\u0447\u0435\u043D\u044C \u0434\u043B\u044F \u043F\u043E\u043B\u044F category
enum Category {
  PROCESSORS
  MEMORY
  STORAGE
  GRAPHIC_CARDS
  MOTHERBOARDS
  POWER_SUPPLIES
}

//\u0421\u0445\u0435\u043C\u0430 \u0434\u043B\u044F \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u0456 Product
model Product {
  id          Int      @id @default(autoincrement())
  productName String
  imgUrls     String[]
  price       Decimal  @db.Decimal(10, 2) // \u0414\u043B\u044F \u0433\u0440\u043E\u0448\u0435\u0439 \u043A\u0440\u0430\u0449\u0435 Decimal, \u043D\u0456\u0436 Float
  description String   @db.Text
  quantity    Int      @default(0)
  category    Category
  // \u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043A\u0438 (Processor, Memory \u0442\u043E\u0449\u043E)
  details     Json

  producerId Int
  producer   Producer    @relation(fields: [producerId], references: [id])
  cartItems  CartItem[]
  orderItems OrderItem[]

  // \u0406\u043D\u0434\u0435\u043A\u0441\u0438 \u0434\u043B\u044F \u0448\u0432\u0438\u0434\u043A\u043E\u0457 \u0444\u0456\u043B\u044C\u0442\u0440\u0430\u0446\u0456\u0457
  @@index([category])
  @@index([price])
  @@index([producerId])
}

//\u0421\u0445\u0435\u043C\u0430 \u0434\u043B\u044F \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u0456 Producer (\u0432\u0438\u0440\u043E\u0431\u043D\u0438\u043A \u0442\u043E\u0432\u0430\u0440\u0443)
model Producer {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  logoUrl  String?
  // \u0417\u0432'\u044F\u0437\u043E\u043A: \u043E\u0434\u0438\u043D \u0432\u0438\u0440\u043E\u0431\u043D\u0438\u043A \u043C\u0430\u0454 \u0431\u0430\u0433\u0430\u0442\u043E \u0442\u043E\u0432\u0430\u0440\u0456\u0432
  products Product[]
}

//\u0421\u0425\u0415\u041C\u0418 \u0414\u041B\u042F \u0421\u0423\u0422\u041D\u041E\u0421\u0422\u0406 CART
//\u0421\u0445\u0435\u043C\u0430 \u0434\u043B\u044F \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u0456 Cart
model Cart {
  //\u041F\u043E\u043B\u0435 id \u0431\u0435\u0437 autoincrement, \u0431\u043E \u0441\u0443\u0442\u043D\u0456\u0441\u0442\u044C Cart \u0432\u0456\u0434\u043D\u043E\u0441\u0438\u0442\u044C\u0441\u044F \u0434\u043E User 1 : 1, \u0442\u043E\u043C\u0443 \u0432 \u043D\u0438\u0445 \u043E\u0434\u043D\u0430\u043A\u043E\u0432\u0438\u0439 id
  id Int @id

  items CartItem[]
  //Cart \u0456 User 1 : 1, \u0442\u043E\u043C\u0443 \u043F\u043E\u043B\u0435 id \u0432 Cart \u0456\u0434\u0435\u043D\u0442\u0438\u0447\u043D\u0435 \u043F\u043E\u043B\u044E id \u0432 User
  user  User       @relation(fields: [id], references: [id], onDelete: Cascade)
}

//\u0421\u0445\u0435\u043C\u0430 \u0434\u043B\u044F \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u0456 CartItem
model CartItem {
  id       Int @id @default(autoincrement())
  quantity Int @default(1)

  cartId    Int
  cart      Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId Int
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  //\u041A\u043E\u043C\u0431\u0456\u043D\u0430\u0446\u0456\u044F \u0437\u043D\u0430\u0447\u0435\u043D\u044C \u043F\u043E\u043B\u0456\u0432 cartId \u0442\u0430 productId \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0443\u043D\u0456\u043A\u0430\u043B\u044C\u043D\u043E, \u0449\u043E\u0431 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447 \u043D\u0435 \u0437\u043C\u0456\u0433 \u0432 \u043E\u0434\u043D\u0456\u0439 \u043A\u043E\u0440\u0437\u0438\u043D\u0456 \u0441\u0442\u0432\u043E\u0440\u0438\u0442\u0438
  //\u0440\u0456\u0437\u043D\u0456 CartItem \u0437 \u043E\u0434\u043D\u0438\u043C \u0456 \u0442\u0438\u043C \u0436\u0435 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u043E\u043C. \u041D\u0430\u0442\u043E\u043C\u0456\u0441\u0442\u044C \u043C\u043E\u0436\u043D\u0430 \u0437\u043C\u0456\u043D\u0438\u0442\u0438 \u043B\u0438\u0448\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u043F\u043E\u043B\u044F quantity
  @@unique([cartId, productId])
}

//\u0421\u0425\u0415\u041C\u0418 \u0414\u041B\u042F \u0421\u0423\u0422\u041D\u041E\u0421\u0422\u0406 ORDER
//\u041F\u0435\u0440\u0435\u0447\u0438\u0441\u043B\u0435\u043D\u043D\u044F \u0437\u0456 \u0441\u0442\u0430\u0442\u0443\u0441\u0430\u043C\u0438 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F
enum OrderStatus {
  PENDING
  PAID
  DELIVERING
  COMPLETED
  CANCELLED
}

//\u0421\u0445\u0435\u043C\u0430 \u0434\u043B\u044F \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u0456 Order
model Order {
  id          Int         @id @default(autoincrement())
  status      OrderStatus @default(PENDING)
  totalAmount Decimal     @db.Decimal(10, 2)

  items    OrderItem[]
  userId   Int
  user     User        @relation(fields: [userId], references: [id])
  //\u043F\u043E\u043B\u044F payment \u0442\u0430 delivery \u043E\u043F\u0446\u0456\u043E\u043D\u0430\u043B\u044C\u043D\u0456, \u0449\u043E\u0431 \u0437\u0430\u043F\u043E\u0431\u0456\u0433\u0442\u0438 \u0437\u0430\u0446\u0438\u043A\u043B\u0435\u043D\u043E\u0441\u0442\u0456 \u043F\u0440\u0438 \u0441\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F \u0432\u0441\u0456\u0445 \u0442\u0440\u044C\u043E\u0445 \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u0435\u0439
  payment  Payment?
  delivery Delivery?
}

//\u0421\u0445\u0435\u043C\u0430 \u0434\u043B\u044F \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u0456 OrderItem
model OrderItem {
  id       Int     @id @default(autoincrement())
  quantity Int
  price    Decimal @db.Decimal(10, 2)

  productId Int
  product   Product @relation(fields: [productId], references: [id])
  orderId   Int
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

//\u0421\u0425\u0415\u041C\u0418 \u0414\u041B\u042F \u0421\u0423\u0422\u041D\u041E\u0421\u0422\u0406 PAYMENT
//\u041F\u0435\u0440\u0435\u0447\u0438\u0441\u043B\u0435\u043D\u043D\u044F \u0437 \u043C\u0435\u0442\u043E\u0434\u0430\u043C\u0438 \u043E\u043F\u043B\u0430\u0442\u0438
enum PaymentMethod {
  CARD
  CASH
}

//\u041F\u0435\u0440\u0435\u0447\u0438\u0441\u043B\u0435\u043D\u043D\u044F \u0437\u0456 \u0441\u0442\u0430\u0442\u0443\u0441\u0430\u043C\u0438 \u043E\u043F\u043B\u0430\u0442\u0438
enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum PaymentProvider {
  MONOBANK
  LIQPAY
  INTERNAL // \u0414\u043B\u044F \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u044C \u0456\u0437 \u0441\u0443\u043C\u043E\u044E 0 \u0430\u0431\u043E \u043E\u043F\u043B\u0430\u0442\u0438 \u0431\u043E\u043D\u0443\u0441\u0430\u043C\u0438
}

//\u0421\u0445\u0435\u043C\u0430 Paymant (\u043E\u043F\u043B\u0430\u0442\u0430)
model Payment {
  id         Int             @id @default(autoincrement())
  status     PaymentStatus   @default(PENDING)
  method     PaymentMethod
  amount     Decimal         @db.Decimal(10, 2)
  provider   PaymentProvider
  externalId String?         @unique //ID \u0456\u043D\u0432\u043E\u0439\u0441\u0443 \u0432 \u043F\u043B\u0430\u0442\u0456\u0436\u043D\u0456\u0439 \u0441\u0438\u0441\u0442\u0435\u043C\u0456

  orderId Int   @unique
  order   Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

//\u0421\u0425\u0415\u041C\u0418 \u0414\u041B\u042F \u0421\u0423\u0422\u041D\u041E\u0421\u0422\u0406 DELIVERY
//\u041F\u0435\u0440\u0435\u0447\u0438\u0441\u043B\u0435\u043D\u043D\u044F \u0437 \u043C\u0435\u0442\u043E\u0434\u0430\u043C\u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438
enum DeliveryMethod {
  NOVA_POSHTA
  UKRPOSHTA
  COURIER
}

//\u0421\u0445\u0435\u043C\u0430 Delivery (\u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430)
model Delivery {
  id             Int            @id @default(autoincrement())
  method         DeliveryMethod
  price          Decimal        @default(0) @db.Decimal(10, 2) //\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F 0 \u0437\u0430 \u0437\u043C\u043E\u0432\u0447\u0443\u0432\u0430\u043D\u043D\u044F\u043C, \u044F\u043A\u0449\u043E \u043C\u0430\u0433\u0430\u0437\u0438\u043D \u0440\u043E\u0437\u0440\u0445\u043E\u0432\u0443\u0454 \u043B\u0438\u0448\u0435 \u0441\u0443\u043C\u0443 \u0437\u0430\u0432\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F, \u0430 \u0441\u0443\u043C\u0443 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438 \u043A\u043B\u0456\u0454\u043D\u0442 \u0431\u0430\u0447\u0438\u0442\u0438\u043C\u0435 \u0432\u0436\u0435 \u0432 \u0441\u0435\u0440\u0432\u0456\u0441\u0456 \u0441\u043B\u0443\u0436\u0431\u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438
  trackingNumber String? // \u041D\u043E\u043C\u0435\u0440 \u0422\u0422\u041D \u0434\u043B\u044F \u0432\u0456\u0434\u0441\u0442\u0435\u0436\u0435\u043D\u043D\u044F
  details        Json // \u0421\u0445\u043E\u0432\u0438\u0449\u0435 \u0434\u043B\u044F JSON \u0434\u0430\u043D\u0438\u0445 (\u043C\u0456\u0441\u0442\u043E, \u0441\u043A\u043B\u0430\u0434, \u0442\u0435\u043B\u0435\u0444\u043E\u043D \u0442\u043E\u0449\u043E)

  orderId Int   @unique
  order   Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
}
`,
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"username","kind":"scalar","type":"String"},{"name":"firstname","kind":"scalar","type":"String"},{"name":"lastname","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"birthYear","kind":"scalar","type":"Int"},{"name":"profession","kind":"scalar","type":"String"},{"name":"isMarried","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"}],"dbName":null},"Address":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"city","kind":"scalar","type":"String"},{"name":"street","kind":"scalar","type":"String"},{"name":"houseNumber","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"}],"dbName":null},"Product":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"productName","kind":"scalar","type":"String"},{"name":"imgUrls","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"description","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"category","kind":"enum","type":"Category"},{"name":"details","kind":"scalar","type":"Json"},{"name":"producerId","kind":"scalar","type":"Int"},{"name":"producer","kind":"object","type":"Producer","relationName":"ProducerToProduct"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToProduct"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToProduct"}],"dbName":null},"Producer":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"products","kind":"object","type":"Product","relationName":"ProducerToProduct"}],"dbName":null},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"}],"dbName":null},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"cartId","kind":"scalar","type":"Int"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"productId","kind":"scalar","type":"Int"},{"name":"product","kind":"object","type":"Product","relationName":"CartItemToProduct"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"delivery","kind":"object","type":"Delivery","relationName":"DeliveryToOrder"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"productId","kind":"scalar","type":"Int"},{"name":"product","kind":"object","type":"Product","relationName":"OrderItemToProduct"},{"name":"orderId","kind":"scalar","type":"Int"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"externalId","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"Int"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"}],"dbName":null},"Delivery":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"method","kind":"enum","type":"DeliveryMethod"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"trackingNumber","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"Json"},{"name":"orderId","kind":"scalar","type":"Int"},{"name":"order","kind":"object","type":"Order","relationName":"DeliveryToOrder"}],"dbName":null}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","user","address","orderBy","cursor","cart","products","_count","producer","cartItems","product","items","order","payment","delivery","orderItems","orders","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_avg","_sum","_min","_max","User.groupBy","User.aggregate","Address.findUnique","Address.findUniqueOrThrow","Address.findFirst","Address.findFirstOrThrow","Address.findMany","Address.createOne","Address.createMany","Address.createManyAndReturn","Address.updateOne","Address.updateMany","Address.updateManyAndReturn","Address.upsertOne","Address.deleteOne","Address.deleteMany","Address.groupBy","Address.aggregate","Product.findUnique","Product.findUniqueOrThrow","Product.findFirst","Product.findFirstOrThrow","Product.findMany","Product.createOne","Product.createMany","Product.createManyAndReturn","Product.updateOne","Product.updateMany","Product.updateManyAndReturn","Product.upsertOne","Product.deleteOne","Product.deleteMany","Product.groupBy","Product.aggregate","Producer.findUnique","Producer.findUniqueOrThrow","Producer.findFirst","Producer.findFirstOrThrow","Producer.findMany","Producer.createOne","Producer.createMany","Producer.createManyAndReturn","Producer.updateOne","Producer.updateMany","Producer.updateManyAndReturn","Producer.upsertOne","Producer.deleteOne","Producer.deleteMany","Producer.groupBy","Producer.aggregate","Cart.findUnique","Cart.findUniqueOrThrow","Cart.findFirst","Cart.findFirstOrThrow","Cart.findMany","Cart.createOne","Cart.createMany","Cart.createManyAndReturn","Cart.updateOne","Cart.updateMany","Cart.updateManyAndReturn","Cart.upsertOne","Cart.deleteOne","Cart.deleteMany","Cart.groupBy","Cart.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Delivery.findUnique","Delivery.findUniqueOrThrow","Delivery.findFirst","Delivery.findFirstOrThrow","Delivery.findMany","Delivery.createOne","Delivery.createMany","Delivery.createManyAndReturn","Delivery.updateOne","Delivery.updateMany","Delivery.updateManyAndReturn","Delivery.upsertOne","Delivery.deleteOne","Delivery.deleteMany","Delivery.groupBy","Delivery.aggregate","AND","OR","NOT","id","DeliveryMethod","method","price","trackingNumber","details","orderId","equals","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","lt","lte","gt","gte","not","in","notIn","contains","startsWith","endsWith","PaymentStatus","status","PaymentMethod","amount","PaymentProvider","provider","externalId","quantity","productId","OrderStatus","totalAmount","userId","cartId","every","some","none","name","logoUrl","productName","imgUrls","description","Category","category","producerId","has","hasEvery","hasSome","city","street","houseNumber","email","password","username","firstname","lastname","phone","birthYear","profession","isMarried","UserRole","role","cartId_productId","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "5QRqoAERAgAA0wIAIAUAANQCACAQAADVAgAguQEAANACADC6AQAAJAAQuwEAANACADC8AQIAAAAB8gEBAAAAAfMBAQDAAgAh9AEBAAAAAfUBAQDAAgAh9gEBAMACACH3AQEAAAAB-AECAL8CACH5AQEAwAIAIfoBIADRAgAh_AEAANIC_AEiAQAAAAEAIAgBAAC5AgAguQEAAMgCADC6AQAAAwAQuwEAAMgCADC8AQIAvwIAIe8BAQDAAgAh8AEBAMACACHxAQIAvwIAIQEAAAADACAGAQAAuQIAIAsAALgCACC5AQAAtwIAMLoBAAAFABC7AQAAtwIAMLwBAgC_AgAhAQAAAAUAIAkFAADiAgAgCgAA3AIAILkBAADhAgAwugEAAAcAELsBAADhAgAwvAECAL8CACHbAQIAvwIAIdwBAgC_AgAh4AECAL8CACECBQAApwQAIAoAAKwEACAKBQAA4gIAIAoAANwCACC5AQAA4QIAMLoBAAAHABC7AQAA4QIAMLwBAgAAAAHbAQIAvwIAIdwBAgC_AgAh4AECAL8CACH9AQAA4AIAIAMAAAAHACADAAAIADAEAAAJACAPCAAA3wIAIAkAALgCACAPAADYAgAguQEAAN0CADC6AQAACwAQuwEAAN0CADC8AQIAvwIAIb8BEACeAgAhwQEAAKACACDbAQIAvwIAIeYBAQDAAgAh5wEAAMMCACDoAQEAwAIAIeoBAADeAuoBIusBAgC_AgAhAwgAAK0EACAJAADFAwAgDwAAqQQAIA8IAADfAgAgCQAAuAIAIA8AANgCACC5AQAA3QIAMLoBAAALABC7AQAA3QIAMLwBAgAAAAG_ARAAngIAIcEBAACgAgAg2wECAL8CACHmAQEAwAIAIecBAADDAgAg6AEBAMACACHqAQAA3gLqASLrAQIAvwIAIQMAAAALACADAAAMADAEAAANACABAAAACwAgAwAAAAcAIAMAAAgAMAQAAAkAIAoKAADcAgAgDAAAoQIAILkBAADbAgAwugEAABEAELsBAADbAgAwvAECAL8CACG_ARAAngIAIcIBAgC_AgAh2wECAL8CACHcAQIAvwIAIQIKAACsBAAgDAAA7wIAIAoKAADcAgAgDAAAoQIAILkBAADbAgAwugEAABEAELsBAADbAgAwvAECAAAAAb8BEACeAgAhwgECAL8CACHbAQIAvwIAIdwBAgC_AgAhAwAAABEAIAMAABIAMAQAABMAIAMAAAARACADAAASADAEAAATACALDAAAoQIAILkBAACsAgAwugEAABYAELsBAACsAgAwvAECAL8CACG-AQAArgLXASLCAQIAvwIAIdUBAACtAtUBItcBEACeAgAh2QEAAK8C2QEi2gEBAJ8CACEBAAAAFgAgCgwAAKECACC5AQAAnAIAMLoBAAAYABC7AQAAnAIAMLwBAgC_AgAhvgEAAJ0CvgEivwEQAJ4CACHAAQEAnwIAIcEBAACgAgAgwgECAL8CACEBAAAAGAAgAQAAABEAIAEAAAAHACABAAAAEQAgAQAAAAcAIAsBAAC5AgAgCwAA2AIAIA0AANkCACAOAADaAgAguQEAANYCADC6AQAAHgAQuwEAANYCADC8AQIAvwIAIdUBAADXAt4BIt4BEACeAgAh3wECAL8CACEEAQAAxgMAIAsAAKkEACANAACqBAAgDgAAqwQAIAsBAAC5AgAgCwAA2AIAIA0AANkCACAOAADaAgAguQEAANYCADC6AQAAHgAQuwEAANYCADC8AQIAAAAB1QEAANcC3gEi3gEQAJ4CACHfAQIAvwIAIQMAAAAeACADAAAfADAEAAAgACABAAAAHgAgAQAAAAEAIBECAADTAgAgBQAA1AIAIBAAANUCACC5AQAA0AIAMLoBAAAkABC7AQAA0AIAMLwBAgC_AgAh8gEBAMACACHzAQEAwAIAIfQBAQDAAgAh9QEBAMACACH2AQEAwAIAIfcBAQDAAgAh-AECAL8CACH5AQEAwAIAIfoBIADRAgAh_AEAANIC_AEiAwIAAKYEACAFAACnBAAgEAAAqAQAIAMAAAAkACADAAAlADAEAAABACADAAAAJAAgAwAAJQAwBAAAAQAgAwAAACQAIAMAACUAMAQAAAEAIA4CAACjBAAgBQAApAQAIBAAAKUEACC8AQIAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAAB-AECAAAAAfkBAQAAAAH6ASAAAAAB_AEAAAD8AQIBFgAAKQAgC7wBAgAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQIAAAAB-QEBAAAAAfoBIAAAAAH8AQAAAPwBAgEWAAArADABFgAAKwAwDgIAAIoEACAFAACLBAAgEAAAjAQAILwBAgDsAgAh8gEBAMwDACHzAQEAzAMAIfQBAQDMAwAh9QEBAMwDACH2AQEAzAMAIfcBAQDMAwAh-AECAOwCACH5AQEAzAMAIfoBIACIBAAh_AEAAIkE_AEiAgAAAAEAIBYAAC4AIAu8AQIA7AIAIfIBAQDMAwAh8wEBAMwDACH0AQEAzAMAIfUBAQDMAwAh9gEBAMwDACH3AQEAzAMAIfgBAgDsAgAh-QEBAMwDACH6ASAAiAQAIfwBAACJBPwBIgIAAAAkACAWAAAwACACAAAAJAAgFgAAMAAgAwAAAAEAIB0AACkAIB4AAC4AIAEAAAABACABAAAAJAAgBQcAAIMEACAjAACEBAAgJAAAhwQAICUAAIYEACAmAACFBAAgDrkBAADJAgAwugEAADcAELsBAADJAgAwvAECAIwCACHyAQEAuwIAIfMBAQC7AgAh9AEBALsCACH1AQEAuwIAIfYBAQC7AgAh9wEBALsCACH4AQIAjAIAIfkBAQC7AgAh-gEgAMoCACH8AQAAywL8ASIDAAAAJAAgAwAANgAwIgAANwAgAwAAACQAIAMAACUAMAQAAAEAIAgBAAC5AgAguQEAAMgCADC6AQAAAwAQuwEAAMgCADC8AQIAAAAB7wEBAMACACHwAQEAwAIAIfEBAgC_AgAhAQAAADoAIAEAAAA6ACABAQAAxgMAIAMAAAADACADAAA9ADAEAAA6ACADAAAAAwAgAwAAPQAwBAAAOgAgAwAAAAMAIAMAAD0AMAQAADoAIAUBAACCBAAgvAECAAAAAe8BAQAAAAHwAQEAAAAB8QECAAAAAQEWAABBACAEvAECAAAAAe8BAQAAAAHwAQEAAAAB8QECAAAAAQEWAABDADABFgAAQwAwBQEAAIEEACC8AQIA7AIAIe8BAQDMAwAh8AEBAMwDACHxAQIA7AIAIQIAAAA6ACAWAABGACAEvAECAOwCACHvAQEAzAMAIfABAQDMAwAh8QECAOwCACECAAAAAwAgFgAASAAgAgAAAAMAIBYAAEgAIAMAAAA6ACAdAABBACAeAABGACABAAAAOgAgAQAAAAMAIAUHAAD8AwAgIwAA_QMAICQAAIAEACAlAAD_AwAgJgAA_gMAIAe5AQAAxwIAMLoBAABPABC7AQAAxwIAMLwBAgCMAgAh7wEBALsCACHwAQEAuwIAIfEBAgCMAgAhAwAAAAMAIAMAAE4AMCIAAE8AIAMAAAADACADAAA9ADAEAAA6ACABAAAADQAgAQAAAA0AIAMAAAALACADAAAMADAEAAANACADAAAACwAgAwAADAAwBAAADQAgAwAAAAsAIAMAAAwAMAQAAA0AIAwIAAD7AwAgCQAA8QMAIA8AAPIDACC8AQIAAAABvwEQAAAAAcEBgAAAAAHbAQIAAAAB5gEBAAAAAecBAADwAwAg6AEBAAAAAeoBAAAA6gEC6wECAAAAAQEWAABXACAJvAECAAAAAb8BEAAAAAHBAYAAAAAB2wECAAAAAeYBAQAAAAHnAQAA8AMAIOgBAQAAAAHqAQAAAOoBAusBAgAAAAEBFgAAWQAwARYAAFkAMAwIAAD6AwAgCQAA2wMAIA8AANwDACC8AQIA7AIAIb8BEADqAgAhwQGAAAAAAdsBAgDsAgAh5gEBAMwDACHnAQAA2AMAIOgBAQDMAwAh6gEAANkD6gEi6wECAOwCACECAAAADQAgFgAAXAAgCbwBAgDsAgAhvwEQAOoCACHBAYAAAAAB2wECAOwCACHmAQEAzAMAIecBAADYAwAg6AEBAMwDACHqAQAA2QPqASLrAQIA7AIAIQIAAAALACAWAABeACACAAAACwAgFgAAXgAgAwAAAA0AIB0AAFcAIB4AAFwAIAEAAAANACABAAAACwAgBQcAAPUDACAjAAD2AwAgJAAA-QMAICUAAPgDACAmAAD3AwAgDLkBAADCAgAwugEAAGUAELsBAADCAgAwvAECAIwCACG_ARAAjgIAIcEBAACQAgAg2wECAIwCACHmAQEAuwIAIecBAADDAgAg6AEBALsCACHqAQAAxALqASLrAQIAjAIAIQMAAAALACADAABkADAiAABlACADAAAACwAgAwAADAAwBAAADQAgBwYAAMECACC5AQAAvgIAMLoBAABrABC7AQAAvgIAMLwBAgAAAAHkAQEAAAAB5QEBAJ8CACEBAAAAaAAgAQAAAGgAIAcGAADBAgAguQEAAL4CADC6AQAAawAQuwEAAL4CADC8AQIAvwIAIeQBAQDAAgAh5QEBAJ8CACECBgAA9AMAIOUBAADjAgAgAwAAAGsAIAMAAGwAMAQAAGgAIAMAAABrACADAABsADAEAABoACADAAAAawAgAwAAbAAwBAAAaAAgBAYAAPMDACC8AQIAAAAB5AEBAAAAAeUBAQAAAAEBFgAAcAAgA7wBAgAAAAHkAQEAAAAB5QEBAAAAAQEWAAByADABFgAAcgAwBAYAAM0DACC8AQIA7AIAIeQBAQDMAwAh5QEBAOsCACECAAAAaAAgFgAAdQAgA7wBAgDsAgAh5AEBAMwDACHlAQEA6wIAIQIAAABrACAWAAB3ACACAAAAawAgFgAAdwAgAwAAAGgAIB0AAHAAIB4AAHUAIAEAAABoACABAAAAawAgBgcAAMcDACAjAADIAwAgJAAAywMAICUAAMoDACAmAADJAwAg5QEAAOMCACAGuQEAALoCADC6AQAAfgAQuwEAALoCADC8AQIAjAIAIeQBAQC7AgAh5QEBAI8CACEDAAAAawAgAwAAfQAwIgAAfgAgAwAAAGsAIAMAAGwAMAQAAGgAIAYBAAC5AgAgCwAAuAIAILkBAAC3AgAwugEAAAUAELsBAAC3AgAwvAECAAAAAQEAAACBAQAgAQAAAIEBACACAQAAxgMAIAsAAMUDACADAAAABQAgAwAAhAEAMAQAAIEBACADAAAABQAgAwAAhAEAMAQAAIEBACADAAAABQAgAwAAhAEAMAQAAIEBACADAQAAxAMAIAsAAMMDACC8AQIAAAABARYAAIgBACABvAECAAAAAQEWAACKAQAwARYAAIoBADADAQAAtgMAIAsAALUDACC8AQIA7AIAIQIAAACBAQAgFgAAjQEAIAG8AQIA7AIAIQIAAAAFACAWAACPAQAgAgAAAAUAIBYAAI8BACADAAAAgQEAIB0AAIgBACAeAACNAQAgAQAAAIEBACABAAAABQAgBQcAALADACAjAACxAwAgJAAAtAMAICUAALMDACAmAACyAwAgBLkBAAC2AgAwugEAAJYBABC7AQAAtgIAMLwBAgCMAgAhAwAAAAUAIAMAAJUBADAiAACWAQAgAwAAAAUAIAMAAIQBADAEAACBAQAgAQAAAAkAIAEAAAAJACADAAAABwAgAwAACAAwBAAACQAgAwAAAAcAIAMAAAgAMAQAAAkAIAMAAAAHACADAAAIADAEAAAJACAGBQAArgMAIAoAAK8DACC8AQIAAAAB2wECAAAAAdwBAgAAAAHgAQIAAAABARYAAJ4BACAEvAECAAAAAdsBAgAAAAHcAQIAAAAB4AECAAAAAQEWAACgAQAwARYAAKABADAGBQAArAMAIAoAAK0DACC8AQIA7AIAIdsBAgDsAgAh3AECAOwCACHgAQIA7AIAIQIAAAAJACAWAACjAQAgBLwBAgDsAgAh2wECAOwCACHcAQIA7AIAIeABAgDsAgAhAgAAAAcAIBYAAKUBACACAAAABwAgFgAApQEAIAMAAAAJACAdAACeAQAgHgAAowEAIAEAAAAJACABAAAABwAgBQcAAKcDACAjAACoAwAgJAAAqwMAICUAAKoDACAmAACpAwAgB7kBAAC1AgAwugEAAKwBABC7AQAAtQIAMLwBAgCMAgAh2wECAIwCACHcAQIAjAIAIeABAgCMAgAhAwAAAAcAIAMAAKsBADAiAACsAQAgAwAAAAcAIAMAAAgAMAQAAAkAIAEAAAAgACABAAAAIAAgAwAAAB4AIAMAAB8AMAQAACAAIAMAAAAeACADAAAfADAEAAAgACADAAAAHgAgAwAAHwAwBAAAIAAgCAEAAKQDACALAACjAwAgDQAApQMAIA4AAKYDACC8AQIAAAAB1QEAAADeAQLeARAAAAAB3wECAAAAAQEWAAC0AQAgBLwBAgAAAAHVAQAAAN4BAt4BEAAAAAHfAQIAAAABARYAALYBADABFgAAtgEAMAgBAACKAwAgCwAAiQMAIA0AAIsDACAOAACMAwAgvAECAOwCACHVAQAAiAPeASLeARAA6gIAId8BAgDsAgAhAgAAACAAIBYAALkBACAEvAECAOwCACHVAQAAiAPeASLeARAA6gIAId8BAgDsAgAhAgAAAB4AIBYAALsBACACAAAAHgAgFgAAuwEAIAMAAAAgACAdAAC0AQAgHgAAuQEAIAEAAAAgACABAAAAHgAgBQcAAIMDACAjAACEAwAgJAAAhwMAICUAAIYDACAmAACFAwAgB7kBAACxAgAwugEAAMIBABC7AQAAsQIAMLwBAgCMAgAh1QEAALIC3gEi3gEQAI4CACHfAQIAjAIAIQMAAAAeACADAADBAQAwIgAAwgEAIAMAAAAeACADAAAfADAEAAAgACABAAAAEwAgAQAAABMAIAMAAAARACADAAASADAEAAATACADAAAAEQAgAwAAEgAwBAAAEwAgAwAAABEAIAMAABIAMAQAABMAIAcKAACBAwAgDAAAggMAILwBAgAAAAG_ARAAAAABwgECAAAAAdsBAgAAAAHcAQIAAAABARYAAMoBACAFvAECAAAAAb8BEAAAAAHCAQIAAAAB2wECAAAAAdwBAgAAAAEBFgAAzAEAMAEWAADMAQAwBwoAAP8CACAMAACAAwAgvAECAOwCACG_ARAA6gIAIcIBAgDsAgAh2wECAOwCACHcAQIA7AIAIQIAAAATACAWAADPAQAgBbwBAgDsAgAhvwEQAOoCACHCAQIA7AIAIdsBAgDsAgAh3AECAOwCACECAAAAEQAgFgAA0QEAIAIAAAARACAWAADRAQAgAwAAABMAIB0AAMoBACAeAADPAQAgAQAAABMAIAEAAAARACAFBwAA-gIAICMAAPsCACAkAAD-AgAgJQAA_QIAICYAAPwCACAIuQEAALACADC6AQAA2AEAELsBAACwAgAwvAECAIwCACG_ARAAjgIAIcIBAgCMAgAh2wECAIwCACHcAQIAjAIAIQMAAAARACADAADXAQAwIgAA2AEAIAMAAAARACADAAASADAEAAATACALDAAAoQIAILkBAACsAgAwugEAABYAELsBAACsAgAwvAECAAAAAb4BAACuAtcBIsIBAgAAAAHVAQAArQLVASLXARAAngIAIdkBAACvAtkBItoBAQAAAAEBAAAA2wEAIAEAAADbAQAgAgwAAO8CACDaAQAA4wIAIAMAAAAWACADAADeAQAwBAAA2wEAIAMAAAAWACADAADeAQAwBAAA2wEAIAMAAAAWACADAADeAQAwBAAA2wEAIAgMAAD5AgAgvAECAAAAAb4BAAAA1wECwgECAAAAAdUBAAAA1QEC1wEQAAAAAdkBAAAA2QEC2gEBAAAAAQEWAADiAQAgB7wBAgAAAAG-AQAAANcBAsIBAgAAAAHVAQAAANUBAtcBEAAAAAHZAQAAANkBAtoBAQAAAAEBFgAA5AEAMAEWAADkAQAwCAwAAPgCACC8AQIA7AIAIb4BAAD2AtcBIsIBAgDsAgAh1QEAAPUC1QEi1wEQAOoCACHZAQAA9wLZASLaAQEA6wIAIQIAAADbAQAgFgAA5wEAIAe8AQIA7AIAIb4BAAD2AtcBIsIBAgDsAgAh1QEAAPUC1QEi1wEQAOoCACHZAQAA9wLZASLaAQEA6wIAIQIAAAAWACAWAADpAQAgAgAAABYAIBYAAOkBACADAAAA2wEAIB0AAOIBACAeAADnAQAgAQAAANsBACABAAAAFgAgBgcAAPACACAjAADxAgAgJAAA9AIAICUAAPMCACAmAADyAgAg2gEAAOMCACAKuQEAAKICADC6AQAA8AEAELsBAACiAgAwvAECAIwCACG-AQAApALXASLCAQIAjAIAIdUBAACjAtUBItcBEACOAgAh2QEAAKUC2QEi2gEBAI8CACEDAAAAFgAgAwAA7wEAMCIAAPABACADAAAAFgAgAwAA3gEAMAQAANsBACAKDAAAoQIAILkBAACcAgAwugEAABgAELsBAACcAgAwvAECAAAAAb4BAACdAr4BIr8BEACeAgAhwAEBAJ8CACHBAQAAoAIAIMIBAgAAAAEBAAAA8wEAIAEAAADzAQAgAgwAAO8CACDAAQAA4wIAIAMAAAAYACADAAD2AQAwBAAA8wEAIAMAAAAYACADAAD2AQAwBAAA8wEAIAMAAAAYACADAAD2AQAwBAAA8wEAIAcMAADuAgAgvAECAAAAAb4BAAAAvgECvwEQAAAAAcABAQAAAAHBAYAAAAABwgECAAAAAQEWAAD6AQAgBrwBAgAAAAG-AQAAAL4BAr8BEAAAAAHAAQEAAAABwQGAAAAAAcIBAgAAAAEBFgAA_AEAMAEWAAD8AQAwBwwAAO0CACC8AQIA7AIAIb4BAADpAr4BIr8BEADqAgAhwAEBAOsCACHBAYAAAAABwgECAOwCACECAAAA8wEAIBYAAP8BACAGvAECAOwCACG-AQAA6QK-ASK_ARAA6gIAIcABAQDrAgAhwQGAAAAAAcIBAgDsAgAhAgAAABgAIBYAAIECACACAAAAGAAgFgAAgQIAIAMAAADzAQAgHQAA-gEAIB4AAP8BACABAAAA8wEAIAEAAAAYACAGBwAA5AIAICMAAOUCACAkAADoAgAgJQAA5wIAICYAAOYCACDAAQAA4wIAIAm5AQAAiwIAMLoBAACIAgAQuwEAAIsCADC8AQIAjAIAIb4BAACNAr4BIr8BEACOAgAhwAEBAI8CACHBAQAAkAIAIMIBAgCMAgAhAwAAABgAIAMAAIcCADAiAACIAgAgAwAAABgAIAMAAPYBADAEAADzAQAgCbkBAACLAgAwugEAAIgCABC7AQAAiwIAMLwBAgCMAgAhvgEAAI0CvgEivwEQAI4CACHAAQEAjwIAIcEBAACQAgAgwgECAIwCACENBwAAkQIAICMAAJsCACAkAACRAgAgJQAAkQIAICYAAJECACDDAQIAAAABygECAAAAAcsBAgAAAAHMAQIAAAABzQECAAAAAc4BAgCaAgAhzwECAAAABNABAgAAAAQHBwAAkQIAICUAAJkCACAmAACZAgAgwwEAAAC-AQLOAQAAmAK-ASLPAQAAAL4BCNABAAAAvgEIDQcAAJECACAjAACXAgAgJAAAlwIAICUAAJcCACAmAACXAgAgwwEQAAAAAcoBEAAAAAHLARAAAAABzAEQAAAAAc0BEAAAAAHOARAAlgIAIc8BEAAAAATQARAAAAAEDgcAAJQCACAlAACVAgAgJgAAlQIAIMMBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAAAABzgEBAJMCACHPAQEAAAAF0AEBAAAABdEBAQAAAAHSAQEAAAAB0wEBAAAAAQ8HAACRAgAgJQAAkgIAICYAAJICACDDAYAAAAABxAEBAAAAAcUBAQAAAAHGAQEAAAABxwGAAAAAAcgBgAAAAAHJAYAAAAABygGAAAAAAcsBgAAAAAHMAYAAAAABzQGAAAAAAc4BgAAAAAEIwwECAAAAAcoBAgAAAAHLAQIAAAABzAECAAAAAc0BAgAAAAHOAQIAkQIAIc8BAgAAAATQAQIAAAAEDMMBgAAAAAHEAQEAAAABxQEBAAAAAcYBAQAAAAHHAYAAAAAByAGAAAAAAckBgAAAAAHKAYAAAAABywGAAAAAAcwBgAAAAAHNAYAAAAABzgGAAAAAAQ4HAACUAgAgJQAAlQIAICYAAJUCACDDAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAAAAAc4BAQCTAgAhzwEBAAAABdABAQAAAAXRAQEAAAAB0gEBAAAAAdMBAQAAAAEIwwECAAAAAcoBAgAAAAHLAQIAAAABzAECAAAAAc0BAgAAAAHOAQIAlAIAIc8BAgAAAAXQAQIAAAAFC8MBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAAAABzgEBAJUCACHPAQEAAAAF0AEBAAAABdEBAQAAAAHSAQEAAAAB0wEBAAAAAQ0HAACRAgAgIwAAlwIAICQAAJcCACAlAACXAgAgJgAAlwIAIMMBEAAAAAHKARAAAAABywEQAAAAAcwBEAAAAAHNARAAAAABzgEQAJYCACHPARAAAAAE0AEQAAAABAjDARAAAAABygEQAAAAAcsBEAAAAAHMARAAAAABzQEQAAAAAc4BEACXAgAhzwEQAAAABNABEAAAAAQHBwAAkQIAICUAAJkCACAmAACZAgAgwwEAAAC-AQLOAQAAmAK-ASLPAQAAAL4BCNABAAAAvgEIBMMBAAAAvgECzgEAAJkCvgEizwEAAAC-AQjQAQAAAL4BCA0HAACRAgAgIwAAmwIAICQAAJECACAlAACRAgAgJgAAkQIAIMMBAgAAAAHKAQIAAAABywECAAAAAcwBAgAAAAHNAQIAAAABzgECAJoCACHPAQIAAAAE0AECAAAABAjDAQgAAAABygEIAAAAAcsBCAAAAAHMAQgAAAABzQEIAAAAAc4BCACbAgAhzwEIAAAABNABCAAAAAQKDAAAoQIAILkBAACcAgAwugEAABgAELsBAACcAgAwvAECAL8CACG-AQAAnQK-ASK_ARAAngIAIcABAQCfAgAhwQEAAKACACDCAQIAvwIAIQTDAQAAAL4BAs4BAACZAr4BIs8BAAAAvgEI0AEAAAC-AQgIwwEQAAAAAcoBEAAAAAHLARAAAAABzAEQAAAAAc0BEAAAAAHOARAAlwIAIc8BEAAAAATQARAAAAAEC8MBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAAAABzgEBAJUCACHPAQEAAAAF0AEBAAAABdEBAQAAAAHSAQEAAAAB0wEBAAAAAQzDAYAAAAABxAEBAAAAAcUBAQAAAAHGAQEAAAABxwGAAAAAAcgBgAAAAAHJAYAAAAABygGAAAAAAcsBgAAAAAHMAYAAAAABzQGAAAAAAc4BgAAAAAENAQAAuQIAIAsAANgCACANAADZAgAgDgAA2gIAILkBAADWAgAwugEAAB4AELsBAADWAgAwvAECAL8CACHVAQAA1wLeASLeARAAngIAId8BAgC_AgAh_gEAAB4AIP8BAAAeACAKuQEAAKICADC6AQAA8AEAELsBAACiAgAwvAECAIwCACG-AQAApALXASLCAQIAjAIAIdUBAACjAtUBItcBEACOAgAh2QEAAKUC2QEi2gEBAI8CACEHBwAAkQIAICUAAKsCACAmAACrAgAgwwEAAADVAQLOAQAAqgLVASLPAQAAANUBCNABAAAA1QEIBwcAAJECACAlAACpAgAgJgAAqQIAIMMBAAAA1wECzgEAAKgC1wEizwEAAADXAQjQAQAAANcBCAcHAACRAgAgJQAApwIAICYAAKcCACDDAQAAANkBAs4BAACmAtkBIs8BAAAA2QEI0AEAAADZAQgHBwAAkQIAICUAAKcCACAmAACnAgAgwwEAAADZAQLOAQAApgLZASLPAQAAANkBCNABAAAA2QEIBMMBAAAA2QECzgEAAKcC2QEizwEAAADZAQjQAQAAANkBCAcHAACRAgAgJQAAqQIAICYAAKkCACDDAQAAANcBAs4BAACoAtcBIs8BAAAA1wEI0AEAAADXAQgEwwEAAADXAQLOAQAAqQLXASLPAQAAANcBCNABAAAA1wEIBwcAAJECACAlAACrAgAgJgAAqwIAIMMBAAAA1QECzgEAAKoC1QEizwEAAADVAQjQAQAAANUBCATDAQAAANUBAs4BAACrAtUBIs8BAAAA1QEI0AEAAADVAQgLDAAAoQIAILkBAACsAgAwugEAABYAELsBAACsAgAwvAECAL8CACG-AQAArgLXASLCAQIAvwIAIdUBAACtAtUBItcBEACeAgAh2QEAAK8C2QEi2gEBAJ8CACEEwwEAAADVAQLOAQAAqwLVASLPAQAAANUBCNABAAAA1QEIBMMBAAAA1wECzgEAAKkC1wEizwEAAADXAQjQAQAAANcBCATDAQAAANkBAs4BAACnAtkBIs8BAAAA2QEI0AEAAADZAQgIuQEAALACADC6AQAA2AEAELsBAACwAgAwvAECAIwCACG_ARAAjgIAIcIBAgCMAgAh2wECAIwCACHcAQIAjAIAIQe5AQAAsQIAMLoBAADCAQAQuwEAALECADC8AQIAjAIAIdUBAACyAt4BIt4BEACOAgAh3wECAIwCACEHBwAAkQIAICUAALQCACAmAAC0AgAgwwEAAADeAQLOAQAAswLeASLPAQAAAN4BCNABAAAA3gEIBwcAAJECACAlAAC0AgAgJgAAtAIAIMMBAAAA3gECzgEAALMC3gEizwEAAADeAQjQAQAAAN4BCATDAQAAAN4BAs4BAAC0At4BIs8BAAAA3gEI0AEAAADeAQgHuQEAALUCADC6AQAArAEAELsBAAC1AgAwvAECAIwCACHbAQIAjAIAIdwBAgCMAgAh4AECAIwCACEEuQEAALYCADC6AQAAlgEAELsBAAC2AgAwvAECAIwCACEGAQAAuQIAIAsAALgCACC5AQAAtwIAMLoBAAAFABC7AQAAtwIAMLwBAgC_AgAhA-EBAAAHACDiAQAABwAg4wEAAAcAIBMCAADTAgAgBQAA1AIAIBAAANUCACC5AQAA0AIAMLoBAAAkABC7AQAA0AIAMLwBAgC_AgAh8gEBAMACACHzAQEAwAIAIfQBAQDAAgAh9QEBAMACACH2AQEAwAIAIfcBAQDAAgAh-AECAL8CACH5AQEAwAIAIfoBIADRAgAh_AEAANIC_AEi_gEAACQAIP8BAAAkACAGuQEAALoCADC6AQAAfgAQuwEAALoCADC8AQIAjAIAIeQBAQC7AgAh5QEBAI8CACEOBwAAkQIAICUAAL0CACAmAAC9AgAgwwEBAAAAAcoBAQAAAAHLAQEAAAABzAEBAAAAAc0BAQAAAAHOAQEAvAIAIc8BAQAAAATQAQEAAAAE0QEBAAAAAdIBAQAAAAHTAQEAAAABDgcAAJECACAlAAC9AgAgJgAAvQIAIMMBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAAAABzgEBALwCACHPAQEAAAAE0AEBAAAABNEBAQAAAAHSAQEAAAAB0wEBAAAAAQvDAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAAAAAc4BAQC9AgAhzwEBAAAABNABAQAAAATRAQEAAAAB0gEBAAAAAdMBAQAAAAEHBgAAwQIAILkBAAC-AgAwugEAAGsAELsBAAC-AgAwvAECAL8CACHkAQEAwAIAIeUBAQCfAgAhCMMBAgAAAAHKAQIAAAABywECAAAAAcwBAgAAAAHNAQIAAAABzgECAJECACHPAQIAAAAE0AECAAAABAvDAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAAAAAc4BAQC9AgAhzwEBAAAABNABAQAAAATRAQEAAAAB0gEBAAAAAdMBAQAAAAED4QEAAAsAIOIBAAALACDjAQAACwAgDLkBAADCAgAwugEAAGUAELsBAADCAgAwvAECAIwCACG_ARAAjgIAIcEBAACQAgAg2wECAIwCACHmAQEAuwIAIecBAADDAgAg6AEBALsCACHqAQAAxALqASLrAQIAjAIAIQTDAQEAAAAF7AEBAAAAAe0BAQAAAATuAQEAAAAEBwcAAJECACAlAADGAgAgJgAAxgIAIMMBAAAA6gECzgEAAMUC6gEizwEAAADqAQjQAQAAAOoBCAcHAACRAgAgJQAAxgIAICYAAMYCACDDAQAAAOoBAs4BAADFAuoBIs8BAAAA6gEI0AEAAADqAQgEwwEAAADqAQLOAQAAxgLqASLPAQAAAOoBCNABAAAA6gEIB7kBAADHAgAwugEAAE8AELsBAADHAgAwvAECAIwCACHvAQEAuwIAIfABAQC7AgAh8QECAIwCACEIAQAAuQIAILkBAADIAgAwugEAAAMAELsBAADIAgAwvAECAL8CACHvAQEAwAIAIfABAQDAAgAh8QECAL8CACEOuQEAAMkCADC6AQAANwAQuwEAAMkCADC8AQIAjAIAIfIBAQC7AgAh8wEBALsCACH0AQEAuwIAIfUBAQC7AgAh9gEBALsCACH3AQEAuwIAIfgBAgCMAgAh-QEBALsCACH6ASAAygIAIfwBAADLAvwBIgUHAACRAgAgJQAAzwIAICYAAM8CACDDASAAAAABzgEgAM4CACEHBwAAkQIAICUAAM0CACAmAADNAgAgwwEAAAD8AQLOAQAAzAL8ASLPAQAAAPwBCNABAAAA_AEIBwcAAJECACAlAADNAgAgJgAAzQIAIMMBAAAA_AECzgEAAMwC_AEizwEAAAD8AQjQAQAAAPwBCATDAQAAAPwBAs4BAADNAvwBIs8BAAAA_AEI0AEAAAD8AQgFBwAAkQIAICUAAM8CACAmAADPAgAgwwEgAAAAAc4BIADOAgAhAsMBIAAAAAHOASAAzwIAIRECAADTAgAgBQAA1AIAIBAAANUCACC5AQAA0AIAMLoBAAAkABC7AQAA0AIAMLwBAgC_AgAh8gEBAMACACHzAQEAwAIAIfQBAQDAAgAh9QEBAMACACH2AQEAwAIAIfcBAQDAAgAh-AECAL8CACH5AQEAwAIAIfoBIADRAgAh_AEAANIC_AEiAsMBIAAAAAHOASAAzwIAIQTDAQAAAPwBAs4BAADNAvwBIs8BAAAA_AEI0AEAAAD8AQgKAQAAuQIAILkBAADIAgAwugEAAAMAELsBAADIAgAwvAECAL8CACHvAQEAwAIAIfABAQDAAgAh8QECAL8CACH-AQAAAwAg_wEAAAMAIAgBAAC5AgAgCwAAuAIAILkBAAC3AgAwugEAAAUAELsBAAC3AgAwvAECAL8CACH-AQAABQAg_wEAAAUAIAPhAQAAHgAg4gEAAB4AIOMBAAAeACALAQAAuQIAIAsAANgCACANAADZAgAgDgAA2gIAILkBAADWAgAwugEAAB4AELsBAADWAgAwvAECAL8CACHVAQAA1wLeASLeARAAngIAId8BAgC_AgAhBMMBAAAA3gECzgEAALQC3gEizwEAAADeAQjQAQAAAN4BCAPhAQAAEQAg4gEAABEAIOMBAAARACANDAAAoQIAILkBAACsAgAwugEAABYAELsBAACsAgAwvAECAL8CACG-AQAArgLXASLCAQIAvwIAIdUBAACtAtUBItcBEACeAgAh2QEAAK8C2QEi2gEBAJ8CACH-AQAAFgAg_wEAABYAIAwMAAChAgAguQEAAJwCADC6AQAAGAAQuwEAAJwCADC8AQIAvwIAIb4BAACdAr4BIr8BEACeAgAhwAEBAJ8CACHBAQAAoAIAIMIBAgC_AgAh_gEAABgAIP8BAAAYACAKCgAA3AIAIAwAAKECACC5AQAA2wIAMLoBAAARABC7AQAA2wIAMLwBAgC_AgAhvwEQAJ4CACHCAQIAvwIAIdsBAgC_AgAh3AECAL8CACERCAAA3wIAIAkAALgCACAPAADYAgAguQEAAN0CADC6AQAACwAQuwEAAN0CADC8AQIAvwIAIb8BEACeAgAhwQEAAKACACDbAQIAvwIAIeYBAQDAAgAh5wEAAMMCACDoAQEAwAIAIeoBAADeAuoBIusBAgC_AgAh_gEAAAsAIP8BAAALACAPCAAA3wIAIAkAALgCACAPAADYAgAguQEAAN0CADC6AQAACwAQuwEAAN0CADC8AQIAvwIAIb8BEACeAgAhwQEAAKACACDbAQIAvwIAIeYBAQDAAgAh5wEAAMMCACDoAQEAwAIAIeoBAADeAuoBIusBAgC_AgAhBMMBAAAA6gECzgEAAMYC6gEizwEAAADqAQjQAQAAAOoBCAkGAADBAgAguQEAAL4CADC6AQAAawAQuwEAAL4CADC8AQIAvwIAIeQBAQDAAgAh5QEBAJ8CACH-AQAAawAg_wEAAGsAIALcAQIAAAAB4AECAAAAAQkFAADiAgAgCgAA3AIAILkBAADhAgAwugEAAAcAELsBAADhAgAwvAECAL8CACHbAQIAvwIAIdwBAgC_AgAh4AECAL8CACEIAQAAuQIAIAsAALgCACC5AQAAtwIAMLoBAAAFABC7AQAAtwIAMLwBAgC_AgAh_gEAAAUAIP8BAAAFACAAAAAAAAABhgIAAAC-AQIFhgIQAAAAAYoCEAAAAAGLAhAAAAABjAIQAAAAAY0CEAAAAAEBhgIBAAAAAQWGAgIAAAABigICAAAAAYsCAgAAAAGMAgIAAAABjQICAAAAAQUdAADhBAAgHgAA5AQAIIACAADiBAAggQIAAOMEACCEAgAAIAAgAx0AAOEEACCAAgAA4gQAIIQCAAAgACAEAQAAxgMAIAsAAKkEACANAACqBAAgDgAAqwQAIAAAAAAAAYYCAAAA1QECAYYCAAAA1wECAYYCAAAA2QECBR0AANwEACAeAADfBAAggAIAAN0EACCBAgAA3gQAIIQCAAAgACADHQAA3AQAIIACAADdBAAghAIAACAAIAAAAAAABR0AANQEACAeAADaBAAggAIAANUEACCBAgAA2QQAIIQCAAANACAFHQAA0gQAIB4AANcEACCAAgAA0wQAIIECAADWBAAghAIAACAAIAMdAADUBAAggAIAANUEACCEAgAADQAgAx0AANIEACCAAgAA0wQAIIQCAAAgACAAAAAAAAGGAgAAAN4BAgsdAACXAwAwHgAAnAMAMIACAACYAwAwgQIAAJkDADCCAgAAmwMAMIMCAACbAwAwhAIAAJsDADCFAgAAmgMAIIYCAACbAwAwhwIAAJ0DADCIAgAAngMAMAUdAADMBAAgHgAA0AQAIIACAADNBAAggQIAAM8EACCEAgAAAQAgBx0AAJIDACAeAACVAwAggAIAAJMDACCBAgAAlAMAIIICAAAWACCDAgAAFgAghAIAANsBACAHHQAAjQMAIB4AAJADACCAAgAAjgMAIIECAACPAwAgggIAABgAIIMCAAAYACCEAgAA8wEAIAW8AQIAAAABvgEAAAC-AQK_ARAAAAABwAEBAAAAAcEBgAAAAAECAAAA8wEAIB0AAI0DACADAAAAGAAgHQAAjQMAIB4AAJEDACAHAAAAGAAgFgAAkQMAILwBAgDsAgAhvgEAAOkCvgEivwEQAOoCACHAAQEA6wIAIcEBgAAAAAEFvAECAOwCACG-AQAA6QK-ASK_ARAA6gIAIcABAQDrAgAhwQGAAAAAAQa8AQIAAAABvgEAAADXAQLVAQAAANUBAtcBEAAAAAHZAQAAANkBAtoBAQAAAAECAAAA2wEAIB0AAJIDACADAAAAFgAgHQAAkgMAIB4AAJYDACAIAAAAFgAgFgAAlgMAILwBAgDsAgAhvgEAAPYC1wEi1QEAAPUC1QEi1wEQAOoCACHZAQAA9wLZASLaAQEA6wIAIQa8AQIA7AIAIb4BAAD2AtcBItUBAAD1AtUBItcBEADqAgAh2QEAAPcC2QEi2gEBAOsCACEFCgAAgQMAILwBAgAAAAG_ARAAAAAB2wECAAAAAdwBAgAAAAECAAAAEwAgHQAAogMAIAMAAAATACAdAACiAwAgHgAAoQMAIAEWAADOBAAwCgoAANwCACAMAAChAgAguQEAANsCADC6AQAAEQAQuwEAANsCADC8AQIAAAABvwEQAJ4CACHCAQIAvwIAIdsBAgC_AgAh3AECAL8CACECAAAAEwAgFgAAoQMAIAIAAACfAwAgFgAAoAMAIAi5AQAAngMAMLoBAACfAwAQuwEAAJ4DADC8AQIAvwIAIb8BEACeAgAhwgECAL8CACHbAQIAvwIAIdwBAgC_AgAhCLkBAACeAwAwugEAAJ8DABC7AQAAngMAMLwBAgC_AgAhvwEQAJ4CACHCAQIAvwIAIdsBAgC_AgAh3AECAL8CACEEvAECAOwCACG_ARAA6gIAIdsBAgDsAgAh3AECAOwCACEFCgAA_wIAILwBAgDsAgAhvwEQAOoCACHbAQIA7AIAIdwBAgDsAgAhBQoAAIEDACC8AQIAAAABvwEQAAAAAdsBAgAAAAHcAQIAAAABBB0AAJcDADCAAgAAmAMAMIQCAACbAwAwhQIAAJoDACADHQAAzAQAIIACAADNBAAghAIAAAEAIAMdAACSAwAggAIAAJMDACCEAgAA2wEAIAMdAACNAwAggAIAAI4DACCEAgAA8wEAIAAAAAAABR0AAMQEACAeAADKBAAggAIAAMUEACCBAgAAyQQAIIQCAACBAQAgBR0AAMIEACAeAADHBAAggAIAAMMEACCBAgAAxgQAIIQCAAANACADHQAAxAQAIIACAADFBAAghAIAAIEBACADHQAAwgQAIIACAADDBAAghAIAAA0AIAAAAAAACx0AALcDADAeAAC8AwAwgAIAALgDADCBAgAAuQMAMIICAAC7AwAwgwIAALsDADCEAgAAuwMAMIUCAAC6AwAghgIAALsDADCHAgAAvQMAMIgCAAC-AwAwBR0AALwEACAeAADABAAggAIAAL0EACCBAgAAvwQAIIQCAAABACAECgAArwMAILwBAgAAAAHbAQIAAAAB3AECAAAAAQIAAAAJACAdAADCAwAgAwAAAAkAIB0AAMIDACAeAADBAwAgARYAAL4EADAKBQAA4gIAIAoAANwCACC5AQAA4QIAMLoBAAAHABC7AQAA4QIAMLwBAgAAAAHbAQIAvwIAIdwBAgC_AgAh4AECAL8CACH9AQAA4AIAIAIAAAAJACAWAADBAwAgAgAAAL8DACAWAADAAwAgB7kBAAC-AwAwugEAAL8DABC7AQAAvgMAMLwBAgC_AgAh2wECAL8CACHcAQIAvwIAIeABAgC_AgAhB7kBAAC-AwAwugEAAL8DABC7AQAAvgMAMLwBAgC_AgAh2wECAL8CACHcAQIAvwIAIeABAgC_AgAhA7wBAgDsAgAh2wECAOwCACHcAQIA7AIAIQQKAACtAwAgvAECAOwCACHbAQIA7AIAIdwBAgDsAgAhBAoAAK8DACC8AQIAAAAB2wECAAAAAdwBAgAAAAEEHQAAtwMAMIACAAC4AwAwhAIAALsDADCFAgAAugMAIAMdAAC8BAAggAIAAL0EACCEAgAAAQAgAAMCAACmBAAgBQAApwQAIBAAAKgEACAAAAAAAAGGAgEAAAABCx0AAM4DADAeAADTAwAwgAIAAM8DADCBAgAA0AMAMIICAADSAwAwgwIAANIDADCEAgAA0gMAMIUCAADRAwAghgIAANIDADCHAgAA1AMAMIgCAADVAwAwCgkAAPEDACAPAADyAwAgvAECAAAAAb8BEAAAAAHBAYAAAAAB2wECAAAAAeYBAQAAAAHnAQAA8AMAIOgBAQAAAAHqAQAAAOoBAgIAAAANACAdAADvAwAgAwAAAA0AIB0AAO8DACAeAADaAwAgARYAALsEADAPCAAA3wIAIAkAALgCACAPAADYAgAguQEAAN0CADC6AQAACwAQuwEAAN0CADC8AQIAAAABvwEQAJ4CACHBAQAAoAIAINsBAgC_AgAh5gEBAMACACHnAQAAwwIAIOgBAQDAAgAh6gEAAN4C6gEi6wECAL8CACECAAAADQAgFgAA2gMAIAIAAADWAwAgFgAA1wMAIAy5AQAA1QMAMLoBAADWAwAQuwEAANUDADC8AQIAvwIAIb8BEACeAgAhwQEAAKACACDbAQIAvwIAIeYBAQDAAgAh5wEAAMMCACDoAQEAwAIAIeoBAADeAuoBIusBAgC_AgAhDLkBAADVAwAwugEAANYDABC7AQAA1QMAMLwBAgC_AgAhvwEQAJ4CACHBAQAAoAIAINsBAgC_AgAh5gEBAMACACHnAQAAwwIAIOgBAQDAAgAh6gEAAN4C6gEi6wECAL8CACEIvAECAOwCACG_ARAA6gIAIcEBgAAAAAHbAQIA7AIAIeYBAQDMAwAh5wEAANgDACDoAQEAzAMAIeoBAADZA-oBIgKGAgEAAAAEiQIBAAAABQGGAgAAAOoBAgoJAADbAwAgDwAA3AMAILwBAgDsAgAhvwEQAOoCACHBAYAAAAAB2wECAOwCACHmAQEAzAMAIecBAADYAwAg6AEBAMwDACHqAQAA2QPqASILHQAA5gMAMB4AAOoDADCAAgAA5wMAMIECAADoAwAwggIAALsDADCDAgAAuwMAMIQCAAC7AwAwhQIAAOkDACCGAgAAuwMAMIcCAADrAwAwiAIAAL4DADALHQAA3QMAMB4AAOEDADCAAgAA3gMAMIECAADfAwAwggIAAJsDADCDAgAAmwMAMIQCAACbAwAwhQIAAOADACCGAgAAmwMAMIcCAADiAwAwiAIAAJ4DADAFDAAAggMAILwBAgAAAAG_ARAAAAABwgECAAAAAdsBAgAAAAECAAAAEwAgHQAA5QMAIAMAAAATACAdAADlAwAgHgAA5AMAIAEWAAC6BAAwAgAAABMAIBYAAOQDACACAAAAnwMAIBYAAOMDACAEvAECAOwCACG_ARAA6gIAIcIBAgDsAgAh2wECAOwCACEFDAAAgAMAILwBAgDsAgAhvwEQAOoCACHCAQIA7AIAIdsBAgDsAgAhBQwAAIIDACC8AQIAAAABvwEQAAAAAcIBAgAAAAHbAQIAAAABBAUAAK4DACC8AQIAAAAB2wECAAAAAeABAgAAAAECAAAACQAgHQAA7gMAIAMAAAAJACAdAADuAwAgHgAA7QMAIAEWAAC5BAAwAgAAAAkAIBYAAO0DACACAAAAvwMAIBYAAOwDACADvAECAOwCACHbAQIA7AIAIeABAgDsAgAhBAUAAKwDACC8AQIA7AIAIdsBAgDsAgAh4AECAOwCACEEBQAArgMAILwBAgAAAAHbAQIAAAAB4AECAAAAAQoJAADxAwAgDwAA8gMAILwBAgAAAAG_ARAAAAABwQGAAAAAAdsBAgAAAAHmAQEAAAAB5wEAAPADACDoAQEAAAAB6gEAAADqAQIBhgIBAAAABAQdAADmAwAwgAIAAOcDADCEAgAAuwMAMIUCAADpAwAgBB0AAN0DADCAAgAA3gMAMIQCAACbAwAwhQIAAOADACAEHQAAzgMAMIACAADPAwAwhAIAANIDADCFAgAA0QMAIAAAAAAAAAUdAAC0BAAgHgAAtwQAIIACAAC1BAAggQIAALYEACCEAgAAaAAgAx0AALQEACCAAgAAtQQAIIQCAABoACAAAAAAAAUdAACvBAAgHgAAsgQAIIACAACwBAAggQIAALEEACCEAgAAAQAgAx0AAK8EACCAAgAAsAQAIIQCAAABACAAAAAAAAGGAiAAAAABAYYCAAAA_AECBx0AAJ4EACAeAAChBAAggAIAAJ8EACCBAgAAoAQAIIICAAADACCDAgAAAwAghAIAADoAIAcdAACZBAAgHgAAnAQAIIACAACaBAAggQIAAJsEACCCAgAABQAggwIAAAUAIIQCAACBAQAgCx0AAI0EADAeAACSBAAwgAIAAI4EADCBAgAAjwQAMIICAACRBAAwgwIAAJEEADCEAgAAkQQAMIUCAACQBAAghgIAAJEEADCHAgAAkwQAMIgCAACUBAAwBgsAAKMDACANAAClAwAgDgAApgMAILwBAgAAAAHVAQAAAN4BAt4BEAAAAAECAAAAIAAgHQAAmAQAIAMAAAAgACAdAACYBAAgHgAAlwQAIAEWAACuBAAwCwEAALkCACALAADYAgAgDQAA2QIAIA4AANoCACC5AQAA1gIAMLoBAAAeABC7AQAA1gIAMLwBAgAAAAHVAQAA1wLeASLeARAAngIAId8BAgC_AgAhAgAAACAAIBYAAJcEACACAAAAlQQAIBYAAJYEACAHuQEAAJQEADC6AQAAlQQAELsBAACUBAAwvAECAL8CACHVAQAA1wLeASLeARAAngIAId8BAgC_AgAhB7kBAACUBAAwugEAAJUEABC7AQAAlAQAMLwBAgC_AgAh1QEAANcC3gEi3gEQAJ4CACHfAQIAvwIAIQO8AQIA7AIAIdUBAACIA94BIt4BEADqAgAhBgsAAIkDACANAACLAwAgDgAAjAMAILwBAgDsAgAh1QEAAIgD3gEi3gEQAOoCACEGCwAAowMAIA0AAKUDACAOAACmAwAgvAECAAAAAdUBAAAA3gEC3gEQAAAAAQELAADDAwAgAgAAAIEBACAdAACZBAAgAwAAAAUAIB0AAJkEACAeAACdBAAgAwAAAAUAIAsAALUDACAWAACdBAAgAQsAALUDACAD7wEBAAAAAfABAQAAAAHxAQIAAAABAgAAADoAIB0AAJ4EACADAAAAAwAgHQAAngQAIB4AAKIEACAFAAAAAwAgFgAAogQAIO8BAQDMAwAh8AEBAMwDACHxAQIA7AIAIQPvAQEAzAMAIfABAQDMAwAh8QECAOwCACEDHQAAngQAIIACAACfBAAghAIAADoAIAMdAACZBAAggAIAAJoEACCEAgAAgQEAIAQdAACNBAAwgAIAAI4EADCEAgAAkQQAMIUCAACQBAAgAQEAAMYDACACAQAAxgMAIAsAAMUDACAAAAIMAADvAgAg2gEAAOMCACACDAAA7wIAIMABAADjAgAgAwgAAK0EACAJAADFAwAgDwAAqQQAIAIGAAD0AwAg5QEAAOMCACADvAECAAAAAdUBAAAA3gEC3gEQAAAAAQ0FAACkBAAgEAAApQQAILwBAgAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQIAAAAB-QEBAAAAAfoBIAAAAAH8AQAAAPwBAgIAAAABACAdAACvBAAgAwAAACQAIB0AAK8EACAeAACzBAAgDwAAACQAIAUAAIsEACAQAACMBAAgFgAAswQAILwBAgDsAgAh8gEBAMwDACHzAQEAzAMAIfQBAQDMAwAh9QEBAMwDACH2AQEAzAMAIfcBAQDMAwAh-AECAOwCACH5AQEAzAMAIfoBIACIBAAh_AEAAIkE_AEiDQUAAIsEACAQAACMBAAgvAECAOwCACHyAQEAzAMAIfMBAQDMAwAh9AEBAMwDACH1AQEAzAMAIfYBAQDMAwAh9wEBAMwDACH4AQIA7AIAIfkBAQDMAwAh-gEgAIgEACH8AQAAiQT8ASIDvAECAAAAAeQBAQAAAAHlAQEAAAABAgAAAGgAIB0AALQEACADAAAAawAgHQAAtAQAIB4AALgEACAFAAAAawAgFgAAuAQAILwBAgDsAgAh5AEBAMwDACHlAQEA6wIAIQO8AQIA7AIAIeQBAQDMAwAh5QEBAOsCACEDvAECAAAAAdsBAgAAAAHgAQIAAAABBLwBAgAAAAG_ARAAAAABwgECAAAAAdsBAgAAAAEIvAECAAAAAb8BEAAAAAHBAYAAAAAB2wECAAAAAeYBAQAAAAHnAQAA8AMAIOgBAQAAAAHqAQAAAOoBAg0CAACjBAAgEAAApQQAILwBAgAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQIAAAAB-QEBAAAAAfoBIAAAAAH8AQAAAPwBAgIAAAABACAdAAC8BAAgA7wBAgAAAAHbAQIAAAAB3AECAAAAAQMAAAAkACAdAAC8BAAgHgAAwQQAIA8AAAAkACACAACKBAAgEAAAjAQAIBYAAMEEACC8AQIA7AIAIfIBAQDMAwAh8wEBAMwDACH0AQEAzAMAIfUBAQDMAwAh9gEBAMwDACH3AQEAzAMAIfgBAgDsAgAh-QEBAMwDACH6ASAAiAQAIfwBAACJBPwBIg0CAACKBAAgEAAAjAQAILwBAgDsAgAh8gEBAMwDACHzAQEAzAMAIfQBAQDMAwAh9QEBAMwDACH2AQEAzAMAIfcBAQDMAwAh-AECAOwCACH5AQEAzAMAIfoBIACIBAAh_AEAAIkE_AEiCwgAAPsDACAPAADyAwAgvAECAAAAAb8BEAAAAAHBAYAAAAAB2wECAAAAAeYBAQAAAAHnAQAA8AMAIOgBAQAAAAHqAQAAAOoBAusBAgAAAAECAAAADQAgHQAAwgQAIAIBAADEAwAgvAECAAAAAQIAAACBAQAgHQAAxAQAIAMAAAALACAdAADCBAAgHgAAyAQAIA0AAAALACAIAAD6AwAgDwAA3AMAIBYAAMgEACC8AQIA7AIAIb8BEADqAgAhwQGAAAAAAdsBAgDsAgAh5gEBAMwDACHnAQAA2AMAIOgBAQDMAwAh6gEAANkD6gEi6wECAOwCACELCAAA-gMAIA8AANwDACC8AQIA7AIAIb8BEADqAgAhwQGAAAAAAdsBAgDsAgAh5gEBAMwDACHnAQAA2AMAIOgBAQDMAwAh6gEAANkD6gEi6wECAOwCACEDAAAABQAgHQAAxAQAIB4AAMsEACAEAAAABQAgAQAAtgMAIBYAAMsEACC8AQIA7AIAIQIBAAC2AwAgvAECAOwCACENAgAAowQAIAUAAKQEACC8AQIAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAAB-AECAAAAAfkBAQAAAAH6ASAAAAAB_AEAAAD8AQICAAAAAQAgHQAAzAQAIAS8AQIAAAABvwEQAAAAAdsBAgAAAAHcAQIAAAABAwAAACQAIB0AAMwEACAeAADRBAAgDwAAACQAIAIAAIoEACAFAACLBAAgFgAA0QQAILwBAgDsAgAh8gEBAMwDACHzAQEAzAMAIfQBAQDMAwAh9QEBAMwDACH2AQEAzAMAIfcBAQDMAwAh-AECAOwCACH5AQEAzAMAIfoBIACIBAAh_AEAAIkE_AEiDQIAAIoEACAFAACLBAAgvAECAOwCACHyAQEAzAMAIfMBAQDMAwAh9AEBAMwDACH1AQEAzAMAIfYBAQDMAwAh9wEBAMwDACH4AQIA7AIAIfkBAQDMAwAh-gEgAIgEACH8AQAAiQT8ASIHAQAApAMAIA0AAKUDACAOAACmAwAgvAECAAAAAdUBAAAA3gEC3gEQAAAAAd8BAgAAAAECAAAAIAAgHQAA0gQAIAsIAAD7AwAgCQAA8QMAILwBAgAAAAG_ARAAAAABwQGAAAAAAdsBAgAAAAHmAQEAAAAB5wEAAPADACDoAQEAAAAB6gEAAADqAQLrAQIAAAABAgAAAA0AIB0AANQEACADAAAAHgAgHQAA0gQAIB4AANgEACAJAAAAHgAgAQAAigMAIA0AAIsDACAOAACMAwAgFgAA2AQAILwBAgDsAgAh1QEAAIgD3gEi3gEQAOoCACHfAQIA7AIAIQcBAACKAwAgDQAAiwMAIA4AAIwDACC8AQIA7AIAIdUBAACIA94BIt4BEADqAgAh3wECAOwCACEDAAAACwAgHQAA1AQAIB4AANsEACANAAAACwAgCAAA-gMAIAkAANsDACAWAADbBAAgvAECAOwCACG_ARAA6gIAIcEBgAAAAAHbAQIA7AIAIeYBAQDMAwAh5wEAANgDACDoAQEAzAMAIeoBAADZA-oBIusBAgDsAgAhCwgAAPoDACAJAADbAwAgvAECAOwCACG_ARAA6gIAIcEBgAAAAAHbAQIA7AIAIeYBAQDMAwAh5wEAANgDACDoAQEAzAMAIeoBAADZA-oBIusBAgDsAgAhBwEAAKQDACALAACjAwAgDgAApgMAILwBAgAAAAHVAQAAAN4BAt4BEAAAAAHfAQIAAAABAgAAACAAIB0AANwEACADAAAAHgAgHQAA3AQAIB4AAOAEACAJAAAAHgAgAQAAigMAIAsAAIkDACAOAACMAwAgFgAA4AQAILwBAgDsAgAh1QEAAIgD3gEi3gEQAOoCACHfAQIA7AIAIQcBAACKAwAgCwAAiQMAIA4AAIwDACC8AQIA7AIAIdUBAACIA94BIt4BEADqAgAh3wECAOwCACEHAQAApAMAIAsAAKMDACANAAClAwAgvAECAAAAAdUBAAAA3gEC3gEQAAAAAd8BAgAAAAECAAAAIAAgHQAA4QQAIAMAAAAeACAdAADhBAAgHgAA5QQAIAkAAAAeACABAACKAwAgCwAAiQMAIA0AAIsDACAWAADlBAAgvAECAOwCACHVAQAAiAPeASLeARAA6gIAId8BAgDsAgAhBwEAAIoDACALAACJAwAgDQAAiwMAILwBAgDsAgAh1QEAAIgD3gEi3gEQAOoCACHfAQIA7AIAIQQCBAIFBgMHAA8QIQkBAQABAwEAAQcADgsKBAIFAAMKAAUEBwANCAAGCRAEDxQIAgYOBQcABwEGDwACCgAFDAAJBQEAAQcADAsVCA0XCg4ZCwEMAAkBDAAJAQsaAAIJGwAPHAABCx0AARAiAAAAAAUHABQjABUkABYlABcmABgAAAAAAAUHABQjABUkABYlABcmABgBAQABAQEAAQUHAB0jAB4kAB8lACAmACEAAAAAAAUHAB0jAB4kAB8lACAmACEBCAAGAQgABgUHACYjACckACglACkmACoAAAAAAAUHACYjACckACglACkmACoAAAUHAC8jADAkADElADImADMAAAAAAAUHAC8jADAkADElADImADMBAQABAQEAAQUHADgjADkkADolADsmADwAAAAAAAUHADgjADkkADolADsmADwCBQADCgAFAgUAAwoABQUHAEEjAEIkAEMlAEQmAEUAAAAAAAUHAEEjAEIkAEMlAEQmAEUBAQABAQEAAQUHAEojAEskAEwlAE0mAE4AAAAAAAUHAEojAEskAEwlAE0mAE4CCgAFDAAJAgoABQwACQUHAFMjAFQkAFUlAFYmAFcAAAAAAAUHAFMjAFQkAFUlAFYmAFcBDAAJAQwACQUHAFwjAF0kAF4lAF8mAGAAAAAAAAUHAFwjAF0kAF4lAF8mAGABDAAJAQwACQUHAGUjAGYkAGclAGgmAGkAAAAAAAUHAGUjAGYkAGclAGgmAGkRAgESIwETJgEUJwEVKAEXKgEYLBAZLREaLwEbMRAcMhIfMwEgNAEhNRAnOBMoORkpOwIqPAIrPgIsPwItQAIuQgIvRBAwRRoxRwIySRAzShs0SwI1TAI2TRA3UBw4USI5UgU6UwU7VAU8VQU9VgU-WAU_WhBAWyNBXQVCXxBDYCREYQVFYgVGYxBHZiVIZytJaQZKagZLbQZMbgZNbwZOcQZPcxBQdCxRdgZSeBBTeS1UegZVewZWfBBXfy5YgAE0WYIBA1qDAQNbhQEDXIYBA12HAQNeiQEDX4sBEGCMATVhjgEDYpABEGORATZkkgEDZZMBA2aUARBnlwE3aJgBPWmZAQRqmgEEa5sBBGycAQRtnQEEbp8BBG-hARBwogE-caQBBHKmARBzpwE_dKgBBHWpAQR2qgEQd60BQHiuAUZ5rwEJerABCXuxAQl8sgEJfbMBCX61AQl_twEQgAG4AUeBAboBCYIBvAEQgwG9AUiEAb4BCYUBvwEJhgHAARCHAcMBSYgBxAFPiQHFAQiKAcYBCIsBxwEIjAHIAQiNAckBCI4BywEIjwHNARCQAc4BUJEB0AEIkgHSARCTAdMBUZQB1AEIlQHVAQiWAdYBEJcB2QFSmAHaAViZAdwBCpoB3QEKmwHfAQqcAeABCp0B4QEKngHjAQqfAeUBEKAB5gFZoQHoAQqiAeoBEKMB6wFapAHsAQqlAe0BCqYB7gEQpwHxAVuoAfIBYakB9AELqgH1AQurAfcBC6wB-AELrQH5AQuuAfsBC68B_QEQsAH-AWKxAYACC7IBggIQswGDAmO0AYQCC7UBhQILtgGGAhC3AYkCZLgBigJq"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("node:buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// prisma/generated/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AddressScalarFieldEnum: () => AddressScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CartItemScalarFieldEnum: () => CartItemScalarFieldEnum,
  CartScalarFieldEnum: () => CartScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  DeliveryScalarFieldEnum: () => DeliveryScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  JsonNullValueInput: () => JsonNullValueInput,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProducerScalarFieldEnum: () => ProducerScalarFieldEnum,
  ProductScalarFieldEnum: () => ProductScalarFieldEnum,
  QueryMode: () => QueryMode,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
var runtime2 = __toESM(require("@prisma/client/runtime/client"));
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.8.0",
  engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Address: "Address",
  Product: "Product",
  Producer: "Producer",
  Cart: "Cart",
  CartItem: "CartItem",
  Order: "Order",
  OrderItem: "OrderItem",
  Payment: "Payment",
  Delivery: "Delivery"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  email: "email",
  password: "password",
  username: "username",
  firstname: "firstname",
  lastname: "lastname",
  phone: "phone",
  birthYear: "birthYear",
  profession: "profession",
  isMarried: "isMarried",
  role: "role"
};
var AddressScalarFieldEnum = {
  id: "id",
  city: "city",
  street: "street",
  houseNumber: "houseNumber"
};
var ProductScalarFieldEnum = {
  id: "id",
  productName: "productName",
  imgUrls: "imgUrls",
  price: "price",
  description: "description",
  quantity: "quantity",
  category: "category",
  details: "details",
  producerId: "producerId"
};
var ProducerScalarFieldEnum = {
  id: "id",
  name: "name",
  logoUrl: "logoUrl"
};
var CartScalarFieldEnum = {
  id: "id"
};
var CartItemScalarFieldEnum = {
  id: "id",
  quantity: "quantity",
  cartId: "cartId",
  productId: "productId"
};
var OrderScalarFieldEnum = {
  id: "id",
  status: "status",
  totalAmount: "totalAmount",
  userId: "userId"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  quantity: "quantity",
  price: "price",
  productId: "productId",
  orderId: "orderId"
};
var PaymentScalarFieldEnum = {
  id: "id",
  status: "status",
  method: "method",
  amount: "amount",
  provider: "provider",
  externalId: "externalId",
  orderId: "orderId"
};
var DeliveryScalarFieldEnum = {
  id: "id",
  method: "method",
  price: "price",
  trackingNumber: "trackingNumber",
  details: "details",
  orderId: "orderId"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var JsonNullValueInput = {
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// prisma/generated/client.ts
var PrismaClient = getPrismaClientClass();

// src/shared/infrastructure/database/prisma.service.ts
var PrismaService = class extends PrismaClient {
  constructor() {
    const pool = new import_pg.Pool({
      connectionString: process.env.DATABASE_URL
    });
    const adapter = new import_adapter_pg.PrismaPg(pool);
    super({ adapter });
  }
  async connect() {
    try {
      await this.$connect();
      console.log("\u{1F418} Database connected successfully");
    } catch (error) {
      console.error("\u274C Database connection failed:", error);
      process.exit(1);
    }
  }
  async disconnect() {
    await this.$disconnect();
  }
};

// src/shared/infrastructure/di/container.ts
var import_awilix9 = require("awilix");

// src/shared/error/app.error.ts
var AppError = class _AppError extends Error {
  constructor(errorPayload) {
    super(errorPayload.message);
    this.name = "AppError";
    this.code = errorPayload.code;
    this.statusCode = errorPayload.statusCode;
    this.details = errorPayload.details;
    Object.setPrototypeOf(this, _AppError.prototype);
  }
  // Геттер, який автоматично збирає об'єкт ErrorResponse
  get errorPayload() {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details
    };
  }
  //Метод, необхідний для парсинга в JSON обєкта AppError. Без нього парсинг може може бути з помилками
  toJSON() {
    return this.errorPayload;
  }
};

// src/shared/error/custom.errors.ts
var BadRequestError = class extends AppError {
  constructor(message = "\u041D\u0435\u043A\u043E\u0440\u0435\u043A\u0442\u043D\u0438\u0439 \u0437\u0430\u043F\u0438\u0442", details) {
    super({
      message,
      code: "BAD_REQUEST",
      statusCode: 400,
      details
    });
  }
};
var UnauthorizedError = class extends AppError {
  constructor(message = "\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447 \u043D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D\u0438\u0439") {
    super({
      message,
      code: "UNAUTHORIZED",
      statusCode: 401
    });
  }
};
var ForbiddenError = class extends AppError {
  constructor(message = "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u0431\u043E\u0440\u043E\u043D\u0435\u043D\u043E") {
    super({
      message,
      code: "FORBIDDEN",
      statusCode: 403
    });
  }
};
var NotFoundError = class extends AppError {
  constructor(message = "\u0420\u0435\u0441\u0443\u0440\u0441 \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E") {
    super({
      message,
      code: "NOT_FOUND",
      statusCode: 404
    });
  }
};
var ConflictError = class extends AppError {
  constructor(field, details) {
    super({
      message: `\u0417\u0430\u043F\u0438\u0441 \u0456\u0437 \u0442\u0430\u043A\u0438\u043C \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F\u043C \u0434\u043B\u044F \u043F\u043E\u043B\u044F ${field} \u0432\u0436\u0435 \u0456\u0441\u043D\u0443\u0454`,
      code: "CONFLICT",
      statusCode: 409,
      details
    });
  }
};
var ValidationError = class extends AppError {
  constructor(details, message = "\u043F\u043E\u043C\u0438\u043B\u043A\u0430 \u0432\u0430\u043B\u0456\u0434\u0430\u0446\u0456\u0457 \u0434\u0430\u043D\u0438\u0445") {
    super({
      message,
      code: "VALIDATION_ERROR",
      statusCode: 422,
      details
    });
  }
};
var InternalServerError = class extends AppError {
  constructor(message = "\u0412\u043D\u0443\u0442\u0440\u0456\u0448\u043D\u044F \u043F\u043E\u043C\u0438\u043B\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430") {
    super({
      message,
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500
    });
  }
};
var BadGatewayError = class extends AppError {
  constructor(message = "\u0417\u043E\u0432\u043D\u0456\u0448\u043D\u0456\u0439 \u0441\u0435\u0440\u0432\u0456\u0441 \u043F\u043E\u0432\u0435\u0440\u043D\u0443\u0432 \u043D\u0435\u043A\u043E\u0440\u0435\u043A\u0442\u043D\u0443 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C \u0430\u0431\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0439") {
    super({
      message,
      code: "BAD_GATEWAY_ERROR",
      statusCode: 502
    });
  }
};

// src/api/helpers/http.helpers.ts
var extractAccessTokenOrThrow = (req) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("access \u0442\u043E\u043A\u0435\u043D \u0432\u0456\u0434\u0441\u0443\u0442\u043D\u0456\u0439");
  }
  const accessToken = authHeader.split(" ")[1];
  return accessToken;
};
var extractTokenPayloadOrThrow = (req) => {
  const tokenPayload = req.tokenPayload;
  if (!tokenPayload) {
    throw new InternalServerError("payload \u0437 \u0434\u0430\u043D\u0438\u043C\u0438 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u0432\u0456\u0434\u0441\u0443\u0442\u043D\u0456\u0439");
  }
  return tokenPayload;
};
var extractValidatedBodyOrThrow = (req) => {
  if (!req.valid) {
    throw new InternalServerError("\u0411\u0443\u0434\u044C-\u044F\u043A\u0456 \u0437\u0432\u0430\u043B\u0456\u0434\u043E\u0432\u0430\u043D\u0456 \u0434\u0430\u043D\u0456 \u0432\u0456\u0434\u0441\u0443\u0442\u043D\u0456");
  }
  const validatedBody = req.valid.body;
  if (!validatedBody) {
    throw new InternalServerError("\u0417\u0432\u0430\u043B\u0456\u0434\u043E\u0432\u0430\u043D\u0435 \u0442\u0456\u043B\u043E \u0437\u0430\u043F\u0438\u0442\u0443 \u0432\u0456\u0434\u0441\u0443\u0442\u043D\u0454");
  }
  return validatedBody;
};
var extractValidatedQueryOrThrow = (req) => {
  if (!req.valid) {
    throw new InternalServerError("\u0411\u0443\u0434\u044C-\u044F\u043A\u0456 \u0437\u0432\u0430\u043B\u0456\u0434\u043E\u0432\u0430\u043D\u0456 \u0434\u0430\u043D\u0456 \u0432\u0456\u0434\u0441\u0443\u0442\u043D\u0456");
  }
  const validatedQuery = req.valid.query;
  if (!validatedQuery) {
    throw new InternalServerError("\u0417\u0432\u0430\u043B\u0456\u0434\u043E\u0432\u0430\u043D\u0456 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0438 \u0437\u0430\u043F\u0438\u0442\u0443 \u0432\u0456\u0434\u0441\u0443\u0442\u043D\u0456");
  }
  return validatedQuery;
};
var extractValidatedParamsOrThrow = (req) => {
  if (!req.valid) {
    throw new InternalServerError("\u0411\u0443\u0434\u044C-\u044F\u043A\u0456 \u0437\u0432\u0430\u043B\u0456\u0434\u043E\u0432\u0430\u043D\u0456 \u0434\u0430\u043D\u0456 \u0432\u0456\u0434\u0441\u0443\u0442\u043D\u0456");
  }
  const validatedParams = req.valid.params;
  if (!validatedParams) {
    throw new InternalServerError("\u0417\u0432\u0430\u043B\u0456\u0434\u043E\u0432\u0430\u043D\u0456 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0438 url \u0437\u0430\u043F\u0438\u0442\u0443 \u0432\u0456\u0434\u0441\u0443\u0442\u043D\u0456");
  }
  return validatedParams;
};
var normalizeQueryParams = (queryParams) => {
  const normalizedQueryParams = {};
  Object.keys(queryParams).forEach((key) => {
    const value = queryParams[key];
    if (typeof value === "string" || Array.isArray(value) && value.every((item) => typeof item === "string") || typeof value === "undefined") {
      const newKey = key.replace("[]", "");
      normalizedQueryParams[newKey] = value;
    } else {
      console.log("Type of value are included object or array of includes object.");
    }
  });
  return normalizedQueryParams;
};

// src/api/middlewares/auth.middleware.ts
var AuthMiddleware = class {
  constructor({ jwtProvider }) {
    this.authenticate = (req, res, next) => {
      const accessToken = extractAccessTokenOrThrow(req);
      const payload = this.jwtProvider.verifyAccess(accessToken);
      if (!payload) {
        throw new UnauthorizedError("access \u0442\u043E\u043A\u0435\u043D \u043D\u0435\u0434\u0456\u0439\u0441\u043D\u0438\u0439 \u0447\u0438 \u043D\u0435\u043A\u043E\u0440\u0435\u043A\u0442\u043D\u0438\u0439");
      }
      console.log("EXTRACTED PAYLOAD: ", payload);
      req.tokenPayload = payload;
      next();
    };
    this.authorize = (allowedRoles) => (req, res, next) => {
      const tokenPayload = extractTokenPayloadOrThrow(req);
      const hasAccess = allowedRoles.includes(tokenPayload.role);
      if (!hasAccess) {
        throw new ForbiddenError("\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447 \u043D\u0435 \u043C\u0430\u0454 \u043D\u0435\u043E\u0431\u0445\u0456\u0434\u043D\u0438\u0445 \u043F\u0440\u0430\u0432 \u0434\u043E\u0441\u0442\u0443\u043F\u0443");
      }
      next();
    };
    this.jwtProvider = jwtProvider;
  }
};

// src/shared/infrastructure/auth/jwt.provider.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));

// src/shared/schemas/token-payload.schema.ts
var import_zod3 = require("zod");

// src/shared/schemas/user-role.schema.ts
var import_zod2 = require("zod");
var userRoleSchema = import_zod2.z.enum(["guest", "user", "admin"]);

// src/shared/schemas/token-payload.schema.ts
var tokenPayloadSchema = import_zod3.z.object({
  id: import_zod3.z.number().int(),
  email: import_zod3.z.email({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 email" }),
  role: userRoleSchema,
  iat: import_zod3.z.number().positive().optional(),
  exp: import_zod3.z.number().positive().optional()
});

// src/shared/infrastructure/auth/jwt.provider.ts
var JwtProvider = class {
  constructor({ config: config3 }) {
    // Генерація Access Token (1 хвилина)
    this.signAccess = (payload) => {
      const { iat, exp, ...data } = payload;
      const accessToken = import_jsonwebtoken.default.sign(
        data,
        this.config.jwt.access.secret,
        { expiresIn: this.config.jwt.access.expiresIn }
      );
      return accessToken;
    };
    // Генерація Refresh Token (2 хвилини)
    this.signRefresh = (payload) => {
      const { iat, exp, ...data } = payload;
      const refreshToken = import_jsonwebtoken.default.sign(
        data,
        this.config.jwt.refresh.secret,
        { expiresIn: this.config.jwt.refresh.expiresIn }
      );
      return refreshToken;
    };
    // Валідація Access Token
    this.verifyAccess = (token) => {
      try {
        const decoded = import_jsonwebtoken.default.verify(token, this.config.jwt.access.secret);
        const tokenPayload = tokenPayloadSchema.parse(decoded);
        return tokenPayload;
      } catch (error) {
        return null;
      }
    };
    // Валідація Refresh Token
    this.verifyRefresh = (token) => {
      try {
        const decoded = import_jsonwebtoken.default.verify(token, this.config.jwt.refresh.secret);
        const tokenPayload = tokenPayloadSchema.parse(decoded);
        return tokenPayload;
      } catch (error) {
        return null;
      }
    };
    this.config = config3;
  }
};

// src/shared/infrastructure/cryptography/bcrypt.provider.ts
var import_bcrypt = __toESM(require("bcrypt"));
var BcryptProvider = class {
  constructor() {
    this.saltRounds = 10;
    // Додаємо async, щоб метод повертав Promise<string>
    this.hash = async (data) => {
      return await import_bcrypt.default.hash(data, this.saltRounds);
    };
    // Додаємо async, щоб метод повертав Promise<boolean>
    this.compare = async (data, hash) => {
      return await import_bcrypt.default.compare(data, hash);
    };
  }
};

// src/api/routers/app.router.ts
var import_express = require("express");
var createAppRouter = ({ authRouter, userRouter, productRouter, producerRouter, cartRouter, orderRouter, paymentRouter }) => {
  const router = (0, import_express.Router)();
  router.use("/users", userRouter);
  router.use("/auth", authRouter);
  router.use("/products", productRouter);
  router.use("/producers", producerRouter);
  router.use("/cart", cartRouter);
  router.use("/orders", orderRouter);
  router.use("/payments", paymentRouter);
  return router;
};

// src/modules/auth/auth.module.ts
var import_awilix = require("awilix");

// src/modules/auth/api/auth.dto.ts
var import_zod4 = require("zod");
var loginDtoSchema = import_zod4.z.object({
  email: import_zod4.z.string().email("\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u043F\u043E\u0448\u0442\u0438"),
  password: import_zod4.z.string().min(8, "\u0414\u043E\u0432\u0436\u0438\u043D\u0430 \u043F\u0430\u0440\u043E\u043B\u044E \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 8 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432")
});
var refreshAllTokensDtoSchema = import_zod4.z.object({
  refreshToken: import_zod4.z.string()
});
var authResponseSchema = import_zod4.z.object({
  accessToken: import_zod4.z.string(),
  refreshToken: import_zod4.z.string()
});

// src/modules/auth/api/auth.mapper.ts
var toAuthResponse = (accessToken, refreshToken) => {
  const response = {
    accessToken,
    refreshToken
  };
  const validatedResponse = authResponseSchema.parse(response);
  return validatedResponse;
};

// src/modules/auth/application/auth.service.ts
var AuthService = class {
  constructor({ jwtProvider, userService }) {
    this.login = async (dto) => {
      console.log("Starting checking credentials: ", dto);
      const { email, password } = dto;
      const user = await this.userService.verifyCredentials(email, password);
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role
      };
      const accessToken = this.jwtProvider.signAccess(payload);
      console.log("Starting access token: ", accessToken);
      const refreshToken = this.jwtProvider.signRefresh(payload);
      const response = toAuthResponse(accessToken, refreshToken);
      return response;
    };
    this.refreshAllTokens = (dto) => {
      const { refreshToken } = dto;
      const payload = this.jwtProvider.verifyRefresh(refreshToken);
      if (!payload) {
        throw new UnauthorizedError("refresh \u0442\u043E\u043A\u0435\u043D \u043D\u0435\u0434\u0456\u0439\u0441\u043D\u0438\u0439 \u0447\u0438 \u043D\u0435\u043A\u043E\u0440\u0435\u043A\u0442\u043D\u0438\u0439");
      }
      const newAccessToken = this.jwtProvider.signAccess(payload);
      const newRefreshToken = this.jwtProvider.signRefresh(payload);
      console.log("New access token: ", newAccessToken);
      console.log("new refreshToken: ", newRefreshToken);
      const response = toAuthResponse(newAccessToken, newRefreshToken);
      return response;
    };
    this.jwtProvider = jwtProvider;
    this.userService = userService;
  }
};

// src/modules/auth/api/auth.controller.ts
var AuthController = class {
  constructor({ authService }) {
    this.login = async (req, res) => {
      console.log("starting login");
      const dto = extractValidatedBodyOrThrow(req);
      console.log("LoginDto", dto);
      const response = await this.authService.login(dto);
      res.json(response);
    };
    this.refresh = async (req, res) => {
      const dto = extractValidatedBodyOrThrow(req);
      const response = this.authService.refreshAllTokens(dto);
      res.json(response);
    };
    this.authService = authService;
  }
};

// src/modules/auth/api/auth.router.ts
var import_express2 = require("express");

// src/api/middlewares/validation.middleware.ts
var validate = (schemas) => (req, res, next) => {
  req.valid = {
    body: schemas.body ? schemas.body.parse(req.body) : void 0,
    query: schemas.query ? schemas.query.parse(normalizeQueryParams(req.query)) : void 0,
    params: schemas.params ? schemas.params.parse(req.params) : void 0
  };
  next();
};

// src/modules/auth/api/auth.router.ts
var createAuthRouter = ({ authController }) => {
  const router = (0, import_express2.Router)();
  router.post(
    "/login",
    validate({ body: loginDtoSchema }),
    authController.login
  );
  router.post(
    "/refresh",
    validate({ body: refreshAllTokensDtoSchema }),
    authController.refresh
  );
  return router;
};

// src/modules/auth/auth.module.ts
var authModuleDeps = {
  authService: (0, import_awilix.asClass)(AuthService).singleton(),
  authController: (0, import_awilix.asClass)(AuthController).singleton(),
  authRouter: (0, import_awilix.asFunction)(createAuthRouter).singleton()
};

// src/modules/user/api/user.dto.ts
var import_zod6 = require("zod");

// src/shared/schemas/pagination.schema.ts
var import_zod5 = require("zod");
var paginationCriteriaSchema = import_zod5.z.object({
  pageNo: import_zod5.z.coerce.number().int().nonnegative().default(0),
  pageSize: import_zod5.z.coerce.number().int().positive().default(10),
  sortOrder: import_zod5.z.enum(["asc", "desc"]).default("asc")
});
var paginationMetaSchema = import_zod5.z.object({
  pageNo: import_zod5.z.number().int().nonnegative(),
  pageSize: import_zod5.z.number().int().positive(),
  totalElements: import_zod5.z.number().int().nonnegative(),
  totalPages: import_zod5.z.number().int().positive(),
  last: import_zod5.z.boolean()
});

// src/shared/utils/validation.utils.ts
var arrayPreprocess = (val) => {
  if (val === void 0) return void 0;
  const stringArray = Array.isArray(val) ? val : [val];
  return stringArray;
};

// src/modules/user/api/user.dto.ts
var userSchema = import_zod6.z.object({
  id: import_zod6.z.number().int().positive(),
  email: import_zod6.z.email({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 email" }),
  password: import_zod6.z.string().min(8, { message: "\u0414\u043E\u0432\u0436\u0438\u043D\u0430 \u043F\u0430\u0440\u043E\u043B\u044E \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 8 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432" }),
  username: import_zod6.z.string().min(6, { message: "\u0414\u043E\u0432\u0436\u0438\u043D\u0430 \u0456\u043C\u0435\u043D\u0456 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 6 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432" }),
  firstname: import_zod6.z.string(),
  lastname: import_zod6.z.string(),
  phone: import_zod6.z.string().length(17, "\u0414\u043E\u0432\u0436\u0438\u043D\u0430 \u043D\u043E\u043C\u0435\u0440\u0443 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 17 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432").regex(/^\+38\(0\d{2}\)\d{3}-\d{2}-\d{2}$/, "\u0424\u043E\u0440\u043C\u0430\u0442: +38(0XX)XXX-XX-XX"),
  birthYear: import_zod6.z.number().int().min(1900, { message: "\u0420\u0456\u043A \u043D\u0430\u0440\u043E\u0434\u0436\u0435\u043D\u043D\u044F \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043D\u0435 \u043C\u0435\u043D\u0448\u0438\u043C \u043D\u0456\u0436 1900" }),
  profession: import_zod6.z.string(),
  isMarried: import_zod6.z.boolean(),
  role: userRoleSchema
});
var addressSchema = import_zod6.z.object({
  city: import_zod6.z.string(),
  street: import_zod6.z.string(),
  houseNumber: import_zod6.z.number().int()
});
var baseUserDtoSchema = userSchema.omit({ id: true, role: true });
var createUserDtoSchema = baseUserDtoSchema.extend({
  address: addressSchema
});
var updateUserDtoSchema = baseUserDtoSchema.extend({
  address: addressSchema.partial()
}).partial();
var userParamsSchema = import_zod6.z.object({
  id: import_zod6.z.coerce.number().int().positive()
});
var userFiltersSchema = import_zod6.z.object({
  firstname: import_zod6.z.coerce.string().optional(),
  lastname: import_zod6.z.coerce.string().optional(),
  roles: import_zod6.z.preprocess(arrayPreprocess, import_zod6.z.array(userRoleSchema)).optional()
});
var userSortTypeSchema = userSchema.pick({ firstname: true, lastname: true }).keyof().default("lastname");
var usersQuerySchema = paginationCriteriaSchema.extend({
  sortType: userSortTypeSchema
}).extend(userFiltersSchema.shape);
var baseUserResponseSchema = userSchema.omit({ password: true });
var userResponseSchema = baseUserResponseSchema;
var userFullResponseSchema = baseUserResponseSchema.extend({
  address: addressSchema
});
var usersResponseSchema = import_zod6.z.object({
  content: import_zod6.z.array(userResponseSchema),
  meta: paginationMetaSchema
});

// src/modules/user/user.module.ts
var import_awilix2 = require("awilix");

// src/modules/user/domain/user.entity.ts
var userInclude = {
  address: true
  //Реляції cart та orders не потрібні, щоб не перевантажувати бд. В них є власні маршрути, якими і слід користуватись
};

// src/modules/user/infrastructure/database/user.repository.ts
var UserRepository = class {
  constructor({ dbService }) {
    this.findById = async (id) => {
      const user = await this.dbService.user.findUnique({
        where: {
          id
        }
      });
      return user;
    };
    this.findFullById = async (id) => {
      const user = await this.dbService.user.findUnique({
        where: {
          id
        },
        include: userInclude
      });
      return user;
    };
    this.findByEmail = async (email) => {
      const user = await this.dbService.user.findUnique({
        where: {
          email
        }
      });
      return user;
    };
    this.findMany = async (args) => {
      const users = await this.dbService.user.findMany(args);
      return users;
    };
    this.count = async (where) => {
      const count = await this.dbService.user.count({ where });
      return count;
    };
    this.create = async (data) => {
      const user = await this.dbService.user.create({
        data,
        include: userInclude
      });
      return user;
    };
    this.update = async (id, data) => {
      const user = await this.dbService.user.update({
        where: {
          id
        },
        data,
        include: userInclude
      });
      return user;
    };
    this.delete = async (id) => {
      const user = await this.dbService.user.delete({
        where: {
          id
        },
        include: userInclude
      });
      return user;
    };
    this.dbService = dbService;
  }
};

// src/modules/user/api/user.mapper.ts
var toUserResponse = (user) => {
  const transformedUser = {
    //Деструктуризація без ручного маппінгу разом з лишніми полями (password, addressId)
    ...user
    //додаткові поля, або змінені поля, якщо контракт репозиторію відрізняється від контракту response
  };
  const userResponse = userResponseSchema.parse(transformedUser);
  return userResponse;
};
var toUserFullResponse = (user) => {
  const transformedUser = {
    //Деструктуризація без ручного маппінгу разом з лишніми полями (password, addressId)
    ...user
    //додаткові поля, або змінені поля, якщо контракт репозиторію відрізняється від контракту response
  };
  const userFullResponse = userFullResponseSchema.parse(transformedUser);
  return userFullResponse;
};
var toUsersResponse = (content, meta) => {
  const response = {
    content,
    meta
  };
  const validatedResponse = usersResponseSchema.parse(response);
  return validatedResponse;
};

// src/modules/user/application/user.mapper.ts
var toUserWhereInput = (userFilters) => {
  const where = {
    firstname: userFilters.firstname ? { contains: userFilters.firstname, mode: "insensitive" } : void 0,
    lastname: userFilters.lastname ? { contains: userFilters.lastname, mode: "insensitive" } : void 0,
    role: userFilters.roles ? { in: userFilters.roles } : void 0
  };
  return where;
};
var toUserFindManyArgs = (query) => {
  const { sortType, sortOrder, pageNo, pageSize, ...filters } = query;
  const where = toUserWhereInput(filters);
  const args = {
    where,
    orderBy: {
      [sortType]: sortOrder
    },
    take: pageSize,
    skip: pageNo * pageSize
  };
  return args;
};
var toUserCreateInput = (dto) => {
  const { address, ...rest } = dto;
  const data = {
    ...rest,
    address: {
      create: address
      // id присвоїться таке ж, як і в User
    },
    cart: {
      create: {}
      // id присвоїться таке ж, як і в User
    }
  };
  return data;
};
var toUserUpdateInput = (dto) => {
  const { address, ...rest } = dto;
  const data = {
    ...rest,
    //Обовязково робимо перевірку на undefined, інакше update: undefined викличе помилку
    address: address ? { update: address } : void 0
  };
  return data;
};

// src/shared/utils/pagination.utils.ts
var createPaginationMeta = (pageNo, pageSize, totalElements) => {
  const totalPages = Math.ceil(totalElements / pageSize) || 1;
  const last = pageNo >= totalPages - 1;
  const paginationMeta = {
    pageNo,
    pageSize,
    totalElements,
    totalPages,
    last
  };
  return paginationMeta;
};

// src/modules/user/application/user.service.ts
var UserService = class {
  constructor({ hashProvider, userRepository }) {
    //Сервісний метод для отримання користувача без реляцій. Використовується в адмінці
    this.findById = async (id) => {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundError(`\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u0437 ID ${id} \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E`);
      }
      const response = toUserResponse(user);
      return response;
    };
    //сервісний метод для отримання поточного автентифікованого користувача з реляціями
    this.findFullById = async (id) => {
      const user = await this.userRepository.findFullById(id);
      if (!user) {
        throw new NotFoundError(`\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u0437 ID ${id} \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E`);
      }
      const response = toUserFullResponse(user);
      return response;
    };
    //Сервісний метод, який викликається модулем schemas під час автентифікації користувача
    this.findByEmail = async (email) => {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundError(`\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u0437 email ${email} \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E`);
      }
      return user;
    };
    //Сервісний метод для отримання списку користувачів без реляцій. Використовується в адмінці
    this.findMany = async (query) => {
      const args = toUserFindManyArgs(query);
      const [users, totalElements] = await Promise.all([
        this.userRepository.findMany(args),
        //where дістаємо з args, щоб фільтри для findMany та count були синхронізовані
        this.userRepository.count(args.where)
      ]);
      const content = users.map(toUserResponse);
      const meta = createPaginationMeta(query.pageNo, query.pageSize, totalElements);
      const response = toUsersResponse(content, meta);
      return response;
    };
    //Сервісний метод для пошуку та валідації користувача по email та password,
    //отриманих від AuthService, для перевірки автентифікації
    this.verifyCredentials = async (email, password) => {
      const user = await this.userRepository.findByEmail(email);
      console.log("Auth user: ", user);
      if (!user) {
        throw new UnauthorizedError("email \u0430\u0431\u043E \u043F\u0430\u0440\u043E\u043B\u044C \u043D\u0435\u0432\u0456\u0440\u043D\u0456");
      }
      const isPasswordValid = await this.hashProvider.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedError("email \u0430\u0431\u043E \u043F\u0430\u0440\u043E\u043B\u044C \u043D\u0435\u0432\u0456\u0440\u043D\u0456");
      }
      const response = toUserResponse(user);
      return response;
    };
    this.create = async (dto) => {
      const passwordHash = await this.hashProvider.hash(dto.password);
      const data = toUserCreateInput({
        ...dto,
        password: passwordHash
      });
      const user = await this.userRepository.create(data);
      const response = toUserFullResponse(user);
      return response;
    };
    this.update = async (id, dto) => {
      const data = toUserUpdateInput(dto);
      const user = await this.userRepository.update(id, data);
      const response = toUserFullResponse(user);
      return response;
    };
    this.delete = async (id) => {
      const user = await this.userRepository.delete(id);
      const response = toUserFullResponse(user);
      return response;
    };
    this.hashProvider = hashProvider;
    this.userRepository = userRepository;
  }
};

// src/modules/user/api/user.controller.ts
var UserController = class {
  constructor({ userService }) {
    this.findById = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const response = await this.userService.findById(id);
      res.json(response);
    };
    this.findFullById = async (req, res) => {
      const tokenPayload = extractTokenPayloadOrThrow(req);
      const response = await this.userService.findFullById(tokenPayload.id);
      res.json(response);
    };
    this.findMany = async (req, res) => {
      const query = extractValidatedQueryOrThrow(req);
      const response = await this.userService.findMany(query);
      res.json(response);
    };
    this.create = async (req, res) => {
      const dto = extractValidatedBodyOrThrow(req);
      const response = await this.userService.create(dto);
      res.json(response);
    };
    this.update = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const dto = extractValidatedBodyOrThrow(req);
      const response = await this.userService.update(id, dto);
      res.json(response);
    };
    this.delete = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const response = await this.userService.delete(id);
      res.json(response);
    };
    this.userService = userService;
  }
};

// src/modules/user/api/user.router.ts
var import_express3 = require("express");
var createUserRouter = ({ userController, authMiddleware }) => {
  const router = (0, import_express3.Router)();
  router.get(
    "/me",
    authMiddleware.authenticate,
    userController.findFullById
  );
  router.get(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ params: userParamsSchema }),
    userController.findById
  );
  router.get(
    "/",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ query: usersQuerySchema }),
    userController.findMany
  );
  router.post(
    "/",
    validate({ body: createUserDtoSchema }),
    userController.create
  );
  router.patch(
    "/:id",
    authMiddleware.authenticate,
    validate({ params: userParamsSchema, body: updateUserDtoSchema }),
    userController.update
  );
  router.delete(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ params: userParamsSchema }),
    userController.delete
  );
  return router;
};

// src/modules/user/user.module.ts
var userModuleDeps = {
  userRepository: (0, import_awilix2.asClass)(UserRepository).singleton(),
  userService: (0, import_awilix2.asClass)(UserService).singleton(),
  userController: (0, import_awilix2.asClass)(UserController).singleton(),
  userRouter: (0, import_awilix2.asFunction)(createUserRouter).singleton()
};

// src/modules/product/api/schemas/product.schema.ts
var import_zod13 = require("zod");

// src/modules/product/api/schemas/pcComponents/processor.schema.ts
var import_zod7 = require("zod");
var PROCESSOR_SOCKETS = ["LGA1700", "LGA1200", "LGA1151", "LGA1150", "LGA1155", "AM5", "AM4", "AM3", "AM2"];
var processorSocketSchema = import_zod7.z.enum(PROCESSOR_SOCKETS);
var NUMBERS_OF_CORES = [2, 4, 6, 8];
var numberOfCoresSchema = import_zod7.z.coerce.number().int().refine((value) => NUMBERS_OF_CORES.includes(value), {
  message: `\u041D\u0435\u043F\u0440\u0438\u043F\u0443\u0441\u0442\u0438\u043C\u0430 \u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u043F\u043E\u0442\u043E\u043A\u0456\u0432. \u041E\u0431\u0435\u0440\u0456\u0442\u044C \u043E\u0434\u043D\u0435 \u0437 \u0434\u043E\u0437\u0432\u043E\u043B\u0435\u043D\u0438\u0445 \u0437\u043D\u0430\u0447\u0435\u043D\u044C: ${NUMBERS_OF_CORES}`
});
var NUMBERS_OF_THREADS = [2, 4, 6, 8, 12, 16];
var numberOfThreadsSchema = import_zod7.z.coerce.number().int().refine((value) => NUMBERS_OF_THREADS.includes(value), {
  error: "\u041D\u0435\u043F\u0440\u0438\u043F\u0443\u0441\u0442\u0438\u043C\u0430 \u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u043F\u043E\u0442\u043E\u043A\u0456\u0432. \u041E\u0431\u0435\u0440\u0456\u0442\u044C \u043E\u0434\u043D\u0435 \u0437 \u0434\u043E\u0437\u0432\u043E\u043B\u0435\u043D\u0438\u0445 \u0437\u043D\u0430\u0447\u0435\u043D\u044C"
});
var processorSchema = import_zod7.z.object({
  //processorProducer: processorProducerSchema,
  processorSocket: processorSocketSchema,
  processorFrequencyGHz: import_zod7.z.number().positive({ error: "\u0427\u0430\u0441\u0442\u043E\u0442\u0430 \u043F\u0440\u043E\u0446\u0435\u0441\u043E\u0440\u0430 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0434\u043E\u0434\u0430\u0442\u043D\u0456\u043C \u0447\u0438\u0441\u043B\u043E\u043C" }),
  numberOfCores: numberOfCoresSchema,
  numberOfThreads: numberOfThreadsSchema,
  l3cacheMB: import_zod7.z.coerce.number().int().positive({ error: "\u041A\u0435\u0448 3-\u0433\u043E \u0440\u0456\u0432\u043D\u044F \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0434\u043E\u0434\u0430\u0442\u043D\u0456\u043C \u0446\u0456\u043B\u0438\u043C \u0447\u0438\u0441\u043B\u043E\u043C" })
});
var processorFiltersSchema = import_zod7.z.object({
  //processorProducer: z.preprocess(arrayPreprocess, z.array(processorProducerSchema)).optional(),
  processorSocket: import_zod7.z.preprocess(arrayPreprocess, import_zod7.z.array(processorSocketSchema)).optional(),
  numberOfCores: import_zod7.z.preprocess(arrayPreprocess, import_zod7.z.array(numberOfCoresSchema)).optional(),
  numberOfThreads: import_zod7.z.preprocess(arrayPreprocess, import_zod7.z.array(numberOfThreadsSchema)).optional()
});

// src/modules/product/api/schemas/pcComponents/memory.schema.ts
var import_zod8 = require("zod");
var MEMORY_TYPES = ["DDR2", "DDR3", "DDR4", "DDR5"];
var memoryTypeSchema = import_zod8.z.enum(MEMORY_TYPES);
var MEMORY_CAPACITIES = [2, 4, 8, 16, 32, 64, 128];
var memoryCapacitySchema = import_zod8.z.coerce.number().int().refine((value) => MEMORY_CAPACITIES.includes(value), {
  error: `\u041E\u0431'\u0454\u043C \u043F\u0430\u043C'\u044F\u0442\u0456 \u043C\u0430\u0454 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0442\u0438 \u0434\u043E\u0437\u0432\u043E\u043B\u0435\u043D\u0438\u043C \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F\u043C: ${MEMORY_CAPACITIES}`
});
var NUMBERS_OF_CHANNELS = [1, 2];
var numberOfChannelsSchema = import_zod8.z.coerce.number().int().refine((value) => NUMBERS_OF_CHANNELS.includes(value), {
  error: `\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u043A\u0430\u043D\u0430\u043B\u0456\u0432 \u043C\u0430\u0454 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0442\u0438 \u0434\u043E\u0437\u0432\u043E\u043B\u0435\u043D\u0438\u043C \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F\u043C: ${NUMBERS_OF_CHANNELS}`
});
var memorySchema = import_zod8.z.object({
  //memoryProducer: memoryProducerSchema,
  memoryType: memoryTypeSchema,
  memoryCapacityGB: memoryCapacitySchema,
  memoryFrequencyGHz: import_zod8.z.number().positive({ error: "\u0427\u0430\u0441\u0442\u043E\u0442\u0430 \u043F\u0430\u043C'\u044F\u0442\u0456 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0434\u043E\u0434\u0430\u0442\u043D\u0456\u043C \u0447\u0438\u0441\u043B\u043E\u043C" }),
  timingScheme: import_zod8.z.string().min(10, { error: "\u0434\u043E\u0432\u0436\u0438\u043D\u0430 \u0441\u0445\u0435\u043C\u0438 \u0442\u0430\u0439\u043C\u0456\u043D\u0433\u0456\u0432 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 10 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432" }),
  numberOfChannels: numberOfChannelsSchema
});
var memoryFiltersSchema = import_zod8.z.object({
  //memoryProducer: z.preprocess(arrayPreprocess, z.array(memoryProducerSchema)).optional(),
  memoryType: import_zod8.z.preprocess(arrayPreprocess, import_zod8.z.array(memoryTypeSchema)).optional(),
  memoryCapacityGB: import_zod8.z.preprocess(arrayPreprocess, import_zod8.z.array(memoryCapacitySchema)).optional(),
  numberOfChannels: import_zod8.z.preprocess(arrayPreprocess, import_zod8.z.array(numberOfChannelsSchema)).optional()
});

// src/modules/product/api/schemas/pcComponents/storage.schema.ts
var import_zod9 = require("zod");
var STORAGE_TYPES = ["HDD", "SSD", "NVME"];
var storageTypeSchema = import_zod9.z.enum(STORAGE_TYPES);
var STORAGE_INTERFACES = ["SATA", "SATA2", "SATA3", "M.2", "PCIE"];
var storageInterfaceSchema = import_zod9.z.enum(STORAGE_INTERFACES);
var storageSchema = import_zod9.z.object({
  //storageProducer: storageProducerSchema,
  storageType: storageTypeSchema,
  storageInterface: storageInterfaceSchema,
  storageCapacityGb: import_zod9.z.coerce.number().int().positive({ error: "\u041E\u0431'\u0454\u043C \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0443\u0432\u0430\u0447\u0430 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0446\u0456\u043B\u0438\u043C \u0434\u043E\u0434\u0430\u0442\u043D\u0456\u043C \u0447\u0438\u0441\u043B\u043E\u043C" }),
  storageCashGb: import_zod9.z.coerce.number().int().positive({ error: "\u041E\u0431'\u0454\u043C \u043A\u0435\u0448\u0443 \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0443\u0432\u0430\u0447\u0430 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0446\u0456\u043B\u0438\u043C \u0434\u043E\u0434\u0430\u0442\u043D\u0456\u043C \u0447\u0438\u0441\u043B\u043E\u043C" }),
  storageSpeedMbPs: import_zod9.z.coerce.number().int().positive({ error: "\u0428\u0432\u0438\u0434\u043A\u0456\u0441\u0442\u044C \u043D\u0430\u043A\u043E\u043F\u0438\u0447\u0443\u0432\u0430\u0447\u0430 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0446\u0456\u043B\u0438\u043C \u0434\u043E\u0434\u0430\u0442\u043D\u0456\u043C \u0447\u0438\u0441\u043B\u043E\u043C" })
});
var storageFiltersSchema = import_zod9.z.object({
  //storageProducer: z.preprocess(arrayPreprocess, z.array(storageProducerSchema)).optional(),
  storageType: import_zod9.z.preprocess(arrayPreprocess, import_zod9.z.array(storageTypeSchema)).optional(),
  storageInterface: import_zod9.z.preprocess(arrayPreprocess, import_zod9.z.array(storageInterfaceSchema)).optional()
});

// src/modules/product/api/schemas/pcComponents/graphic-card.schema.ts
var import_zod10 = require("zod");
var PCIE_TYPES = ["PCIE_2.0", "PCIE_3.0", "PCIE_4.0", "PCIE_5.0"];
var pcieTypeSchema = import_zod10.z.enum(PCIE_TYPES);
var VIDEO_MEMORY_CAPACITIES = [1, 2, 4, 8, 16, 32, 64, 128];
var videoMemoryCapacitySchema = import_zod10.z.coerce.number().int().refine((value) => VIDEO_MEMORY_CAPACITIES.includes(value), {
  error: "\u041D\u0435\u043F\u0440\u0438\u043F\u0443\u0441\u0442\u0438\u043C\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0432\u0456\u0434\u0435\u043E\u043F\u0430\u043C'\u044F\u0442\u0456. \u041E\u0431\u0435\u0440\u0456\u0442\u044C \u043E\u0434\u043D\u0435 \u0437 \u0434\u043E\u0437\u0432\u043E\u043B\u0435\u043D\u0438\u0445 \u0437\u043D\u0430\u0447\u0435\u043D\u044C"
});
var graphicCardSchema = import_zod10.z.object({
  //graphicCardProducer: graphicCardProducerSchema,
  pcieType: pcieTypeSchema,
  GPUClockGHz: import_zod10.z.number().int().positive({ error: "\u0427\u0430\u0441\u0442\u043E\u0442\u0430 GPU \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0446\u0456\u043B\u0438\u043C \u0434\u043E\u0434\u0430\u0442\u043D\u0456\u043C \u0447\u0438\u0441\u043B\u043E\u043C" }),
  videoMemoryClockGHz: import_zod10.z.number().int().positive({ error: "\u0427\u0430\u0441\u0442\u043E\u0442\u0430 \u0432\u0456\u0434\u0435\u043E\u043F\u0430\u043C'\u044F\u0442\u0456 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0446\u0456\u043B\u0438\u043C \u0434\u043E\u0434\u0430\u0442\u043D\u0456\u043C \u0447\u0438\u0441\u043B\u043E\u043C" }),
  videoMemoryCapacityGB: videoMemoryCapacitySchema,
  HDMIExist: import_zod10.z.boolean(),
  DVIExist: import_zod10.z.boolean(),
  rtxSupport: import_zod10.z.boolean()
});
var graphicCardFiltersSchema = import_zod10.z.object({
  //graphicCardProducer: z.preprocess(arrayPreprocess, z.array(graphicCardProducerSchema)).optional(),
  pcieType: import_zod10.z.preprocess(arrayPreprocess, import_zod10.z.array(pcieTypeSchema)).optional(),
  videoMemoryCapacityGB: import_zod10.z.preprocess(arrayPreprocess, import_zod10.z.array(videoMemoryCapacitySchema)).optional()
});

// src/modules/product/api/schemas/pcComponents/motherboard.schema.ts
var import_zod11 = require("zod");
var MOTHERBOARD_TYPES = ["ATX", "MICRO_ATX", "MINI_ATX"];
var motherBoardTypeSchema = import_zod11.z.enum(MOTHERBOARD_TYPES);
var NUMBERS_OF_MEMORY_SLOTS = [2, 4, 8];
var numberOfMEmorySlotsSchema = import_zod11.z.coerce.number().int().refine((value) => NUMBERS_OF_MEMORY_SLOTS.includes(value), {
  error: `\u0427\u0438\u0441\u043B\u043E \u0441\u043B\u043E\u0442\u0456\u0432 \u043F\u0430\u043C'\u044F\u0442\u0456 \u043C\u0430\u0454 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0442\u0438 \u0434\u043E\u0437\u0432\u043E\u043B\u0435\u043D\u0438\u043C \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F\u043C: ${NUMBERS_OF_MEMORY_SLOTS}`
});
var USB_PORT_TYPES = ["2.0", "3.0"];
var usbPortTypeSchema = import_zod11.z.enum(USB_PORT_TYPES);
var motherboardSchema = import_zod11.z.object({
  //motherboardProducer: motherBoardProducerSchema,
  motherboardType: motherBoardTypeSchema,
  processorSocket: processorSocketSchema,
  memoryType: memoryTypeSchema,
  numberOfMemorySlots: numberOfMEmorySlotsSchema,
  pcieType: pcieTypeSchema,
  usbPortType: usbPortTypeSchema,
  numberOfUsbPorts: import_zod11.z.coerce.number().int().positive({ error: "\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u043F\u043E\u0440\u0442\u0456\u0432 usb \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0446\u0456\u043B\u0438\u043C \u0434\u043E\u0434\u0430\u0442\u043D\u0456\u043C \u0447\u0438\u0441\u043B\u043E\u043C" })
});
var motherboardFiltersSchema = import_zod11.z.object({
  //motherboardProducer: z.preprocess(arrayPreprocess, z.array(motherBoardProducerSchema)).optional(),
  motherboardType: import_zod11.z.preprocess(arrayPreprocess, import_zod11.z.array(motherBoardTypeSchema)).optional(),
  processorSocket: import_zod11.z.preprocess(arrayPreprocess, import_zod11.z.array(processorSocketSchema)).optional(),
  memoryType: import_zod11.z.preprocess(arrayPreprocess, import_zod11.z.array(memoryTypeSchema)).optional(),
  numberOfMEmorySlotsSchema: import_zod11.z.preprocess(arrayPreprocess, import_zod11.z.array(numberOfMEmorySlotsSchema)).optional(),
  pcieType: import_zod11.z.preprocess(arrayPreprocess, import_zod11.z.array(pcieTypeSchema)).optional(),
  usbPortsType: import_zod11.z.preprocess(arrayPreprocess, import_zod11.z.array(usbPortTypeSchema)).optional()
});

// src/modules/product/api/schemas/pcComponents/power-supply.schema.ts
var import_zod12 = require("zod");
var POWER_SUPPLY_PLACINGS = ["BELOW", "ABOVE"];
var powerSupplyPlacingSchema = import_zod12.z.enum(POWER_SUPPLY_PLACINGS);
var CERTIFICATION_80_PLUS = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
var certification80PlusSchema = import_zod12.z.enum(CERTIFICATION_80_PLUS);
var powerSupplySchema = import_zod12.z.object({
  //powerSupplyProducer: powerSupplyProducerSchema,
  powerSupplyCapacityW: import_zod12.z.coerce.number().int().positive({ error: "\u041F\u043E\u0442\u0443\u0436\u043D\u0456\u0441\u0442\u044C \u0431\u043B\u043E\u043A\u0430 \u0436\u0438\u0432\u043B\u0435\u043D\u043D\u044F \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0446\u0456\u043B\u0438\u043C \u0434\u043E\u0434\u0430\u0442\u043D\u0456\u043C \u0447\u0438\u0441\u043B\u043E\u043C" }),
  certification80Plus: certification80PlusSchema,
  powerSupplyPlacing: powerSupplyPlacingSchema,
  numberOfSataWires: import_zod12.z.coerce.number().int().nonnegative({ error: "\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u043A\u0430\u0431\u0435\u043B\u0456\u0432 SATA \u043D\u0435 \u043C\u043E\u0436\u0435 \u0431\u0443\u0442\u0438 \u0432\u0456\u0434'\u0454\u043C\u043D\u0438\u043C \u0447\u0438\u0441\u043B\u043E\u043C" }),
  numberOfMolexWires: import_zod12.z.coerce.number().int().nonnegative({ error: "\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u043A\u0430\u0431\u0435\u043B\u0456\u0432 Molex \u043D\u0435 \u043C\u043E\u0436\u0435 \u0431\u0443\u0442\u0438 \u0432\u0456\u0434'\u0454\u043C\u043D\u0438\u043C \u0447\u0438\u0441\u043B\u043E\u043C" }),
  numberOfPcieWires: import_zod12.z.coerce.number().int().nonnegative({ error: "\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u043A\u0430\u0431\u0435\u043B\u0456\u0432 PCIe \u043D\u0435 \u043C\u043E\u0436\u0435 \u0431\u0443\u0442\u0438 \u0432\u0456\u0434'\u0454\u043C\u043D\u0438\u043C \u0447\u0438\u0441\u043B\u043E\u043C" })
});
var powerSupplyFiltersSchema = import_zod12.z.object({
  //powerSupplyProducer: z.preprocess(arrayPreprocess, z.array(powerSupplyProducerSchema)).optional(),
  certification80Plus: import_zod12.z.preprocess(arrayPreprocess, import_zod12.z.array(certification80PlusSchema)).optional(),
  powerSupplyPlacing: import_zod12.z.preprocess(arrayPreprocess, import_zod12.z.array(powerSupplyPlacingSchema)).optional()
});

// src/modules/product/api/schemas/product.schema.ts
var PRODUCT_CATEGORIES = ["PROCESSORS", "MEMORY", "STORAGE", "GRAPHIC_CARDS", "MOTHERBOARDS", "POWER_SUPPLIES"];
var categorySchema = import_zod13.z.enum(PRODUCT_CATEGORIES);
var baseProductSchema = import_zod13.z.object({
  id: import_zod13.z.number().int().positive(),
  productName: import_zod13.z.string(),
  imgUrls: import_zod13.z.array(import_zod13.z.url()),
  price: import_zod13.z.coerce.number().positive(),
  description: import_zod13.z.string(),
  quantity: import_zod13.z.coerce.number().int().nonnegative({ error: "\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0442\u043E\u0432\u0430\u0440\u0443 \u043D\u0435 \u043C\u043E\u0436\u0435 \u0431\u0443\u0442\u0438 \u0432\u0456\u0434'\u0454\u043C\u043D\u0438\u043C \u0447\u0438\u0441\u043B\u043E\u043C" }),
  category: categorySchema,
  producerId: import_zod13.z.coerce.number().int().positive()
});
var baseProductFiltersSchema = import_zod13.z.object({
  minPrice: import_zod13.z.coerce.number().positive().optional(),
  maxPrice: import_zod13.z.coerce.number().positive().optional(),
  category: categorySchema.optional(),
  producerIds: import_zod13.z.preprocess(arrayPreprocess, import_zod13.z.array(import_zod13.z.coerce.number().int().positive())).optional()
});
var productSchema = import_zod13.z.discriminatedUnion("category", [
  baseProductSchema.extend({ category: import_zod13.z.literal(categorySchema.enum.PROCESSORS), details: processorSchema }),
  baseProductSchema.extend({ category: import_zod13.z.literal(categorySchema.enum.MEMORY), details: memorySchema }),
  baseProductSchema.extend({ category: import_zod13.z.literal(categorySchema.enum.STORAGE), details: storageSchema }),
  baseProductSchema.extend({ category: import_zod13.z.literal(categorySchema.enum.GRAPHIC_CARDS), details: graphicCardSchema }),
  baseProductSchema.extend({ category: import_zod13.z.literal(categorySchema.enum.MOTHERBOARDS), details: motherboardSchema }),
  baseProductSchema.extend({ category: import_zod13.z.literal(categorySchema.enum.POWER_SUPPLIES), details: powerSupplySchema })
]);
var productFiltersSchema = baseProductFiltersSchema.extend(processorFiltersSchema.shape).extend(memoryFiltersSchema.shape).extend(storageFiltersSchema.shape).extend(graphicCardFiltersSchema.shape).extend(motherboardFiltersSchema.shape).extend(powerSupplyFiltersSchema.shape);
var productSortTypeSchema = baseProductSchema.pick({ price: true, quantity: true }).keyof().default("price");

// src/modules/product/api/product.dto.ts
var import_zod15 = require("zod");

// src/modules/producer/api/producer.dto.ts
var import_zod14 = require("zod");
var producerSchema = import_zod14.z.object({
  id: import_zod14.z.number().int().positive(),
  name: import_zod14.z.string().min(2, { error: "\u041D\u0430\u0437\u0432\u0430 \u0432\u0438\u0440\u043E\u0431\u043D\u0438\u043A\u0430 \u043C\u0430\u0454 \u043C\u0456\u0441\u0442\u0438\u0442\u0438 \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 2 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432" }),
  logoUrl: import_zod14.z.url().nullable()
});
var baseProducerDtoSchema = producerSchema.omit({ id: true });
var createProducerDtoSchema = baseProducerDtoSchema.extend({
  logoUrl: producerSchema.shape.logoUrl.optional()
});
var updateProducerDtoSchema = baseProducerDtoSchema.partial();
var producerParamsSchema = import_zod14.z.object({
  id: import_zod14.z.coerce.number().int().positive()
});
var producerFiltersSchema = import_zod14.z.object({
  name: import_zod14.z.string().optional()
});
var producerSortTypeSchema = producerSchema.pick({ name: true }).keyof().default("name");
var producersQuerySchema = paginationCriteriaSchema.extend({
  sortType: producerSortTypeSchema
}).extend(producerFiltersSchema.shape);
var producerResponseSchema = producerSchema;
var producersResponseSchema = import_zod14.z.object({
  content: import_zod14.z.array(producerResponseSchema),
  meta: paginationMetaSchema
});

// src/modules/producer/producer.module.ts
var import_awilix3 = require("awilix");

// src/modules/producer/infrastructure/database/producer.repository.ts
var ProducerRepository = class {
  constructor({ dbService }) {
    this.findById = async (id) => {
      const producer = await this.dbService.producer.findUnique({
        where: {
          id
        }
      });
      return producer;
    };
    this.findMany = async (args) => {
      const producers = await this.dbService.producer.findMany(args);
      return producers;
    };
    this.count = async (where) => {
      const count = await this.dbService.producer.count({ where });
      return count;
    };
    this.create = async (data) => {
      const producer = await this.dbService.producer.create({
        data
        //include не потрібен бо producer не потребує реляції products
      });
      return producer;
    };
    this.update = async (id, data) => {
      const producer = await this.dbService.producer.update({
        where: {
          id
        },
        data
        //include не потрібен бо producer не потребує реляції products
      });
      return producer;
    };
    this.delete = async (id) => {
      const producer = await this.dbService.producer.delete({
        where: {
          id
        }
        //include не потрібен бо producer не потребує реляції products
      });
      return producer;
    };
    this.dbService = dbService;
  }
};

// src/modules/producer/api/producer.mapper.ts
var toProducerResponse = (producer) => {
  const transformedProducer = {
    ...producer
  };
  const validatedResponse = producerResponseSchema.parse(transformedProducer);
  return validatedResponse;
};
var toProducersResponse = (content, meta) => {
  const response = {
    content,
    meta
  };
  const validatedResponse = producersResponseSchema.parse(response);
  return validatedResponse;
};

// src/modules/producer/application/producer.mapper.ts
var toProducerWhereInput = (filters) => {
  const where = {
    name: filters.name ? { contains: filters.name, mode: "insensitive" } : void 0
  };
  return where;
};
var toProducerFindManyArgs = (query) => {
  const { pageNo, pageSize, sortType, sortOrder, ...filters } = query;
  const where = toProducerWhereInput(filters);
  const args = {
    where,
    orderBy: {
      [sortType]: sortOrder
    },
    take: pageSize,
    skip: pageNo * pageSize
  };
  return args;
};
var toProducerCreateInput = (dto) => {
  const data = {
    ...dto
  };
  return data;
};
var toProducerUpdateInput = (dto) => {
  const data = {
    ...dto
  };
  return data;
};

// src/modules/producer/application/producer.service.ts
var ProducerService = class {
  constructor({ producerRepository }) {
    this.findById = async (id) => {
      const producer = await this.producerRepository.findById(id);
      if (!producer) {
        throw new NotFoundError(`\u0412\u0438\u0440\u043E\u0431\u043D\u0438\u043A\u0430 \u0437 ID ${id} \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E`);
      }
      const response = toProducerResponse(producer);
      return response;
    };
    this.findMany = async (query) => {
      const args = toProducerFindManyArgs(query);
      const [producers, totalElements] = await Promise.all([
        this.producerRepository.findMany(args),
        this.producerRepository.count(args.where)
      ]);
      const content = producers.map(toProducerResponse);
      const meta = createPaginationMeta(query.pageNo, query.pageSize, totalElements);
      const producersResponse = toProducersResponse(content, meta);
      return producersResponse;
    };
    this.create = async (dto) => {
      const data = toProducerCreateInput(dto);
      const producer = await this.producerRepository.create(data);
      const response = toProducerResponse(producer);
      return response;
    };
    this.update = async (id, dto) => {
      const data = toProducerUpdateInput(dto);
      const producer = await this.producerRepository.update(id, data);
      const response = toProducerResponse(producer);
      return response;
    };
    this.delete = async (id) => {
      const producer = await this.producerRepository.delete(id);
      const response = toProducerResponse(producer);
      return response;
    };
    this.producerRepository = producerRepository;
  }
};

// src/modules/producer/api/producer.controller.ts
var ProducerController = class {
  constructor({ producerService }) {
    this.findById = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const response = await this.producerService.findById(id);
      res.json(response);
    };
    this.findMany = async (req, res) => {
      const query = extractValidatedQueryOrThrow(req);
      const response = await this.producerService.findMany(query);
      res.json(response);
    };
    this.create = async (req, res) => {
      const dto = extractValidatedBodyOrThrow(req);
      const response = await this.producerService.create(dto);
      res.json(response);
    };
    this.update = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const dto = extractValidatedBodyOrThrow(req);
      const response = await this.producerService.update(id, dto);
      res.json(response);
    };
    this.delete = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const response = await this.producerService.delete(id);
      res.json(response);
    };
    this.producerService = producerService;
  }
};

// src/modules/producer/api/producer.router.ts
var import_express4 = require("express");
var createProducerRouter = ({ producerController, authMiddleware }) => {
  const router = (0, import_express4.Router)();
  router.get(
    "/:id",
    authMiddleware.authenticate,
    validate({ params: producerParamsSchema }),
    producerController.findById
  );
  router.get(
    "/",
    authMiddleware.authenticate,
    validate({ query: producersQuerySchema }),
    producerController.findMany
  );
  router.post(
    "/",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ body: createProducerDtoSchema }),
    producerController.create
  );
  router.patch(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ params: producerParamsSchema, body: updateProducerDtoSchema }),
    producerController.update
  );
  router.delete(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ params: producerParamsSchema }),
    producerController.delete
  );
  return router;
};

// src/modules/producer/producer.module.ts
var producerModuleDeps = {
  producerRepository: (0, import_awilix3.asClass)(ProducerRepository).singleton(),
  producerService: (0, import_awilix3.asClass)(ProducerService).singleton(),
  producerController: (0, import_awilix3.asClass)(ProducerController).singleton(),
  producerRouter: (0, import_awilix3.asFunction)(createProducerRouter).singleton()
};

// src/modules/product/api/product.dto.ts
var baseProductDtoSchema = baseProductSchema.omit({ id: true });
var createProductDtoSchema = import_zod15.z.discriminatedUnion("category", [
  baseProductDtoSchema.extend({ category: import_zod15.z.literal(categorySchema.enum.GRAPHIC_CARDS), details: graphicCardSchema }),
  baseProductDtoSchema.extend({ category: import_zod15.z.literal(categorySchema.enum.MEMORY), details: memorySchema }),
  baseProductDtoSchema.extend({ category: import_zod15.z.literal(categorySchema.enum.MOTHERBOARDS), details: motherboardSchema }),
  baseProductDtoSchema.extend({ category: import_zod15.z.literal(categorySchema.enum.POWER_SUPPLIES), details: powerSupplySchema }),
  baseProductDtoSchema.extend({ category: import_zod15.z.literal(categorySchema.enum.PROCESSORS), details: processorSchema }),
  baseProductDtoSchema.extend({ category: import_zod15.z.literal(categorySchema.enum.STORAGE), details: storageSchema })
]);
var updateProductDtoSchema = import_zod15.z.discriminatedUnion("category", [
  baseProductDtoSchema.extend({ details: graphicCardSchema.partial() }).partial().extend({ category: import_zod15.z.literal(categorySchema.enum.GRAPHIC_CARDS) }),
  baseProductDtoSchema.extend({ details: memorySchema.partial() }).partial().extend({ category: import_zod15.z.literal(categorySchema.enum.MEMORY) }),
  baseProductDtoSchema.extend({ details: motherboardSchema.partial() }).partial().extend({ category: import_zod15.z.literal(categorySchema.enum.MOTHERBOARDS) }),
  baseProductDtoSchema.extend({ details: powerSupplySchema.partial() }).partial().extend({ category: import_zod15.z.literal(categorySchema.enum.POWER_SUPPLIES) }),
  baseProductDtoSchema.extend({ details: processorSchema.partial() }).partial().extend({ category: import_zod15.z.literal(categorySchema.enum.PROCESSORS) }),
  baseProductDtoSchema.extend({ details: storageSchema.partial() }).partial().extend({ category: import_zod15.z.literal(categorySchema.enum.STORAGE) })
]);
var productParamsSchema = import_zod15.z.object({
  id: import_zod15.z.coerce.number().int().positive()
});
var productsQuerySchema = paginationCriteriaSchema.extend({
  sortType: productSortTypeSchema
}).extend(productFiltersSchema.shape);
var productResponseSchema = productSchema;
var baseProductFullResponseSchema = baseProductSchema.extend({
  producer: import_zod15.z.lazy(() => producerResponseSchema)
});
var productFullResponseSchema = import_zod15.z.discriminatedUnion("category", [
  baseProductFullResponseSchema.extend({ category: import_zod15.z.literal(categorySchema.enum.PROCESSORS), details: processorSchema }),
  baseProductFullResponseSchema.extend({ category: import_zod15.z.literal(categorySchema.enum.MEMORY), details: memorySchema }),
  baseProductFullResponseSchema.extend({ category: import_zod15.z.literal(categorySchema.enum.STORAGE), details: storageSchema }),
  baseProductFullResponseSchema.extend({ category: import_zod15.z.literal(categorySchema.enum.GRAPHIC_CARDS), details: graphicCardSchema }),
  baseProductFullResponseSchema.extend({ category: import_zod15.z.literal(categorySchema.enum.MOTHERBOARDS), details: motherboardSchema }),
  baseProductFullResponseSchema.extend({ category: import_zod15.z.literal(categorySchema.enum.POWER_SUPPLIES), details: powerSupplySchema })
]);
var productsResponseSchema = import_zod15.z.object({
  content: import_zod15.z.array(productResponseSchema),
  meta: paginationMetaSchema
});

// src/modules/product/product.module.ts
var import_awilix4 = require("awilix");

// src/modules/product/domain/product.entity.ts
var productInclude = {
  producer: true
  //Реляції cartItems та oderItems не потрібні, бо вони лише перевантажувати бд
};

// src/modules/product/infrastructure/database/product.repository.ts
var ProductRepository = class {
  constructor({ dbService }) {
    this.findById = async (id) => {
      const product = await this.dbService.product.findUnique({
        where: {
          id
        }
      });
      return product;
    };
    this.findFullById = async (id) => {
      const product = await this.dbService.product.findUnique({
        where: {
          id
        },
        include: productInclude
      });
      return product;
    };
    this.findMany = async (args) => {
      const products = await this.dbService.product.findMany(args);
      return products;
    };
    this.count = async (where) => {
      const count = await this.dbService.product.count({ where });
      return count;
    };
    this.create = async (data) => {
      const product = await this.dbService.product.create({
        data,
        include: productInclude
      });
      return product;
    };
    this.update = async (id, data) => {
      const product = await this.dbService.product.update({
        where: {
          id
        },
        data,
        include: productInclude
      });
      return product;
    };
    this.delete = async (id) => {
      const product = await this.dbService.product.delete({
        where: {
          id
        },
        include: productInclude
      });
      return product;
    };
    //Метод, для зменшення кількості товару, якщо кількість товару на складі це дозволяє
    this.decreaseQuantityWithCheck = async (id, count, tx) => {
      const client = tx ?? this.dbService;
      const updateResult = await client.product.updateMany({
        where: {
          id,
          quantity: { gte: count }
        },
        data: {
          quantity: { decrement: count }
        }
      });
      const isUpdated = updateResult.count > 0;
      return isUpdated;
    };
    //Метод для збільшення кількості товару, у випадку, якщо під час оформлення замовлення сталася помилка
    this.increaseQuantity = async (id, count, tx) => {
      const client = tx ?? this.dbService;
      const product = await client.product.update({
        where: {
          id
        },
        data: {
          quantity: { increment: count }
        },
        include: productInclude
      });
      return product;
    };
    this.dbService = dbService;
  }
};

// src/modules/product/api/product.mapper.ts
var toProductResponse = (product) => {
  const transformedProduct = {
    ...product
    //додаткові поля, які потребують мапінгу, якщо бізнес тип відрізняється від контракту response
  };
  const response = productResponseSchema.parse(transformedProduct);
  return response;
};
var toProductFullResponse = (product) => {
  const transformedProduct = {
    ...product
    //додаткові поля, які потребують мапінгу, якщо бізнес тип відрізняється від контракту response
  };
  const response = productFullResponseSchema.parse(transformedProduct);
  return response;
};
var toProductsResponse = (content, meta) => {
  const response = {
    content,
    meta
  };
  const validatedResponse = productsResponseSchema.parse(response);
  return validatedResponse;
};

// src/modules/product/application/product.mapper.ts
var toProductWhereInput = (filters) => {
  const {
    minPrice,
    maxPrice,
    category,
    producerIds,
    ...categoryFilters
  } = filters;
  const where = {};
  if (minPrice !== void 0 || maxPrice !== void 0) {
    where.price = {
      gte: minPrice,
      lte: maxPrice
    };
  }
  if (producerIds?.length) {
    where.producerId = { in: producerIds };
  }
  if (category) {
    where.category = category;
  } else {
    return where;
  }
  const activeEntries = Object.entries(categoryFilters).filter(([_, value]) => value !== void 0);
  if (activeEntries.length) {
    where.AND = activeEntries.map(([key, value]) => {
      if (Array.isArray(value)) {
        return {
          OR: value.map((val) => ({
            details: {
              //Значення path обовязково має бути масивом (хоча ts і не викидає помилку, якщо це не масив),
              //де міститься перелік полів різного рівня вкладеності в json
              path: [key],
              equals: val
              // Тепер порівнюємо з кожним числом окремо
            }
          }))
        };
      }
      return {
        details: {
          //Значення path обовязково має бути масивом (хоча ts і не викидає помилку, якщо це не масив),
          //де міститься перелік полів різного рівня вкладеності в json
          path: [key],
          equals: value
        }
      };
    });
  }
  return where;
};
var toProductFindManyArgs = (query) => {
  const {
    sortType,
    sortOrder,
    pageNo,
    pageSize,
    ...filters
  } = query;
  const where = toProductWhereInput(filters);
  const args = {
    where,
    orderBy: {
      [sortType]: sortOrder
    },
    take: pageSize,
    skip: pageNo * pageSize
  };
  return args;
};
var toProductCreateInput = (dto) => {
  const { producerId, ...rest } = dto;
  const data = {
    ...rest,
    //Вказуєм поле producer, щоб звязати product з producer
    //Як варіант можна взагалі не вказувати producer, натомість вказати producerId
    producer: {
      connect: { id: producerId }
    }
  };
  return data;
};
var toProductUpdateInput = (dto) => {
  const { producerId, ...rest } = dto;
  const data = {
    ...rest,
    //Якщо producerId було змінено, то вказуєм це в полі producer. Якщо ні, то залишаєм undefined
    //Як варіант можна взагалі не вказувати producer, натомість вказати producerId
    producer: producerId ? { connect: { id: producerId } } : void 0
  };
  return data;
};

// src/modules/product/application/product.service.ts
var ProductService = class {
  constructor({ productRepository }) {
    this.findById = async (id) => {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new NotFoundError(`\u0422\u043E\u0432\u0430\u0440 \u0437 ID ${id} \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E`);
      }
      const response = toProductResponse(product);
      return response;
    };
    this.findFullById = async (id) => {
      const product = await this.productRepository.findFullById(id);
      if (!product) {
        throw new NotFoundError(`\u0422\u043E\u0432\u0430\u0440 \u0437 ID ${id} \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E`);
      }
      const response = toProductFullResponse(product);
      return response;
    };
    this.findMany = async (query) => {
      const args = toProductFindManyArgs(query);
      const [products, totalElements] = await Promise.all([
        this.productRepository.findMany(args),
        this.productRepository.count(args.where)
      ]);
      const content = products.map(toProductResponse);
      const meta = createPaginationMeta(query.pageNo, query.pageSize, totalElements);
      const response = toProductsResponse(content, meta);
      return response;
    };
    this.create = async (dto) => {
      const data = toProductCreateInput(dto);
      const product = await this.productRepository.create(data);
      const response = toProductFullResponse(product);
      return response;
    };
    this.update = async (id, dto) => {
      let finalDto = { ...dto };
      if (dto.details) {
        const existingProduct = await this.findById(id);
        finalDto.details = {
          ...existingProduct.details,
          ...dto.details
        };
      }
      const data = toProductUpdateInput(finalDto);
      const product = await this.productRepository.update(id, data);
      const response = toProductFullResponse(product);
      return response;
    };
    this.delete = async (id) => {
      const product = await this.productRepository.delete(id);
      const response = toProductFullResponse(product);
      return response;
    };
    //Метод для зменшення кількості товару (списання). Використовується під час оформлення замовлення
    this.decreaseQuantity = async (id, count, tx) => {
      const isUpdated = await this.productRepository.decreaseQuantityWithCheck(id, count, tx);
      if (!isUpdated) {
        throw new BadRequestError(`\u041D\u0435\u043C\u043E\u0436\u043B\u0438\u0432\u043E \u0441\u043F\u0438\u0441\u0430\u0442\u0438 \u0442\u043E\u0432\u0430\u0440 \u0437 ID ${id}: \u043D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043D\u044C\u043E \u043D\u0430 \u0441\u043A\u043B\u0430\u0434\u0456`);
      }
    };
    //Метод для відкату списання товару, у випадку, якщо замовлення скасовується і потрібно повернути товар з замовлення, оновивши його кількість в product
    this.increaseQuantity = async (id, count, tx) => {
      const product = await this.productRepository.increaseQuantity(id, count, tx);
      const response = toProductFullResponse(product);
      return response;
    };
    this.productRepository = productRepository;
  }
};

// src/modules/product/api/product.controller.ts
var ProductController = class {
  constructor({ productService }) {
    this.findById = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const response = await this.productService.findById(id);
      res.json(response);
    };
    this.findFullById = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const response = await this.productService.findFullById(id);
      res.json(response);
    };
    this.findMany = async (req, res) => {
      const query = extractValidatedQueryOrThrow(req);
      const response = await this.productService.findMany(query);
      res.json(response);
    };
    this.create = async (req, res) => {
      const dto = extractValidatedBodyOrThrow(req);
      const response = await this.productService.create(dto);
      res.json(response);
    };
    this.update = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const dto = extractValidatedBodyOrThrow(req);
      const response = await this.productService.update(id, dto);
      res.json(response);
    };
    this.delete = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const response = await this.productService.delete(id);
      res.json(response);
    };
    this.productService = productService;
  }
};

// src/modules/product/api/product.router.ts
var import_express5 = require("express");
var createProductRouter = ({ productController, authMiddleware }) => {
  const router = (0, import_express5.Router)();
  router.get(
    "/:id/full",
    authMiddleware.authenticate,
    validate({ params: productParamsSchema }),
    productController.findFullById
  );
  router.get(
    "/:id",
    authMiddleware.authenticate,
    validate({ params: productParamsSchema }),
    productController.findById
  );
  router.get(
    "/",
    authMiddleware.authenticate,
    validate({ query: productsQuerySchema }),
    productController.findMany
  );
  router.post(
    "/",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ body: createProductDtoSchema }),
    productController.create
  );
  router.patch(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ params: productParamsSchema, body: updateProductDtoSchema }),
    productController.update
  );
  router.delete(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ params: productParamsSchema }),
    productController.delete
  );
  return router;
};

// src/modules/product/product.module.ts
var productModuleDeps = {
  productRepository: (0, import_awilix4.asClass)(ProductRepository).singleton(),
  productService: (0, import_awilix4.asClass)(ProductService).singleton(),
  productController: (0, import_awilix4.asClass)(ProductController).singleton(),
  productRouter: (0, import_awilix4.asFunction)(createProductRouter).singleton()
};

// src/modules/cart/cart.module.ts
var import_awilix5 = require("awilix");

// src/modules/cart/domain/cart.entity.ts
var cartInclude = {
  //реляція user для cart, зазвичай не потрібна, а якщо раптом знадобиться то user можна отримати через id cart, або з tokenPayload
  //реляція items для cart повинна підтягувати власну реляцію product. Це критично важливо для фронтенда
  items: {
    include: {
      product: true
    }
  }
};

// src/modules/cart/infrastructure/database/cart.repository.ts
var CartRepository = class {
  constructor({ dbService }) {
    this.findCartFullByUserId = async (userId) => {
      const cart = await this.dbService.cart.findUnique({
        where: {
          id: userId
        },
        include: cartInclude
      });
      return cart;
    };
    this.createItem = async (userId, productId, quantity) => {
      const cart = await this.dbService.cart.update({
        where: { id: userId },
        data: {
          items: {
            upsert: {
              //Для перевірки унікальності CartItem нам потрібен саме обєкт cartId_productId, який генерує prisma, відповідно до схеми
              where: { cartId_productId: { cartId: userId, productId } },
              update: { quantity: { increment: quantity } },
              create: { quantity, productId }
              // cartId Prisma підставить сама
            }
          }
        },
        include: cartInclude
      });
      return cart;
    };
    this.updateItemQuantity = async (userId, productId, quantity) => {
      const cart = await this.dbService.cart.update({
        where: { id: userId },
        data: {
          items: {
            update: {
              //Для апдейта нам достатньо cartId_productId, тому знати id CartItem не потрібно
              where: { cartId_productId: { cartId: userId, productId } },
              data: { quantity }
            }
          }
        },
        include: cartInclude
      });
      return cart;
    };
    this.deleteItem = async (userId, productId) => {
      const cart = await this.dbService.cart.update({
        where: { id: userId },
        data: {
          items: {
            delete: {
              //поле delete потребує безпосередньо унікального ідентифікатора, тому cartId_productId вказуємо напряму, без where
              cartId_productId: { cartId: userId, productId }
            }
          }
        },
        include: cartInclude
      });
      return cart;
    };
    this.clearCart = async (userId, tx) => {
      const client = tx ?? this.dbService;
      await client.cart.update({
        where: { id: userId },
        data: {
          items: {
            deleteMany: {}
          }
        }
        //include не потрібен, бо результат, що повертається нас не цікавить
      });
    };
    this.dbService = dbService;
  }
};

// src/modules/cart/api/cart.dto.ts
var import_zod16 = require("zod");
var cartSchema = import_zod16.z.object({
  id: import_zod16.z.number().int().positive()
});
var cartItemSchema = import_zod16.z.object({
  id: import_zod16.z.number().int().positive(),
  quantity: import_zod16.z.coerce.number().int().min(1, "\u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0442\u043E\u0432\u0430\u0440\u0443 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 1"),
  cartId: import_zod16.z.coerce.number().int().positive("ID \u043A\u043E\u0448\u0438\u043A\u0430 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043F\u043E\u0437\u0438\u0442\u0438\u0432\u043D\u0438\u043C \u0447\u0438\u0441\u043B\u043E\u043C"),
  productId: import_zod16.z.coerce.number().int().positive("ID \u0442\u043E\u0432\u0430\u0440\u0443 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043F\u043E\u0437\u0438\u0442\u0438\u0432\u043D\u0438\u043C \u0447\u0438\u0441\u043B\u043E\u043C")
});
var createCartItemDtoSchema = cartItemSchema.pick({ productId: true, quantity: true });
var updateCartItemQuantityDtoSchema = cartItemSchema.pick({ quantity: true });
var cartItemParamsSchema = import_zod16.z.object({
  productId: import_zod16.z.coerce.number().int().positive()
});
var cartItemFullResponseSchema = cartItemSchema.extend({
  product: productResponseSchema
});
var cartFullResponseSchema = cartSchema.extend({
  items: import_zod16.z.array(cartItemFullResponseSchema)
});

// src/modules/cart/api/cart.mapper.ts
var toCartFullResponse = (cart) => {
  const transformedCart = {
    ...cart
  };
  const response = cartFullResponseSchema.parse(transformedCart);
  return response;
};

// src/modules/cart/application/cart.service.ts
var CartService = class {
  constructor({ cartRepository }) {
    this.findCartFullByUserId = async (userId) => {
      const cart = await this.cartRepository.findCartFullByUserId(userId);
      if (!cart) {
        throw new NotFoundError(`\u041A\u043E\u0448\u0438\u043A \u0434\u043B\u044F \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u0437 ID ${userId} \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E`);
      }
      const response = toCartFullResponse(cart);
      return response;
    };
    this.createItem = //При створенні CartItem productId передається через dto
    async (userId, dto) => {
      const cart = await this.cartRepository.createItem(userId, dto.productId, dto.quantity);
      const response = toCartFullResponse(cart);
      return response;
    };
    this.updateItemQuantity = //При оновленні CartItem productId береться з параметру url і передається як окремий аргумент. dto містить лише quantity
    async (userId, productId, dto) => {
      const cart = await this.cartRepository.updateItemQuantity(userId, productId, dto.quantity);
      const response = toCartFullResponse(cart);
      return response;
    };
    this.deleteItem = async (userId, productId) => {
      const cart = await this.cartRepository.deleteItem(userId, productId);
      const response = toCartFullResponse(cart);
      return response;
    };
    this.clearCart = async (userId, tx) => {
      await this.cartRepository.clearCart(userId, tx);
    };
    this.cartRepository = cartRepository;
  }
};

// src/modules/cart/api/cart.controller.ts
var CartController = class {
  constructor({ cartService, productService }) {
    this.findMyCartFullByUserId = async (req, res) => {
      const { id } = extractTokenPayloadOrThrow(req);
      const response = await this.cartService.findCartFullByUserId(id);
      res.json(response);
    };
    this.createItem = async (req, res) => {
      const { id } = extractTokenPayloadOrThrow(req);
      const dto = extractValidatedBodyOrThrow(req);
      await this.productService.findById(dto.productId);
      const response = await this.cartService.createItem(id, dto);
      res.json(response);
    };
    this.updateItemQuantity = async (req, res) => {
      const { id } = extractTokenPayloadOrThrow(req);
      const { productId } = extractValidatedParamsOrThrow(req);
      const dto = extractValidatedBodyOrThrow(req);
      await this.productService.findById(productId);
      const response = await this.cartService.updateItemQuantity(id, productId, dto);
      res.json(response);
    };
    this.deleteItem = async (req, res) => {
      const { id } = extractTokenPayloadOrThrow(req);
      const { productId } = extractValidatedParamsOrThrow(req);
      const response = await this.cartService.deleteItem(id, productId);
      res.json(response);
    };
    this.clearCart = async (req, res) => {
      const { id } = extractTokenPayloadOrThrow(req);
      await this.cartService.clearCart(id);
      res.status(200);
    };
    this.cartService = cartService;
    this.productService = productService;
  }
};

// src/modules/cart/api/cart.router.ts
var import_express6 = require("express");
var createCartRouter = ({ authMiddleware, cartController }) => {
  const router = (0, import_express6.Router)();
  router.get(
    "/",
    authMiddleware.authenticate,
    cartController.findMyCartFullByUserId
  );
  router.post(
    "/items",
    authMiddleware.authenticate,
    validate({ body: createCartItemDtoSchema }),
    cartController.createItem
  );
  router.patch(
    "/items/:productId",
    authMiddleware.authenticate,
    validate({ params: cartItemParamsSchema, body: updateCartItemQuantityDtoSchema }),
    cartController.updateItemQuantity
  );
  router.delete(
    "/items/:productId",
    authMiddleware.authenticate,
    validate({ params: cartItemParamsSchema }),
    cartController.deleteItem
  );
  router.delete(
    "/items",
    authMiddleware.authenticate,
    cartController.clearCart
  );
  return router;
};

// src/modules/cart/cart.module.ts
var cartModuleDeps = {
  cartRepository: (0, import_awilix5.asClass)(CartRepository).singleton(),
  cartService: (0, import_awilix5.asClass)(CartService).singleton(),
  cartController: (0, import_awilix5.asClass)(CartController).singleton(),
  cartRouter: (0, import_awilix5.asFunction)(createCartRouter).singleton()
};

// src/modules/order/order.module.ts
var import_awilix6 = require("awilix");

// src/modules/order/api/order.dto.ts
var import_zod19 = require("zod");

// src/modules/payment/api/payment.dto.ts
var import_zod17 = require("zod");
var PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];
var paymentStatusSchema = import_zod17.z.enum(PAYMENT_STATUSES);
var PAYMENT_METHODS = ["CARD", "CASH"];
var paymentMethodSchema = import_zod17.z.enum(PAYMENT_METHODS);
var PAYMENT_PROVIDERS = ["MONOBANK", "LIQPAY", "INTERNAL"];
var paymentProviderSchema = import_zod17.z.enum(PAYMENT_PROVIDERS);
var paymentSchema = import_zod17.z.object({
  id: import_zod17.z.number().int().positive(),
  status: paymentStatusSchema.default("PENDING"),
  method: paymentMethodSchema,
  amount: import_zod17.z.coerce.number().positive(),
  provider: paymentProviderSchema,
  externalId: import_zod17.z.string().nullable(),
  orderId: import_zod17.z.number().int().positive()
});
var createPaymentDtoSchema = paymentSchema.pick({ method: true });
var monobankWebhookDtoSchema = import_zod17.z.object({
  invoiceId: import_zod17.z.string(),
  status: import_zod17.z.string()
});
var paymentResponseSchema = paymentSchema;
var createInvoiceResponseSchema = import_zod17.z.object({
  payment: paymentResponseSchema,
  paymentUrl: import_zod17.z.url()
});

// src/modules/delivery/api/delivery.dto.ts
var import_zod18 = require("zod");
var DELIVERY_METHODS = ["NOVA_POSHTA", "UKRPOSHTA", "COURIER"];
var deliveryMethodSchema = import_zod18.z.enum(DELIVERY_METHODS);
var baseDeliverySchema = import_zod18.z.object({
  id: import_zod18.z.number().int().positive(),
  method: deliveryMethodSchema,
  price: import_zod18.z.coerce.number().nonnegative().default(0),
  trackingNumber: import_zod18.z.string().nullable(),
  details: import_zod18.z.any(),
  //Це поле має тип json в бд, тому його потрібно буде розширити через discriminatedUnion
  orderId: import_zod18.z.number().int().positive()
});
var baseDeliveryDetailsSchema = import_zod18.z.object({
  city: import_zod18.z.string().min(2, { error: "\u041D\u0430\u0437\u0432\u0430 \u043C\u0456\u0441\u0442\u0430 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 2 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432" }),
  phone: import_zod18.z.string().length(17, { error: "\u0414\u043E\u0432\u0436\u0438\u043D\u0430 \u043D\u043E\u043C\u0435\u0440\u0443 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 17 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432" }).regex(/^\+38\(0\d{2}\)\d{3}-\d{2}-\d{2}$/, { error: "\u0424\u043E\u0440\u043C\u0430\u0442: +38(0XX)XXX-XX-XX" }),
  fullName: import_zod18.z.string().min(5, { error: "\u0412\u043A\u0430\u0436\u0456\u0442\u044C \u043F\u043E\u0432\u043D\u0435 \u041F\u0406\u0411 \u043E\u0442\u0440\u0438\u043C\u0443\u0432\u0430\u0447\u0430 (\u043C\u0456\u043D\u0456\u043C\u0443\u043C 5 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432)" })
});
var warehouseDetailsSchema = baseDeliveryDetailsSchema.extend({
  warehouse: import_zod18.z.string().min(1, { error: "\u041D\u043E\u043C\u0435\u0440 \u0442\u0430 \u0430\u0434\u0440\u0435\u0441\u0430 \u0432\u0456\u0434\u0434\u0456\u043B\u0435\u043D\u043D\u044F \u043C\u0430\u0454 \u0441\u043A\u043B\u0430\u0434\u0430\u0442\u0438\u0441\u044C \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 \u043D\u0456\u0436 \u0437 \u043E\u0434\u043D\u043E\u0433\u043E \u0441\u0438\u043C\u0432\u043E\u043B\u0443" })
});
var courierDetailsSchema = baseDeliveryDetailsSchema.extend({
  street: import_zod18.z.string().min(2, { error: "\u041D\u0430\u0437\u0432\u0430 \u0432\u0443\u043B\u0438\u0446\u0456 \u043C\u0430\u0454 \u043C\u0456\u0441\u0442\u0438\u0442\u0438 \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 \u0434\u0432\u043E\u0445 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432" }),
  houseNumber: import_zod18.z.coerce.number().int().positive()
});
var deliverySchema = import_zod18.z.discriminatedUnion("method", [
  baseDeliverySchema.extend({
    method: import_zod18.z.enum([deliveryMethodSchema.enum.NOVA_POSHTA, deliveryMethodSchema.enum.UKRPOSHTA]),
    details: warehouseDetailsSchema
  }),
  baseDeliverySchema.extend({
    method: import_zod18.z.literal(deliveryMethodSchema.enum.COURIER),
    details: courierDetailsSchema
  })
]);
var createDeliveryDtoSchema = import_zod18.z.discriminatedUnion("method", [
  import_zod18.z.object({
    method: import_zod18.z.enum([deliveryMethodSchema.enum.NOVA_POSHTA, deliveryMethodSchema.enum.UKRPOSHTA]),
    details: warehouseDetailsSchema
  }),
  import_zod18.z.object({
    method: import_zod18.z.literal(deliveryMethodSchema.enum.COURIER),
    details: courierDetailsSchema
  })
]);
var deliveryResponseSchema = deliverySchema;

// src/modules/order/api/order.dto.ts
var ORDER_STATUSES = ["PENDING", "PAID", "DELIVERING", "COMPLETED", "CANCELLED"];
var orderStatusSchema = import_zod19.z.enum(ORDER_STATUSES);
var orderSchema = import_zod19.z.object({
  id: import_zod19.z.number().int().positive(),
  status: orderStatusSchema,
  totalAmount: import_zod19.z.coerce.number().positive(),
  userId: import_zod19.z.coerce.number().int().positive()
});
var orderItemSchema = import_zod19.z.object({
  id: import_zod19.z.number().int().positive(),
  quantity: import_zod19.z.coerce.number().int().positive(),
  price: import_zod19.z.coerce.number().positive(),
  productId: import_zod19.z.coerce.number().int().positive(),
  orderId: import_zod19.z.coerce.number().int().positive()
});
var createOrderDtoSchema = import_zod19.z.object({
  payment: createPaymentDtoSchema,
  delivery: createDeliveryDtoSchema
});
var orderParamsSchema = import_zod19.z.object({
  id: import_zod19.z.coerce.number().int().positive()
});
var orderFiltersSchema = import_zod19.z.object({
  status: orderStatusSchema.optional()
});
var orderSortTypeSchema = orderSchema.pick({ id: true, totalAmount: true }).keyof().default("id");
var ordersQuerySchema = paginationCriteriaSchema.extend({
  sortType: orderSortTypeSchema
}).extend(orderFiltersSchema.shape);
var setTrackingNumberDtoSchema = import_zod19.z.object({
  trackingNumber: import_zod19.z.string().min(1, "\u041D\u043E\u043C\u0435\u0440 \u0422\u0422\u041D \u043D\u0435 \u043C\u043E\u0436\u0435 \u0431\u0443\u0442\u0438 \u043F\u043E\u0440\u043E\u0436\u043D\u0456\u043C")
});
var orderItemFullResponseSchema = orderItemSchema.extend({
  product: productResponseSchema
});
var orderFullResponseSchema = orderSchema.extend({
  items: import_zod19.z.array(orderItemFullResponseSchema),
  payment: paymentResponseSchema,
  delivery: deliveryResponseSchema
});
var checkoutResponseSchema = import_zod19.z.object({
  order: orderFullResponseSchema,
  paymentUrl: import_zod19.z.url().nullable()
});
var retryPaymentResponseSchema = import_zod19.z.object({
  paymentUrl: import_zod19.z.url()
});
var ordersResponseSchema = import_zod19.z.object({
  content: import_zod19.z.array(orderFullResponseSchema),
  meta: paginationMetaSchema
});

// src/modules/order/api/order.mapper.ts
var toOrderFullResponse = (order) => {
  const transformedOrder = {
    ...order
  };
  const response = orderFullResponseSchema.parse(transformedOrder);
  return response;
};
var toOrdersResponse = (content, meta) => {
  const response = {
    content,
    meta
  };
  const validatedResponse = ordersResponseSchema.parse(response);
  return validatedResponse;
};

// src/modules/order/domain/order.entity.ts
var orderInclude = {
  items: {
    include: {
      product: true
    }
  },
  payment: true,
  delivery: true
};

// src/modules/payment/application/payment.mapper.ts
var toPaymentCreateWithoutOrderInput = (totalAmount, dto) => {
  const data = {
    amount: totalAmount,
    status: "PENDING",
    method: dto.method,
    provider: dto.method === "CARD" ? "MONOBANK" : "INTERNAL"
  };
  return data;
};

// src/modules/delivery/application/delivery.mapper.ts
var toDeliveryCreateWithoutOrderInput = (totalAmount, dto) => {
  let price = 0;
  if (dto.method === "COURIER" && totalAmount < 1e3) {
    price = 100;
  }
  const data = {
    method: dto.method,
    details: dto.details,
    price
  };
  return data;
};

// src/modules/order/application/order.mapper.ts
var toOrderWhereInput = (filters, userId) => {
  const where = {
    status: filters.status,
    userId
  };
  return where;
};
var toOrderFindManyArgs = (query, userId) => {
  const { pageNo, pageSize, sortType, sortOrder, ...filters } = query;
  const where = toOrderWhereInput(filters, userId);
  const args = {
    where,
    orderBy: {
      [sortType]: sortOrder
    },
    take: pageSize,
    skip: pageNo * pageSize,
    //Обовязково вказуєм include. Order має бути з items
    include: orderInclude
  };
  return args;
};
var toOrderCreateInput = (userId, totalAmount, orderItems, dto) => {
  const data = {
    status: "PENDING",
    totalAmount,
    items: {
      create: orderItems
    },
    user: {
      connect: { id: userId }
    },
    payment: {
      create: toPaymentCreateWithoutOrderInput(totalAmount, dto.payment)
    },
    delivery: {
      create: toDeliveryCreateWithoutOrderInput(totalAmount, dto.delivery)
    }
  };
  return data;
};

// src/modules/order/application/order.service.ts
var OrderService = class {
  constructor(dependencies) {
    this.findMyFullById = async (userId, id) => {
      const order = await this.deps.orderRepository.findFullById(id);
      if (!order) {
        throw new NotFoundError(`\u0417\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0437 ID ${id} \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E`);
      }
      if (order.userId !== userId) {
        throw new ForbiddenError(`\u0417\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0437 ID ${id} \u043D\u0435 \u043D\u0430\u043B\u0435\u0436\u0438\u0442\u044C \u043F\u043E\u0442\u043E\u0447\u043D\u043E\u043C\u0443 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0443`);
      }
      const response = toOrderFullResponse(order);
      return response;
    };
    this.findFullById = async (id) => {
      const order = await this.deps.orderRepository.findFullById(id);
      if (!order) {
        throw new NotFoundError(`\u0417\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0437 ID ${id} \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E`);
      }
      const response = toOrderFullResponse(order);
      return response;
    };
    this.findMyMany = async (userId, query) => {
      const args = toOrderFindManyArgs(query, userId);
      const [orders, totalElements] = await Promise.all([
        this.deps.orderRepository.findMany(args),
        //where дістаємо з args, щоб фільтри для findMany та count були синхронізовані
        this.deps.orderRepository.count(args.where)
      ]);
      const content = orders.map(toOrderFullResponse);
      const meta = createPaginationMeta(query.pageNo, query.pageSize, totalElements);
      const ordersResponse = toOrdersResponse(content, meta);
      return ordersResponse;
    };
    this.findMany = async (query) => {
      const args = toOrderFindManyArgs(query);
      const [orders, totalElements] = await Promise.all([
        this.deps.orderRepository.findMany(args),
        //where дістаємо з args, щоб фільтри для findMany та count були синхронізовані
        this.deps.orderRepository.count(args.where)
      ]);
      const content = orders.map(toOrderFullResponse);
      const meta = createPaginationMeta(query.pageNo, query.pageSize, totalElements);
      const ordersResponse = toOrdersResponse(content, meta);
      return ordersResponse;
    };
    this.create = async (userId, dto) => {
      const cart = await this.deps.cartService.findCartFullByUserId(userId);
      if (!cart.items.length) {
        throw new BadRequestError("\u041D\u0435\u043C\u043E\u0436\u043B\u0438\u0432\u043E \u0441\u0442\u0432\u043E\u0440\u0438\u0442\u0438 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F: \u043A\u043E\u0448\u0438\u043A \u043F\u043E\u0440\u043E\u0436\u043D\u0456\u0439");
      }
      const { totalAmount, orderItems } = this.prepareOrderDetails(cart);
      const data = toOrderCreateInput(userId, totalAmount, orderItems, dto);
      const orderFullEntity = await this.executeOrderCreationTransaction(userId, cart.items, data);
      const orderFullResponse = toOrderFullResponse(orderFullEntity);
      let paymentUrl = null;
      try {
        paymentUrl = await this.initiateOrderPayment(orderFullResponse);
      } catch (error) {
        if (error instanceof BadGatewayError) {
          console.error(`[BANK_DOWN] \u041C\u043E\u043D\u043E\u0431\u0430\u043D\u043A \u043D\u0435 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0432 \u0434\u043B\u044F \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F ${orderFullResponse.id}`);
        } else if (!(error instanceof BadRequestError)) {
          console.error(`[CRITICAL_DATABASE_ERROR] \u0406\u043D\u0432\u043E\u0439\u0441 \u0432 \u0431\u0430\u043D\u043A\u0443 \u0441\u0442\u0432\u043E\u0440\u0435\u043D\u043E, \u0430\u043B\u0435 \u043D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u043E\u043D\u043E\u0432\u0438\u0442\u0438 externalId \u0434\u043B\u044F \u043F\u043B\u0430\u0442\u0435\u0436\u0443 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F ${orderFullResponse.id}. \u041F\u043E\u043C\u0438\u043B\u043A\u0430:`, error);
        }
      }
      const response = {
        order: orderFullResponse,
        paymentUrl
      };
      return response;
    };
    //Метод для повторної спроби генерації інвойсу (для користувача). Використовується для випадків, коли це не вдалось під час створення замовлення
    this.retryPayment = async (orderId, userId) => {
      const order = await this.findMyFullById(userId, orderId);
      try {
        const paymentUrl = await this.initiateOrderPayment(order);
        const retryPaymentResponse = {
          paymentUrl
        };
        return retryPaymentResponse;
      } catch (error) {
        if (error instanceof BadGatewayError) {
          console.error(`[BANK_DOWN] \u041C\u043E\u043D\u043E\u0431\u0430\u043D\u043A \u043D\u0435 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0432 \u043F\u0456\u0434 \u0447\u0430\u0441 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E\u0457 \u043E\u043F\u043B\u0430\u0442\u0438 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F ${order.id}`);
        } else if (!(error instanceof BadRequestError)) {
          console.error(`[CRITICAL_DATABASE_ERROR] \u041F\u0456\u0434 \u0447\u0430\u0441 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E\u0457 \u043E\u043F\u043B\u0430\u0442\u0438 \u0456\u043D\u0432\u043E\u0439\u0441 \u0441\u0442\u0432\u043E\u0440\u0435\u043D\u043E, \u0430\u043B\u0435 \u043D\u0435 \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u043E externalId \u0434\u043B\u044F \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F ${order.id}. \u041F\u043E\u043C\u0438\u043B\u043A\u0430:`, error);
        }
        throw error;
      }
    };
    // Додавання номеру декларації для payment та відповідна зміна статусу замовлення на DELIVERING (метод для адмінів)
    this.setTrackingNumber = async (id, trackingNumber) => {
      const { delivery, payment } = await this.findFullById(id);
      return await this.deps.dbService.$transaction(async (tx) => {
        if (payment.method === "CARD" && payment.status !== "PAID") {
          throw new BadRequestError(`\u041D\u0435\u043C\u043E\u0436\u043B\u0438\u0432\u043E \u0437\u0434\u0456\u0439\u0441\u043D\u0438\u0442\u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0443 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u043F\u0440\u0438 \u043E\u043F\u043B\u0430\u0442\u0456 \u043A\u0430\u0440\u0442\u043E\u044E, \u044F\u043A\u0449\u043E \u0432\u043E\u043D\u043E \u043D\u0435 \u043E\u043F\u043B\u0430\u0447\u0435\u043D\u0435. \u0421\u0442\u0430\u0442\u0443\u0441 \u043E\u043F\u043B\u0430\u0442\u0438 ${payment.status}`);
        }
        await this.deps.deliveryService.updateTrackingNumber(delivery.id, trackingNumber, tx);
        const data = { status: "DELIVERING" };
        const updatedOrder = await this.deps.orderRepository.update(id, data, tx);
        const response = toOrderFullResponse(updatedOrder);
        return response;
      });
    };
    //Онвлення статусу замовлення (для вебхуку монобанку в PaymentService)
    this.updateStatusToPaid = async (id) => {
      const { payment, status } = await this.findFullById(id);
      if (status !== "PENDING") {
        throw new BadRequestError(`\u041D\u0435\u043C\u043E\u0436\u043B\u0438\u0432\u043E \u043E\u043F\u043B\u0430\u0442\u0438\u0442\u0438 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0432 \u0441\u0442\u0430\u0442\u0443\u0441\u0456 ${status}`);
      }
      if (payment.status !== "PAID") {
        throw new BadRequestError(`\u041D\u0435\u043C\u043E\u0436\u043B\u0438\u0432\u043E \u043F\u0435\u0440\u0435\u0432\u0435\u0441\u0442\u0438 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0432 \u0441\u0442\u0430\u0442\u0443\u0441 PAID, \u043E\u0441\u043A\u0456\u043B\u044C\u043A\u0438 \u043F\u043B\u0430\u0442\u0456\u0436 \u0443 \u0431\u0430\u043D\u043A\u0443 \u043D\u0435 \u043F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0436\u0435\u043D\u043E!`);
      }
      const data = { status: "PAID" };
      const order = await this.deps.orderRepository.update(id, data);
      const response = toOrderFullResponse(order);
      return response;
    };
    //Метод для адмінів. Виконує зміну статусу на "COMPLETED", коли користувач отримав замовлення
    this.updateStatusToCompleted = async (id) => {
      const { status } = await this.findFullById(id);
      if (status !== "DELIVERING") {
        throw new BadRequestError(`\u041D\u0435 \u043C\u043E\u0436\u043D\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0438 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0437\u0456 \u0441\u0442\u0430\u0442\u0443\u0441\u043E\u043C ${status}. \u0412\u043E\u043D\u043E \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0441\u043F\u043E\u0447\u0430\u0442\u043A\u0443 \u0432\u0456\u0434\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0435`);
      }
      const data = { status: "COMPLETED" };
      const orderFullEntity = await this.deps.orderRepository.update(id, data);
      const response = toOrderFullResponse(orderFullEntity);
      return response;
    };
    //Метод для скасування замовлення (використовується в PaymentService, коли платіж зафейлився, або користувач вчасно не оплатив його, або коли відбулось повернення коштів користувачу)
    //Викликається у відповідь на вебхук монобанк (якщо метод оплати "CARD") або адміном (якщо метод оплати "CASH") Передбачає зміну статусу замовлення на CANCELLED та повернення товару на склад
    this.cancelOrder = async (id) => {
      const { items, payment } = await this.findFullById(id);
      if (payment.method === "CARD") {
        if (payment.status !== "FAILED" && payment.status !== "REFUNDED") {
          throw new BadRequestError(`\u041D\u0435\u043C\u043E\u0436\u043B\u0438\u0432\u043E \u0441\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F, \u043F\u0440\u0438 \u043E\u043F\u043B\u0430\u0442\u0456 \u043A\u0430\u0440\u0442\u043A\u043E\u044E, \u044F\u043A\u0449\u043E \u043E\u043F\u043B\u0430\u0442\u0430 \u043D\u0435 \u0441\u043A\u0430\u0441\u043E\u0432\u0430\u043D\u0430`);
        }
      }
      return await this.deps.dbService.$transaction(async (tx) => {
        for (const item of items) {
          await this.deps.productService.increaseQuantity(item.productId, item.quantity, tx);
        }
        const data = { status: "CANCELLED" };
        const orderFullEntity = await this.deps.orderRepository.update(id, data, tx);
        const response = toOrderFullResponse(orderFullEntity);
        return response;
      });
    };
    //Приватний метод для формування загальної суми замовлення (totalAmount) та списку елементів замовлення (items)
    this.prepareOrderDetails = (cart) => {
      let totalAmount = 0;
      const orderItems = [];
      for (const cartItem of cart.items) {
        const product = cartItem.product;
        if (product.quantity < cartItem.quantity) {
          throw new BadRequestError(`\u041D\u0435 \u0434\u043E\u0441\u0442\u0430\u0442\u043D\u044C\u043E \u0442\u043E\u0432\u0430\u0440\u0443 ${product.productName} \u043D\u0430 \u0441\u043A\u043B\u0430\u0434\u0456. \u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E ${product.quantity}`);
        }
        totalAmount += cartItem.quantity * product.price;
        const orderItem = {
          quantity: cartItem.quantity,
          price: product.price,
          product: {
            connect: { id: product.id }
          }
        };
        orderItems.push(orderItem);
      }
      return {
        totalAmount,
        orderItems
      };
    };
    //Приватний метод для виконання групи транзакцій замовлення: списання кількості продуктів, створення замовлення та очищення кошика
    //з можливістю відкату (компенсації) у випадку, якщо перші дві транзакції завершились помилкою
    this.executeOrderCreationTransaction = async (userId, cartItems, orderData) => {
      return await this.deps.dbService.$transaction(async (tx) => {
        for (const cartItem of cartItems) {
          await this.deps.productService.decreaseQuantity(cartItem.productId, cartItem.quantity, tx);
        }
        const orderFullEntity = await this.deps.orderRepository.create(orderData, tx);
        await this.deps.cartService.clearCart(userId, tx);
        return orderFullEntity;
      });
    };
    //Приватний метод для створення інвойсу. Викликається в методі create після створення замовлення, та в методі retryPayment (якщо після створення замовлення не вдалось створити інвойс).
    this.initiateOrderPayment = async (order) => {
      if (order.payment.method !== "CARD") {
        throw new BadRequestError(`\u0417\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0437 ID ${order.id} \u043D\u0435 \u043F\u0435\u0440\u0435\u0434\u0431\u0430\u0447\u0430\u0454 \u043E\u043F\u043B\u0430\u0442\u0443 \u043A\u0430\u0440\u0442\u043A\u043E\u044E`);
      }
      if (order.payment.status === "PAID") {
        throw new BadRequestError(`\u0417\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0437 ID ${order.id} \u0432\u0436\u0435 \u043E\u043F\u043B\u0430\u0447\u0435\u043D\u0435`);
      }
      const createInvoiceResponse = await this.deps.paymentService.createInvoice(
        order.id,
        order.payment.id,
        order.payment.amount
        //Тут соріш за все потрібно буде вказати саме totalAmount
      );
      return createInvoiceResponse.paymentUrl;
    };
    this.deps = dependencies;
  }
};

// src/modules/order/api/order.controller.ts
var OrderController = class {
  constructor({ orderService }) {
    this.findMyFullById = async (req, res) => {
      const tokenPayload = extractTokenPayloadOrThrow(req);
      const params = extractValidatedParamsOrThrow(req);
      const response = await this.orderService.findMyFullById(tokenPayload.id, params.id);
      res.json(response);
    };
    this.findFullById = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const response = await this.orderService.findFullById(id);
      res.json(response);
    };
    this.findMyMany = async (req, res) => {
      const { id } = extractTokenPayloadOrThrow(req);
      const query = extractValidatedQueryOrThrow(req);
      const response = await this.orderService.findMyMany(id, query);
      res.json(response);
    };
    this.findMany = async (req, res) => {
      const query = extractValidatedQueryOrThrow(req);
      const response = await this.orderService.findMany(query);
      res.json(response);
    };
    this.create = async (req, res) => {
      const { id } = extractTokenPayloadOrThrow(req);
      const dto = extractValidatedBodyOrThrow(req);
      const response = await this.orderService.create(id, dto);
      res.json(response);
    };
    //Повторна спроба ініціалізації оплати в Монобанку (для користувача)
    this.retryPayment = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const tokenPayload = extractTokenPayloadOrThrow(req);
      const response = await this.orderService.retryPayment(id, tokenPayload.id);
      res.json(response);
    };
    //Додавання ТТН та переведення замовлення в статус DELIVERING (для адмінів)
    this.setTrackingNumber = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const { trackingNumber } = extractValidatedBodyOrThrow(req);
      const response = await this.orderService.setTrackingNumber(id, trackingNumber);
      res.json(response);
    };
    //Зміна статусу замовлення на COMPLETED після отримання користувачем (метод для адмінів)
    this.updateStatusToCompleted = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const response = await this.orderService.updateStatusToCompleted(id);
      res.json(response);
    };
    //Скасування замовлення (виключно для методу оплати CASH). Метод для адмінів
    this.cancelOrder = async (req, res) => {
      const { id } = extractValidatedParamsOrThrow(req);
      const response = await this.orderService.cancelOrder(id);
      res.json(response);
    };
    this.orderService = orderService;
  }
};

// src/modules/order/api/order.router.ts
var import_express7 = require("express");
var createOrderRouter = ({ orderController, authMiddleware }) => {
  const router = (0, import_express7.Router)();
  router.get(
    "/my/:id",
    authMiddleware.authenticate,
    validate({ params: orderParamsSchema }),
    orderController.findMyFullById
  );
  router.get(
    "/my",
    authMiddleware.authenticate,
    validate({ query: ordersQuerySchema }),
    orderController.findMyMany
  );
  router.get(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ params: orderParamsSchema }),
    orderController.findFullById
  );
  router.get(
    "/",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ query: ordersQuerySchema }),
    orderController.findMany
  );
  router.post(
    "/",
    authMiddleware.authenticate,
    validate({ body: createOrderDtoSchema }),
    orderController.create
  );
  router.patch(
    "/:id/retry-payment",
    authMiddleware.authenticate,
    validate({ params: orderParamsSchema }),
    orderController.retryPayment
  );
  router.patch(
    "/:id/delivery/tracking-number",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ params: orderParamsSchema, body: setTrackingNumberDtoSchema }),
    orderController.setTrackingNumber
  );
  router.patch(
    "/:id/status/completed",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ params: orderParamsSchema }),
    orderController.updateStatusToCompleted
  );
  router.patch(
    "/:id/cancel-order",
    authMiddleware.authenticate,
    authMiddleware.authorize(["admin"]),
    validate({ params: orderParamsSchema }),
    orderController.cancelOrder
  );
  return router;
};

// src/modules/order/infrastructure/database/order.repository.ts
var OrderRepository = class {
  constructor({ dbService }) {
    this.findFullById = async (id) => {
      const order = await this.dbService.order.findUnique({
        where: { id },
        include: orderInclude
      });
      return order;
    };
    this.findMany = async (args) => {
      const orders = await this.dbService.order.findMany({
        ...args,
        //include є обовязковим, бо тип OrderFullEntity цього вимагає
        include: orderInclude
      });
      return orders;
    };
    this.count = async (where) => {
      const count = await this.dbService.order.count({ where });
      return count;
    };
    this.create = async (data, tx) => {
      const client = tx ?? this.dbService;
      const order = await client.order.create({
        data,
        include: orderInclude
      });
      return order;
    };
    this.update = async (id, data, tx) => {
      const client = tx ?? this.dbService;
      const order = await client.order.update({
        where: { id },
        data,
        include: orderInclude
      });
      return order;
    };
    this.dbService = dbService;
  }
};

// src/modules/order/order.module.ts
var orderModuleDeps = {
  orderRepository: (0, import_awilix6.asClass)(OrderRepository).singleton(),
  orderService: (0, import_awilix6.asClass)(OrderService).singleton(),
  orderController: (0, import_awilix6.asClass)(OrderController).singleton(),
  orderRouter: (0, import_awilix6.asFunction)(createOrderRouter).singleton()
};

// src/modules/payment/payment.module.ts
var import_awilix7 = require("awilix");

// src/modules/payment/infrastructure/database/payment.repository.ts
var PaymentRepository = class {
  constructor({ dbService }) {
    this.update = async (id, data, tx) => {
      const client = tx ?? this.dbService;
      const payment = await client.payment.update({
        where: {
          id
        },
        data
      });
      return payment;
    };
    this.updateStatusByExternalId = async (externalId, data, tx) => {
      const client = tx ?? this.dbService;
      const payment = await client.payment.update({
        where: {
          externalId
        },
        data
      });
      return payment;
    };
    this.dbService = dbService;
  }
};

// src/modules/payment/infrastructure/providers/monobank/monobank.provider.ts
var import_zod20 = require("zod");
var monobankInvoiceResponseSchema = import_zod20.z.object({
  invoiceId: import_zod20.z.string(),
  pageUrl: import_zod20.z.url()
});
var MonobankProvider = class {
  constructor({ config: config3 }) {
    this.createInvoice = async (input) => {
      if (this.isSandbox) {
        console.log(`[Monobank Sandbox] \u0421\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F \u0456\u043D\u0432\u043E\u0439\u0441\u0443 \u0434\u043B\u044F \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0437 ID ${input.orderId} \u043D\u0430 \u0441\u0443\u043C\u0443 ${input.amount} \u0433\u0440\u043D`);
        const output = {
          invoiceId: `mock-invoice-${Math.random().toString(36).substring(2, 9)}`,
          //ключ міститиме випадковий рядок з 7 символів
          pageUrl: `https://sandbox.monobank.ua/checkout/mock_pay_page_${input.orderId}`
        };
        return output;
      }
      try {
        const response = await fetch(`${this.baseUrl}/merchant/invoice/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Token": this.token
          },
          body: JSON.stringify({
            // Monobank приймає суму в копійках (ціле число), тому множимо на 100
            amount: Math.round(input.amount * 100),
            ccy: 980,
            // Код валюти: Гривня (UAH)
            merchantInvoice: String(input.orderId),
            redirectUrl: `${this.allowedOriginUrl}/orders/${input.orderId}/payment-success`,
            //Куди повернути клієнта після оплати
            webHookUrl: `${this.allowedOriginUrl}/api/payments/webhook/monobank`
            //Сюди Моно пришле сповіщення про успішну оплату
          })
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Monobank API \u043F\u043E\u043C\u0438\u043B\u043A\u0430: ${response.status} - ${errorText}`);
          throw new BadGatewayError("\u041C\u043E\u043D\u043E\u0431\u0430\u043D\u043A \u0432\u0456\u0434\u0445\u0438\u043B\u0438\u0432 \u0437\u0430\u043F\u0438\u0442 \u043D\u0430 \u0441\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F \u0456\u043D\u0432\u043E\u0439\u0441\u0443");
        }
        const data = await response.json();
        const result = monobankInvoiceResponseSchema.safeParse(data);
        if (!result.success) {
          console.error("[Monobank Schema Mismatch]:", import_zod20.z.treeifyError(result.error));
          throw new BadGatewayError("\u0424\u043E\u0440\u043C\u0430\u0442 \u0434\u0430\u043D\u0438\u0445, \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u0438\u0445 \u0437 API \u043C\u043E\u043D\u043E\u0431\u0430\u043D\u043A\u0443 \u043D\u0435 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0454 \u043E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u0438\u043C");
        }
        const output = {
          invoiceId: result.data.invoiceId,
          pageUrl: result.data.pageUrl
        };
        return output;
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        console.error("[Monobank Provider Error]:", error);
        throw new BadGatewayError("\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0432'\u044F\u0437\u0430\u0442\u0438\u0441\u044F \u0437 \u0441\u0435\u0440\u0432\u0456\u0441\u043E\u043C Monobank");
      }
    };
    this.token = config3.monoApi.token;
    this.baseUrl = config3.monoApi.url;
    this.isSandbox = !config3.isProduction && this.token === "mock-token";
    this.allowedOriginUrl = config3.allowedOrigin.url;
  }
};

// src/modules/payment/api/payment.mapper.ts
var toPaymentResponse = (payment) => {
  const transformedPayment = {
    ...payment
  };
  const response = paymentResponseSchema.parse(transformedPayment);
  return response;
};

// src/modules/payment/application/payment.service.ts
var PaymentService = class {
  constructor(dependencies) {
    this.createInvoice = async (orderId, paymentId, amount) => {
      let invoice;
      try {
        invoice = await this.deps.paymentProvider.createInvoice({
          orderId,
          amount
        });
      } catch (error) {
        throw new BadGatewayError("\u041F\u043B\u0430\u0442\u0456\u0436\u043D\u0430 \u0441\u0438\u0441\u0442\u0435\u043C\u0430 \u0442\u0438\u043C\u0447\u0430\u0441\u043E\u0432\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0432\u0438\u043A\u043E\u043D\u0430\u0442\u0438 \u043E\u043F\u043B\u0430\u0442\u0443 \u0449\u0435 \u0440\u0430\u0437 \u0437\u0430 \u043A\u0456\u043B\u044C\u043A\u0430 \u0445\u0432\u0438\u043B\u0438\u043D");
      }
      const data = { externalId: invoice.invoiceId };
      const payment = await this.deps.paymentRepository.update(paymentId, data);
      const paymentResponse = toPaymentResponse(payment);
      const response = {
        payment: paymentResponse,
        paymentUrl: invoice.pageUrl
      };
      return response;
    };
    //Оновлення статусів Order та Payment (Викликається вебхуком монобанку). tx можна не використовувати, бо якщо наприклад впала бд,
    //вебхук монобанку не отримає код 200 і буде повторно надсилати запити. І коли бд відновиться, то після чергового вебхуку
    //статуси в Order та Payment оновляться і сервер монобанку отримає статус 200
    this.updateStatusByExternalId = async (externalId, status) => {
      const data = { status };
      const payment = await this.deps.paymentRepository.updateStatusByExternalId(externalId, data);
      if (status === "PAID") {
        await this.deps.orderService.updateStatusToPaid(payment.orderId);
      } else if (status == "FAILED" || status == "REFUNDED") {
        await this.deps.orderService.cancelOrder(payment.orderId);
      }
      const response = toPaymentResponse(payment);
      return response;
    };
    this.deps = dependencies;
  }
};

// src/modules/payment/api/payment.controller.ts
var PaymentWebhookController = class {
  constructor({ paymentService }) {
    //В маршруті меред цим методом контроллера обовязкова має бути мідлвара verifyMonobankSignature
    this.handleMonobankWebhook = async (req, res) => {
      const result = monobankWebhookDtoSchema.safeParse(req.body);
      if (!result.success) {
        res.status(200).send("OK");
        console.error("[CRITICAL] \u0412\u0430\u043B\u0456\u0434\u0430\u0446\u0456\u044F \u0432\u0435\u0431\u0445\u0443\u043A\u0443 \u043C\u043E\u043D\u043E\u0431\u0430\u043D\u043A\u0443 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u043B\u0430\u0441\u044C \u043F\u043E\u043C\u0438\u043B\u043A\u043E\u044E!");
        return;
      }
      const { invoiceId, status } = result.data;
      if (status !== "success" && status !== "failure" && status !== "expired" && status !== "reversed") {
        res.status(200).send("OK");
        return;
      }
      let systemStatus;
      if (status === "success") {
        systemStatus = "PAID";
      } else if (status === "reversed") {
        systemStatus = "REFUNDED";
      } else {
        systemStatus = "FAILED";
      }
      await this.paymentService.updateStatusByExternalId(invoiceId, systemStatus);
      res.status(200).send("OK");
    };
    this.paymentService = paymentService;
  }
};

// src/modules/payment/api/payment.router.ts
var import_express8 = require("express");
var createPaymentRouter = ({ monobankMiddleware, paymentWebhookController }) => {
  const router = (0, import_express8.Router)();
  router.post(
    "/webhook/monobank",
    monobankMiddleware.verify,
    //мідлвару validate ми не використовуєм для фінансових операцій, бо у випадку помилки валідації банк отримає
    //код з помилкою і буде далі бомбардувати наш ендпойнт вебхуками, і в результаті взагалі заблокує подальші вебхуки і для інших оплат
    //Тому валідацію слід проводити в самому контролері методом safeParse() і при будь-якому результаті повертати банку код 200
    paymentWebhookController.handleMonobankWebhook
  );
  return router;
};

// src/modules/payment/api/verify-monobank-signature.middleware.ts
var import_crypto = __toESM(require("crypto"));
var MonobankMiddleware = class {
  constructor({ config: config3 }) {
    this.verify = (req, res, next) => {
      if (!this.config.isProduction && this.config.monoApi.token === "mock-token") {
        next();
        return;
      }
      const xSign = req.headers["x-sign"];
      if (!xSign || typeof xSign !== "string") {
        throw new BadRequestError("\u041E\u0442\u0440\u0438\u043C\u0430\u043D\u043E \u0432\u0435\u0431\u0445\u0443\u043A \u0432\u0456\u0434 \u041C\u043E\u043D\u043E\u0431\u0430\u043D\u043A\u0443 \u0431\u0435\u0437 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 x-sign!");
      }
      const rawBody = req.rawBody;
      if (!rawBody) {
        throw new BadRequestError("\u0422\u0456\u043B\u043E \u0437\u0430\u043F\u0438\u0442\u0443 \u0432\u0456\u0434\u0441\u0443\u0442\u043D\u0454");
      }
      const verifier = import_crypto.default.createVerify("sha256");
      verifier.update(rawBody);
      const isValid = verifier.verify(this.config.monoApi.pubKey, xSign, "base64");
      if (!isValid) {
        throw new ForbiddenError("\u041F\u0456\u0434\u043F\u0438\u0441 X-Sign \u043D\u0435 \u0437\u0431\u0456\u0433\u0430\u0454\u0442\u044C\u0441\u044F!");
      }
      next();
    };
    this.config = config3;
  }
};

// src/modules/payment/payment.module.ts
var paymentModuleDeps = {
  paymentRepository: (0, import_awilix7.asClass)(PaymentRepository).singleton(),
  paymentProvider: (0, import_awilix7.asClass)(MonobankProvider).singleton(),
  paymentService: (0, import_awilix7.asClass)(PaymentService).singleton(),
  monobankMiddleware: (0, import_awilix7.asClass)(MonobankMiddleware).singleton(),
  paymentWebhookController: (0, import_awilix7.asClass)(PaymentWebhookController).singleton(),
  paymentRouter: (0, import_awilix7.asFunction)(createPaymentRouter).singleton()
};

// src/modules/delivery/delivery.module.ts
var import_awilix8 = require("awilix");

// src/modules/delivery/infrastructure/database/delivery.repository.ts
var DeliveryRepository = class {
  constructor({ dbService }) {
    this.update = async (id, data, tx) => {
      const client = tx ?? this.dbService;
      const delivery = await client.delivery.update({
        where: {
          id
        },
        data
      });
      return delivery;
    };
    this.dbService = dbService;
  }
};

// src/modules/delivery/api/delivery.mapper.ts
var toDeliveryResponse = (delivery) => {
  const transformedDelivery = {
    ...delivery
  };
  const response = deliveryResponseSchema.parse(transformedDelivery);
  return response;
};

// src/modules/delivery/application/delivery.service.ts
var DeliveryService = class {
  constructor({ deliveryRepository }) {
    this.updateTrackingNumber = async (id, trackingNumber, tx) => {
      const data = { trackingNumber };
      const delivery = await this.deliveryRepository.update(id, data, tx);
      console.log(`[DELIVERY_SERVICE] \u0414\u043E\u0441\u0442\u0430\u0432\u0446\u0456 \u0437 ID${id} \u043F\u0440\u0438\u0441\u0432\u043E\u0454\u043D\u043E \u0422\u0422\u041D: ${trackingNumber}`);
      const response = toDeliveryResponse(delivery);
      return response;
    };
    this.deliveryRepository = deliveryRepository;
  }
};

// src/modules/delivery/delivery.module.ts
var deliveryModuleDeps = {
  deliveryRepository: (0, import_awilix8.asClass)(DeliveryRepository).singleton(),
  deliveryService: (0, import_awilix8.asClass)(DeliveryService).singleton()
};

// src/shared/infrastructure/di/container.ts
var container = (0, import_awilix9.createContainer)({
  injectionMode: import_awilix9.InjectionMode.PROXY
});
container.register({
  //global
  config: (0, import_awilix9.asValue)(config),
  dbService: (0, import_awilix9.asClass)(PrismaService).singleton(),
  hashProvider: (0, import_awilix9.asClass)(BcryptProvider).singleton(),
  jwtProvider: (0, import_awilix9.asClass)(JwtProvider).singleton(),
  authMiddleware: (0, import_awilix9.asClass)(AuthMiddleware).singleton(),
  appRouter: (0, import_awilix9.asFunction)(createAppRouter).singleton(),
  //modules
  ...authModuleDeps,
  ...userModuleDeps,
  ...productModuleDeps,
  ...producerModuleDeps,
  ...cartModuleDeps,
  ...orderModuleDeps,
  ...paymentModuleDeps,
  ...deliveryModuleDeps
});

// src/api/loaders/database.loader.ts
var databaseLoader = async () => {
  const dbService = container.resolve("dbService");
  await dbService.connect();
};

// src/api/loaders/express.loader.ts
var import_express9 = __toESM(require("express"));

// src/api/middlewares/cors.middleware.ts
var cors = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", config.allowedOrigin.url);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
};

// src/api/middlewares/error.middleware.ts
var import_zod21 = require("zod");
var errorHandler = (err, req, res, next) => {
  let finalError = null;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        const targets = err.meta?.target || [];
        const fields = targets.length > 0 ? targets.join(", ") : "";
        const details = config.isProduction ? void 0 : { fields: targets };
        finalError = new ConflictError(fields, details);
        break;
      case "P2025":
        finalError = new NotFoundError();
        break;
      default:
        finalError = new InternalServerError("\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0431\u0430\u0437\u0438 \u0434\u0430\u043D\u0438\u0445");
    }
  }
  if (err instanceof import_zod21.z.ZodError) {
    const details = import_zod21.z.treeifyError(err);
    finalError = new ValidationError(details);
  }
  if (err instanceof AppError) {
    finalError = err;
  }
  if (!finalError) {
    finalError = new InternalServerError();
  }
  console.error(finalError);
  return res.status(finalError.statusCode).json(finalError);
};

// src/api/loaders/express.loader.ts
var expressLoader = async () => {
  const app = (0, import_express9.default)();
  app.use(import_express9.default.json({
    //За допомогою verify додаємо сире тіло запиту в обєкт req.body. Потрібно для вебхуків платіжних систем
    //аргументи req, res, buf - це сирі обєкти node js, до того, як express створить на їх основі свої обєкти req та res
    verify: (req, res, buf) => {
      if (req.headers["x-sign"] && buf && buf.length) {
        req.rawBody = buf;
      }
    }
  }));
  app.use(cors);
  const appRouter = container.resolve("appRouter");
  app.use("/api", appRouter);
  app.use(errorHandler);
  return app;
};

// src/api/loaders/index.ts
var initLoaders = async () => {
  console.log("\u{1F6E0}\uFE0F  Initializing layers...");
  await databaseLoader();
  console.log("\u2705 Database connected");
  const app = await expressLoader();
  console.log("\u2705 Express configured");
  console.log("\u{1F680} All systems GO!");
  return app;
};

// src/api/lifecycle/shutdown.ts
var setupGracefulShutdown = (server) => {
  const handleShutdown = () => {
    server.close(async () => {
      try {
        console.log(`
 Handle closing start...`);
        const dbService = container.resolve("dbService");
        await dbService.disconnect();
        console.log("  - Database disconnected");
        console.log(`
 Handle closing was finished success...`);
        process.exit(0);
      } catch (error) {
        console.error("Shutdown error:", error);
        process.exit(1);
      }
    });
    setTimeout(() => process.exit(1), 1e4);
  };
  process.on("SIGINT", () => handleShutdown());
  process.on("SIGTERM", () => handleShutdown());
};

// src/server.ts
async function bootstrap() {
  try {
    console.log("\u{1F680} Starting bootstrap process...");
    const app = await initLoaders();
    const server = app.listen(config.port, () => {
      console.log(`
                                ################################################
                                \u{1F6E1}\uFE0F  Server listening on port: ${config.port} \u{1F6E1}\uFE0F
                                \u{1F3E2}  Environment: ${config.nodeEnv}
                                \u{1F680}  Health check: http://localhost:${config.port}/api/health
                                ################################################
                        `);
    });
    setupGracefulShutdown(server);
  } catch (error) {
    console.error("\u{1F4A5} Bootstrap failed:", error);
    process.exit(1);
  }
}
bootstrap();

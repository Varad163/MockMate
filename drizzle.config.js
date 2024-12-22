import { defineConfig } from "drizzle-kit";

/** @type {import ("drizzle-kit").Config} */

export default defineConfig({
    dialect: "postgresql",
    schema: "./utils/schema.js",
    dbCredentials:{
        url: 'postgresql://neondb_owner:LI85kUczejnY@ep-dark-pond-a57p7x71.us-east-2.aws.neon.tech/neondb?sslmode=require',
    }
});
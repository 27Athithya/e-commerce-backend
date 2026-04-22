import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProductsModule } from "./modules/products/products.module";
import { validateEnv } from "./config/env.validation";

const mongoLogger = new Logger("MongoDB");

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
      ignoreEnvFile: process.env.NODE_ENV === "production",
      validate: validateEnv,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>("MONGODB_URI"),
        lazyConnection: true,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        connectionFactory: (connection) => {
          connection.on("connected", () => {
            mongoLogger.log("MongoDB connected");
          });

          connection.on("error", (error: unknown) => {
            mongoLogger.error("MongoDB connection error", error as object);
          });

          connection.on("disconnected", () => {
            mongoLogger.warn("MongoDB disconnected");
          });

          return connection;
        },
      }),
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

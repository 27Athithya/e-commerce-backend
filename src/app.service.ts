import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

type DatabaseState = "disconnected" | "connected" | "connecting" | "disconnecting";

type HealthResponse = {
  status: "ok" | "degraded";
  database: {
    connected: boolean;
    state: DatabaseState;
  };
};

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async health(): Promise<HealthResponse> {
    const state = this.mapReadyState(this.connection.readyState);
    let connected = state === "connected";

    if (connected) {
      try {
        if (!this.connection.db) {
          connected = false;
        } else {
          await this.connection.db.admin().ping();
        }
      } catch {
        connected = false;
      }
    }

    return {
      status: connected ? "ok" : "degraded",
      database: {
        connected,
        state,
      },
    };
  }

  private mapReadyState(readyState: number): DatabaseState {
    switch (readyState) {
      case 1:
        return "connected";
      case 2:
        return "connecting";
      case 3:
        return "disconnecting";
      default:
        return "disconnected";
    }
  }
}

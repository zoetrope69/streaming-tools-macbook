import { EventEmitter } from "events";
import { Ableton as AbletonJS } from "ableton-js";

const { MACBOOK_SECRET } = process.env;

class Ableton extends EventEmitter {
  constructor({ app }) {
    super();

    this.ableton = new AbletonJS();

    this.ableton.on("error", (e) => console.error(`Error`, e));

    this.handleRequests({ app });

    this.emitTempo();
    this.emitIsPlaying();
    this.handleConnection();
  }

  handleRequests({ app }) {
    app.all("/ableton/:endpoint", async (request, response, next) => {
      const { endpoint } = request.params;
      const secret = request.headers["x-secret"];

      if (MACBOOK_SECRET !== secret) {
        return response.status(500).json({ error: "Something went wrong" });
      }

      if (!endpoint) {
        return response.status(500).json({ error: "No endpoint sent" });
      }

      if (!this.ableton) {
        return response.status(500).json({ error: "Ableton not connected" });
      }

      next();
    });

    app.get("/ableton/:endpoint", async (request, response) => {
      const { endpoint } = request.params;

      if (endpoint === "isConnected") {
        const isConnected = this.ableton.isConnected();
        return response.json({ data: isConnected });
      }

      if (endpoint === "isPlaying") {
        const isPlaying = await this.ableton.song.get("is_playing");
        return response.json({ data: !!isPlaying });
      }

      if (endpoint === "tempo") {
        const tempo = await this.ableton.song.get("tempo");
        return response.json({ data: tempo });
      }
    });

    app.post("/ableton/:endpoint", async (request, response) => {
      const { endpoint } = request.params;

      if (endpoint === "tempo") {
        await this.ableton.song.set("tempo", data);
        return response.json({ success: true });
      }
    });
  }

  async emitTempo() {
    const handleTempoListener = (tempo) => {
      this.emit("change", { tempo });
    };

    this.ableton.on("connect", async () => {
      const tempo = await this.ableton.song.get("tempo");
      this.emit("change", { tempo });

      this.ableton.song.addListener("tempo", handleTempoListener);
    });
  }

  async emitIsPlaying() {
    const handleIsPlayingListener = (isPlaying) => {
      this.emit("change", { isPlaying });
    };

    this.ableton.on("connect", async () => {
      const isPlaying = await this.ableton.song.get("is_playing");
      this.emit("change", { isPlaying });

      this.ableton.song.addListener("is_playing", handleIsPlayingListener);
    });
  }

  async handleConnection() {
    this.ableton.on("connect", () => {
      this.emit("change", { isConnected: true });
    });

    this.ableton.on("disconnect", () => {
      this.emit("change", { isConnected: false });
    });
  }
}

export default Ableton;

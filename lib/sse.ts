export type RawSSEEvent = {
  event: string;
  data: string;
  id?: string;
};

export class SSEParser {
  private buffer = "";
  private event = "message";
  private data: string[] = [];
  private id: string | undefined;

  push(chunk: string): RawSSEEvent[] {
    this.buffer += chunk.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const events: RawSSEEvent[] = [];
    let newlineIndex = this.buffer.indexOf("\n");

    while (newlineIndex !== -1) {
      const line = this.buffer.slice(0, newlineIndex);
      this.buffer = this.buffer.slice(newlineIndex + 1);

      if (line === "") {
        const event = this.dispatch();
        if (event) events.push(event);
      } else if (!line.startsWith(":")) {
        const separatorIndex = line.indexOf(":");
        const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
        const value = separatorIndex === -1 ? "" : line.slice(separatorIndex + 1).replace(/^ /, "");

        if (field === "event") this.event = value || "message";
        if (field === "data") this.data.push(value);
        if (field === "id") this.id = value;
      }

      newlineIndex = this.buffer.indexOf("\n");
    }

    return events;
  }

  finish(): RawSSEEvent[] {
    const events: RawSSEEvent[] = [];
    if (this.buffer) {
      const buffered = this.buffer;
      this.buffer = "";
      events.push(...this.push(`${buffered}\n`));
    }
    const event = this.dispatch();
    if (event) events.push(event);
    return events;
  }

  private dispatch(): RawSSEEvent | null {
    if (this.data.length === 0) {
      this.reset();
      return null;
    }

    const event = { event: this.event, data: this.data.join("\n"), id: this.id };
    this.reset();
    return event;
  }

  private reset() {
    this.event = "message";
    this.data = [];
    this.id = undefined;
  }
}

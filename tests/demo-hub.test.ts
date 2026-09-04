import { describe, expect, it } from "vitest";
import { demos } from "@/data/demos";

describe("demo hub", () => {
  it("lists the restaurant vertical as live with a workspace link", () => {
    const restaurant = demos.find((demo) => demo.id === "restaurant");

    expect(restaurant).toBeDefined();
    expect(restaurant?.status).toBe("available");
    expect(restaurant?.href).toBe("/demo/restaurant");
  });
});

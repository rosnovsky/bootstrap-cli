import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { logInfo } from "../utils/logger.js";
import mock from "mock-fs";

beforeEach(() => {
  mock({
    "bootstrap_cli.log": "[2021-10-05T20:40:00.000Z] [INFO]: Hello, world!",
  });
});

afterEach(() => {
  mock.restore();
});

test("logger", (t) => {
  const file = `bootstrap_cli.log`;
  const message = "ERROR!!!";
  const expected = "[2021-10-05T20:40:00.000Z] [INFO]: Hello, world!";
  const fff = readFileSync(file, "utf8");
  console.log(fff);
  logInfo(message);

  const result = readFileSync(file, "utf8");
  assert.strictEqual(result, expected);
});

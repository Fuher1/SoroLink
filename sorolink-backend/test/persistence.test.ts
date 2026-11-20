import { afterEach, describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";
import { PersistenceCoordinator } from "../src/persistence.js";
import { PostgresRunStore } from "../src/run-store.js";
import { createScenarioRegistry } from "../src/scenarios.js";

// Issue #32: the in-memory run store stays the default; PostgreSQL run history
// is only wired in when RUN_PERSISTENCE_ENABLED=true is set explicitly.
describe("PersistenceCoordinator run store selection", () => {
  const coordinators: PersistenceCoordinator[] = [];
  const create = (env: NodeJS.ProcessEnv) => {
    const coordinator = new PersistenceCoordinator(loadConfig(env), createScenarioRegistry());
    coordinators.push(coordinator);
    return coordinator;
  };

  afterEach(async () => {
    await Promise.all(coordinators.splice(0).map((coordinator) => coordinator.close()));
  });

  it("does not create a PostgreSQL run store by default", () => {
    expect(create({}).runStore).toBeUndefined();
  });

  it("keeps run reports in memory when only scenario persistence is enabled", () => {
    expect(create({ PERSISTENCE_MODE: "published", DATABASE_URL: "postgres://localhost/sorolink" }).runStore).toBeUndefined();
  });

  it("uses PostgresRunStore when RUN_PERSISTENCE_ENABLED=true", () => {
    const coordinator = create({
      PERSISTENCE_MODE: "published",
      DATABASE_URL: "postgres://localhost/sorolink",
      RUN_PERSISTENCE_ENABLED: "true",
    });
    expect(coordinator.runStore).toBeInstanceOf(PostgresRunStore);
  });
});

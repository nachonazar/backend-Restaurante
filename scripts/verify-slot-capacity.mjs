import assert from "node:assert/strict";
import { test } from "node:test";

process.env.SLOT_CAPACITY = "20";

const { buildSlotCapacityDetails } = await import(
  "../src/modules/reservations/slotCapacityDetails.js"
);
const {
  applySlotCapacityIncrement,
  applySlotCapacityRelease,
  buildEffectiveReservationValues,
  buildSlotCapacityCounterQuery,
  buildUpdateCapacityPlan,
} = await import("../src/modules/reservations/slotCapacity.helpers.js");
const { SLOT_CAPACITY } = await import("../src/shared/scheduleConfig.js");

test("buildSlotCapacityDetails preserves structured 409 capacity context", () => {
  const details = buildSlotCapacityDetails({
    date: "2026-06-26",
    time: "20:00",
    used: SLOT_CAPACITY - 2,
    requested: 4,
  });

  assert.deepEqual(details, {
    code: "SLOT_CAPACITY_EXCEEDED",
    date: "2026-06-26",
    time: "20:00",
    capacity: SLOT_CAPACITY,
    used: SLOT_CAPACITY - 2,
    requested: 4,
    remaining: 2,
  });
});

test("atomic slot counter predicate prevents duplicate same-slot reservations from exceeding capacity", () => {
  const date = "2026-06-26";
  const time = "20:00";
  const requested = 2;
  const usedBeforeDuplicateAttempts = SLOT_CAPACITY - requested;

  const query = buildSlotCapacityCounterQuery({ date, time, requested });
  assert.equal(query.time, time);
  assert.equal(query.date.toISOString().slice(0, 10), date);
  assert.deepEqual(query.used, { $lte: usedBeforeDuplicateAttempts });

  const firstAttempt = applySlotCapacityIncrement({
    used: usedBeforeDuplicateAttempts,
    requested,
  });
  const duplicateAttempt = applySlotCapacityIncrement({
    used: firstAttempt.used,
    requested,
  });

  assert.deepEqual(firstAttempt, { accepted: true, used: SLOT_CAPACITY });
  assert.deepEqual(duplicateAttempt, { accepted: false, used: SLOT_CAPACITY });
});

test("update capacity plan uses effective persisted values for omitted fields", () => {
  const current = {
    date: new Date("2026-06-26T00:00:00.000Z"),
    time: "20:00",
    pax: 4,
    status: "Pendiente",
  };

  const effective = buildEffectiveReservationValues(current, { pax: 6 });
  const plan = buildUpdateCapacityPlan(current, effective);

  assert.equal(effective.date, current.date);
  assert.equal(effective.time, current.time);
  assert.equal(effective.status, current.status);
  assert.equal(effective.pax, 6);
  assert.deepEqual(plan, {
    reserve: { date: current.date, time: current.time, pax: 2 },
    release: null,
  });
});

test("update capacity plan releases counters for cancellation and delete/status-release flows", () => {
  const current = {
    date: new Date("2026-06-26T00:00:00.000Z"),
    time: "20:00",
    pax: 5,
    status: "Confirmada",
  };
  const effective = buildEffectiveReservationValues(current, { status: "Cancelada" });
  const plan = buildUpdateCapacityPlan(current, effective);

  assert.deepEqual(plan, {
    reserve: null,
    release: { date: current.date, time: current.time, pax: current.pax },
  });
  assert.deepEqual(applySlotCapacityRelease({ used: 3, release: 5 }), { used: 0 });
});

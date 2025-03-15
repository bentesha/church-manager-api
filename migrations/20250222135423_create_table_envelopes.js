/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('envelopes', function (table) {
    table.string('id').primary(); // Unique identifier for the envelope record
    table.integer('envelopeNumber').notNullable(); // Envelope number
    table.string('churchId').notNullable().references('id').inTable('churches'); // Church association
    table
      .string('memberId')
      .nullable()
      .references('id')
      .inTable('members')
      .onDelete('SET NULL'); // Assigned member, nullable if unassigned
    table.dateTime('assignedAt').nullable(); // Timestamp when assigned to a member
    table.datetime('releasedAt').nullable(); // Timestamp when unassigned from a member
    table.timestamp('createdAt').defaultTo(knex.fn.now()); // Timestamp for record creation
    table.timestamp('updatedAt').defaultTo(knex.fn.now()); // Timestamp for last update

    // Unique constraint on envelopeNumber within a church
    table.unique(['churchId', 'envelopeNumber']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('envelopes');
};

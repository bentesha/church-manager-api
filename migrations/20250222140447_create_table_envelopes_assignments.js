/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('envelope_assignments', function (table) {
    table.string('id').primary(); // Unique identifier for the assignment record
    table
      .string('envelopeId')
      .notNullable()
      .references('id')
      .inTable('envelopes')
      .notNullable(); // Envelope number assigned
    table.string('churchId').notNullable().references('id').inTable('churches'); // Church association
    table
      .string('memberId')
      .nullable()
      .references('id')
      .inTable('members')
      .onDelete('SET NULL'); // Member involved in the activity
    table.enum('activityType', ['ASSIGNMENT', 'RELEASE']).notNullable(); // Activity type: Assignment or Release
    table.dateTime('activityAt').notNullable().defaultTo(knex.fn.now()); // Timestamp when the activity occurred
    table.timestamp('createdAt').defaultTo(knex.fn.now()); // Timestamp for record creation
    table.timestamp('updatedAt').defaultTo(knex.fn.now()); // Timestamp for last update

    table.index(['envelopeId', 'churchId']); // Index for faster lookups
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('envelope_assignments');
};

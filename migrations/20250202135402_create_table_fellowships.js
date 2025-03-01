/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('fellowships', function (table) {
    table.string('id').primary(); // Unique identifier for the fellowship
    table.string('churchId').notNullable().references('id').inTable('churches'); // Church association
    table.string('name').notNullable().unique(); // Unique name of the fellowship
    table.text('notes').nullable(); // Additional notes or description
    table.timestamp('createdAt').defaultTo(knex.fn.now()); // Timestamp for record creation
    table.timestamp('updatedAt').defaultTo(knex.fn.now()); // Timestamp for last update
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('fellowships');
};

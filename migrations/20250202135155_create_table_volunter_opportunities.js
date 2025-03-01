/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('volunteer_opportunities', function (table) {
    table.string('id').primary(); // Unique identifier for the volunteer opportunity
    table.string('churchId').notNullable().references('id').inTable('churches'); // Church association
    table.string('name').notNullable(); // Name of the volunteer opportunity
    table.text('description').notNullable(); // Description of the opportunity
    table.timestamp('createdAt').defaultTo(knex.fn.now()); // Timestamp for record creation
    table.timestamp('updatedAt').defaultTo(knex.fn.now()); // Timestamp for last update
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('volunteer_opportunities');
};

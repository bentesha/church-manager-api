/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('churches', function (table) {
    table.string('id').primary(); // Unique identifier for the church
    table.string('name').notNullable(); // Church name
    table.string('domainName').notNullable().unique(); // Unique domain for each church, used to associate users
    table.string('registrationNumber').notNullable().unique(); // System-generated unique identifier for the church, used in UI and support cases
    table.string('contactPhone').notNullable(); // Contact phone number for alerts and notifications
    table.string('contactEmail').notNullable(); // Contact email for alerts and notifications
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now()); // Timestamp for record creation (not nullable)
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now()); // Timestamp for last update (not nullable)

    table.index('domainName'); // Index for faster lookup by domain
    table.index('registrationNumber'); // Index for quick search by registration number
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('churches');
};

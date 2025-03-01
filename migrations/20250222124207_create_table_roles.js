/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('user_roles', function (table) {
    table.string('id').primary(); // Unique identifier for the role
    table.string('name').notNullable().unique(); // Role name (Admin, Moderator, etc.)
    table
      .string('churchId')
      .notNullable()
      .references('id')
      .inTable('churches'); // Church association
    table.text('description').nullable(); // Optional description of the role
    table.timestamp('createdAt').defaultTo(knex.fn.now()); // Timestamp for record creation
    table.timestamp('updatedAt').defaultTo(knex.fn.now()); // Timestamp for last update
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('user_roles');
};

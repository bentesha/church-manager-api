/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('user_credentials', function (table) {
    table
      .string('userId')
      .primary()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE'); // Foreign key to users table
    table.string('username').notNullable().unique(); // Username for login
    table.string('passwordHash').notNullable(); // Hashed password
    table.string('passwordSalt').nullable(); // Optional password salt if needed
    table.timestamp('lastLoginAt').nullable(); // Timestamp for last login
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now()); // Timestamp for record creation
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now()); // Timestamp for last update
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('user_credentials');
};

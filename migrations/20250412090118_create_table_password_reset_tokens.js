/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('password_reset_tokens', (table) => {
    table.string('id').primary();
    table.string('userId').notNullable();
    table.string('token').notNullable().unique();
    table.dateTime('expiresAt').notNullable();
    table.boolean('isUsed').defaultTo(false);
    table.dateTime('createdAt').notNullable();
    table.dateTime('updatedAt').notNullable();

    // Foreign key constraint
    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('password_reset_tokens');
};

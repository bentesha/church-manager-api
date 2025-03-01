/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('users', function (table) {
    table.string('id').primary(); // Unique user identifier
    table.string('name').notNullable(); // Full name of the user
    table.string('email').notNullable().unique(); // User email
    table.string('phoneNumber').nullable(); // Contact number
    table.string('churchId').notNullable().references('id').inTable('churches'); // Church association
    table.string('roleId').notNullable().references('id').inTable('user_roles'); // Role association
    table.boolean('isActive').notNullable().defaultTo(true); // Indicates if user is active
    table.boolean('isDeleted').notNullable().defaultTo(false); // Soft delete flag (false = active, true = deleted)
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now()); // Timestamp for record creation
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now()); // Timestamp for last update

    table.index('isDeleted'); // Index for efficient soft delete queries
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('users');
};

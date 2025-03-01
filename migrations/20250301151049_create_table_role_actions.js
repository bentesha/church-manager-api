/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function (knex) {
  await knex.schema.createTable('role_actions', function (table) {
    table.string('id').primary(); // Unique identifier for the role action
    table
      .string('roleId')
      .notNullable()
      .references('id')
      .inTable('user_roles')
      .onDelete('CASCADE'); // Role association
    table.string('action').notNullable(); // Action name, e.g., 'user.create', 'user.update'
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now()); // Timestamp for record creation
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now()); // Timestamp for last update

    table.unique(['roleId', 'action']); // Ensures a role cannot have duplicate actions
  });
};

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('role_actions');
};

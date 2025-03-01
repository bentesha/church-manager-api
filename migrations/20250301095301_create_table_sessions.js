/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('sessions', function (table) {
    table.string('id').primary(); // Unique session identifier
    table
      .string('userId')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE'); // User association
    table.string('token').notNullable().unique(); // Session token for authentication
    table.string('ipAddress').nullable(); // IP address of the user
    table.string('userAgent').nullable(); // User agent string
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now()); // Session creation timestamp
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now()); // Session last update timestamp
    table.timestamp('expiresAt').notNullable(); // Expiration timestamp
    table.boolean('isActive').notNullable().defaultTo(true); // Indicates if the session is active

    table.index('userId'); // Index for fast lookup by user
    table.index('isActive'); // Index for filtering active sessions
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('sessions');
};

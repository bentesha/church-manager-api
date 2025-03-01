/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('fellowship_elders', function (table) {
    table.string('fellowshipId').notNullable();
    table.string('memberId').notNullable(); // Church elder is a registered member
    table.primary(['fellowshipId', 'memberId']);

    table
      .foreign('fellowshipId')
      .references('id')
      .inTable('fellowships')
      .onDelete('CASCADE');

    table
      .foreign('memberId')
      .references('id')
      .inTable('members')
      .onDelete('CASCADE');

    table.timestamp('createdAt').defaultTo(knex.fn.now()); // Timestamp for when elder was assigned
    table.timestamp('updatedAt').defaultTo(knex.fn.now()); // Timestamp for last update
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('fellowship_elders');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(
    'member_volunteer_interests',
    function (table) {
      table.string('memberId').notNullable();
      table.string('opportunityId').notNullable();
      table.primary(['memberId', 'opportunityId']);

      table
        .foreign('memberId')
        .references('id')
        .inTable('members')
        .onDelete('CASCADE');

      table
        .foreign('opportunityId')
        .references('id')
        .inTable('volunteer_opportunities')
        .onDelete('CASCADE');

      table.timestamp('createdAt').defaultTo(knex.fn.now()); // Timestamp for when interest was expressed
      table.timestamp('updatedAt').defaultTo(knex.fn.now()); // Timestamp for last update
    },
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('member_volunteer_interests');
};
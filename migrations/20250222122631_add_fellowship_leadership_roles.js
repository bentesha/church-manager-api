/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('fellowships', function (table) {
    table
      .string('chairmanId')
      .nullable()
      .references('id')
      .inTable('members')
      .onDelete('SET NULL'); // Fellowship chairman
    table
      .string('deputyChairmanId')
      .nullable()
      .references('id')
      .inTable('members')
      .onDelete('SET NULL'); // Deputy chairman
    table
      .string('secretaryId')
      .nullable()
      .references('id')
      .inTable('members')
      .onDelete('SET NULL'); // Fellowship secretary
    table
      .string('treasurerId')
      .nullable()
      .references('id')
      .inTable('members')
      .onDelete('SET NULL'); // Fellowship treasurer
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('fellowships', function (table) {
    table.dropForeign('chairmanId');
    table.dropColumn('chairmanId');
    table.dropForeign('deputyChairmanId');
    table.dropColumn('deputyChairmanId');
    table.dropForeign('secretaryId');
    table.dropColumn('secretaryId');
    table.dropForeign('treasurerId');
    table.dropColumn('treasurerId');
  });
};

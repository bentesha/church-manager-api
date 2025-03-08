exports.up = function (knex) {
  return knex.schema.createTable('dependants', (table) => {
    table.string('id').primary();
    table.string('churchId').notNullable().references('id').inTable('churches');
    table.string('memberId').notNullable().references('id').inTable('members');
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('dateOfBirth').nullable();
    table.string('relationship').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());

    // Add indexes for better query performance
    table.index('churchId');
    table.index('memberId');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('dependants');
};

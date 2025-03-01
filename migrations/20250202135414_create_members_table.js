/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('members', function (table) {
    table.string('id').primary(); // Unique identifier for the member
    table.string('churchId').notNullable().references('id').inTable('churches'); // Church association
    table.string('envelopeNumber').unique().nullable(); // Unique envelope number assigned to registered members (1-4000). Unregistered members do not have one
    table.string('firstName').notNullable(); // First name
    table.string('middleName').nullable(); // Middle name
    table.string('lastName').notNullable(); // Last name
    table.string('gender').notNullable(); // Gender. Possible values: Male, Female
    table.date('dateOfBirth').nullable(); // Date of birth
    table.string('placeOfBirth').nullable(); // Place of birth
    table.string('profilePhoto').nullable(); // URL to profile image
    table.string('maritalStatus').notNullable(); // Marital status. Possible values: Single, Married, Separated, Divorced
    table.string('marriageType').notNullable(); // Type of marriage. Possible values: Christian, Non-Christian
    table.date('dateOfMarriage').nullable(); // Date of marriage
    table.string('spouseName').nullable(); // Spouse's name
    table.string('placeOfMarriage').nullable(); // Place of marriage
    table.string('phoneNumber').notNullable(); // Contact phone number
    table.string('email').nullable(); // Email address
    table.string('spousePhoneNumber').nullable(); // Spouse's contact phone number
    table.string('residenceNumber').nullable(); // House number
    table.string('residenceBlock').nullable(); // Block number
    table.string('postalBox').nullable(); // Postal address
    table.string('residenceArea').nullable(); // Place of residence
    table.string('formerChurch').nullable(); // Previous church attended
    table.string('occupation').nullable(); // Occupation
    table.string('placeOfWork').nullable(); // Place of work
    table.string('educationLevel').nullable(); // Education level. Possible values: Informal, Primary, Secondary, Certificate, Diploma, Bachelors, Masters, Doctorate, Other
    table.string('profession').nullable(); // Profession
    table.string('memberRole').notNullable().defaultTo('Regular'); // Member role
    table.boolean('isBaptized').notNullable().defaultTo(false); // Baptism status
    table.boolean('isConfirmed').notNullable().defaultTo(false); // Confirmation status
    table.boolean('partakesLordSupper').notNullable().defaultTo(false); // Participation in the Lord's Supper
    table
      .uuid('fellowshipId')
      .notNullable()
      .references('id')
      .inTable('fellowships'); // Fellowship association
    table.string('nearestMemberName').nullable(); // Nearest church member for reference
    table.string('nearestMemberPhone').nullable(); // Phone number of the nearest member
    table.boolean('attendsFellowship').notNullable().defaultTo(false); // Attendance status in fellowship
    table.string('fellowshipAbsenceReason').nullable(); // Reason for missing fellowship

    table.timestamp('createdAt').defaultTo(knex.fn.now()); // Timestamp for record creation
    table.timestamp('updatedAt').defaultTo(knex.fn.now()); // Timestamp for last update
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('members');
};

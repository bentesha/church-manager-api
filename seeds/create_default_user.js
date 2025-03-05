const uuid = require('uuid').v4;

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */

exports.seed = async function (knex) {
  // Check if the default church already exists
  const existingChurch = await knex('churches')
    .where({ name: 'My Church' })
    .first();

  churchId = existingChurch?.id || uuid().replaceAll('-', '');

  if (!existingChurch) {
    await knex('churches').insert({
      id: churchId,
      name: 'My Church',
      domainName: 'mychurch.com', // Adjust as needed
      registrationNumber: 'CHURCH-0001', // Adjust as needed
      contactPhone: '1234567890', // Adjust as needed
      contactEmail: 'contact@mychurch.com', // Adjust as needed
    });
    console.log('Default church created successfully.');
  } else {
    console.log('Default church already exists. Skipping seed.');
  }

  // Check if the admin role already exists
  const existingRole = await knex('user_roles')
    .where({ name: 'admin' })
    .first();
  const roleId = existingRole?.id || uuid().replaceAll('-', '');

  if (!existingRole) {
    await knex('user_roles').insert({
      id: roleId,
      churchId: churchId,
      name: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('Admin role created successfully.');
  } else {
    console.log('Admin role already exists. Skipping seed.');
  }

  // Check if the admin user already exists
  const existingAdmin = await knex('users')
    .where({ email: 'admin@mychurch.com' })
    .first();

  const userId = existingAdmin?.id ?? uuid().replaceAll('-', '');

  if (!existingAdmin) {
    // Generate password hash and salt manually
    const crypto = require('crypto');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .createHmac('sha256', salt)
      .update('guest')
      .digest('hex');

    // Insert default admin user
    await knex('users').insert({
      id: userId,
      name: 'Admin',
      email: 'admin@mychurch.com',
      phoneNumber: null,
      churchId: churchId,
      roleId: roleId,
      isActive: true,
      isDeleted: false,
    });

    await knex('user_credentials').insert({
      userId: userId,
      username: 'admin@mychurch.com',
      passwordHash: hash,
      passwordSalt: salt,
    });
  }

  const roleActions = [
    'user.findAll',
    'user.findById',
    'user.create',
    'user.update',
    'user.delete',
    'role.findAll',
    'role.findById',
    'fellowship.findById',
    'fellowship.findAll',
    'fellowship.create',
    'fellowship.update',
  ];

  // Recreate user roles
  await knex('role_actions').delete();

  for (const action of roleActions) {
    await knex('role_actions').insert({
      id: uuid().replaceAll('-', ''),
      roleId,
      action,
    });
  }
  console.log('Admin user created successfully.');
};
